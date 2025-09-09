// lib/db/queries.ts - COMPLETELY SILENT database operations
import { eq, desc, and, gte, lte, sql } from 'drizzle-orm';
import { db } from './index';
import { users, apiKeys, usageLogs } from './schema';
import crypto from 'crypto';
import { createId } from '@paralleldrive/cuid2';

// Global database state tracking
let dbConnectionState: 'unknown' | 'working' | 'failed' = 'unknown';
let tablesExistState: 'unknown' | 'exist' | 'missing' = 'unknown';
let lastConnectionCheck = 0;
const CONNECTION_CHECK_INTERVAL = 60000; // 1 minute

// Silent wrapper for all database operations
async function silentDbOperation<T>(operation: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    // Completely silent - no logging at all
    return fallback;
  }
}

// Enhanced database connection test with caching
export async function testDatabaseConnection(forceCheck = false) {
  const now = Date.now();
  
  // Use cached result if recent and not forcing check
  if (!forceCheck && dbConnectionState !== 'unknown' && (now - lastConnectionCheck < CONNECTION_CHECK_INTERVAL)) {
    return { success: dbConnectionState === 'working' };
  }
  
  return silentDbOperation(async () => {
    const result = await db.execute(sql`SELECT 1 as test`);
    dbConnectionState = 'working';
    lastConnectionCheck = now;
    return { success: true, result };
  }, {
    success: false,
    error: 'Connection failed'
  });
}

// Enhanced table existence check with caching
export async function checkTablesExist(forceCheck = false) {
  const now = Date.now();
  
  // Use cached result if recent and not forcing check
  if (!forceCheck && tablesExistState !== 'unknown' && (now - lastConnectionCheck < CONNECTION_CHECK_INTERVAL)) {
    return { success: tablesExistState === 'exist', cached: true };
  }
  
  return silentDbOperation(async () => {
    const result = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'api_keys', 'usage_logs', 'sessions')
    `);
    
    // Handle different result formats from different database drivers
    const resultArray = Array.isArray(result) ? result : (result as any).rows || [];
    const tableNames = resultArray.map((row: any) => row.table_name);
    const requiredTables = ['users', 'api_keys', 'usage_logs', 'sessions'];
    const missingTables = requiredTables.filter(table => !tableNames.includes(table));
    
    if (missingTables.length > 0) {
      tablesExistState = 'missing';
      return { success: false, missing: missingTables, found: tableNames };
    }
    
    tablesExistState = 'exist';
    return { success: true, found: tableNames };
  }, {
    success: false,
    error: 'Table check failed'
  });
}

// Safe database query wrapper - COMPLETELY SILENT
async function safeDbQuery<T>(
  operation: string,
  queryFn: () => Promise<T>,
  defaultValue: T
): Promise<T> {
  return silentDbOperation(async () => {
    // Quick connection check
    const connectionTest = await testDatabaseConnection();
    if (!connectionTest.success) {
      return defaultValue;
    }

    // Execute the query
    return await queryFn();
  }, defaultValue);
}

// User queries
export async function getUserByApiKey(apiKeyHash: string) {
  return safeDbQuery('getUserByApiKey', async () => {
    const result = await db
      .select({
        user: users,
        apiKey: apiKeys,
      })
      .from(apiKeys)
      .innerJoin(users, eq(apiKeys.userId, users.id))
      .where(and(
        eq(apiKeys.keyHash, apiKeyHash),
        eq(apiKeys.isActive, true)
      ))
      .limit(1);
    
    return result[0] || null;
  }, null);
}

export async function updateUserCredits(userId: string, credits: number) {
  return safeDbQuery('updateUserCredits', async () => {
    await db
      .update(users)
      .set({ 
        credits,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));
    return true;
  }, false);
}

// API Key queries
export async function createApiKey(userId: string, name: string) {
  return safeDbQuery('createApiKey', async () => {
    const rawKey = crypto.randomBytes(32).toString('hex');
    const fullApiKey = `gis_${rawKey}`;
    const keyHash = crypto.createHash('sha256').update(fullApiKey).digest('hex');
    
    await db.insert(apiKeys).values({
      id: createId(),
      userId,
      keyHash,
      name,
    });
    
    return fullApiKey;
  }, null);
}

export async function updateApiKeyLastUsed(apiKeyId: string) {
  return safeDbQuery('updateApiKeyLastUsed', async () => {
    await db
      .update(apiKeys)
      .set({ lastUsed: new Date() })
      .where(eq(apiKeys.id, apiKeyId));
    return true;
  }, false);
}

// Usage Log queries
export async function createUsageLog(data: {
  userId: string;
  apiKeyId: string;
  endpoint: string;
  creditsUsed: number;
  requestData?: any;
  responseData?: any;
  processingTime?: number;
  status: string;
  errorMessage?: string;
}) {
  return safeDbQuery('createUsageLog', async () => {
    await db.insert(usageLogs).values({
      id: createId(),
      ...data
    });
    return true;
  }, false);
}

export async function getUserUsage(userId: string, limit = 100) {
  if (!userId) {
    return [];
  }

  return safeDbQuery('getUserUsage', async () => {
    // Check if usage_logs table exists
    const tablesCheck = await checkTablesExist();
    if (!tablesCheck.success || !tablesCheck.found?.includes('usage_logs')) {
      return [];
    }
    
    const result = await db
      .select()
      .from(usageLogs)
      .where(eq(usageLogs.userId, userId))
      .orderBy(desc(usageLogs.createdAt))
      .limit(limit);
    
    return result || [];
  }, []);
}

export async function getUserApiKeys(userId: string) {
  if (!userId) {
    return [];
  }

  return safeDbQuery('getUserApiKeys', async () => {
    // Check if api_keys table exists
    const tablesCheck = await checkTablesExist();
    if (!tablesCheck.success || !tablesCheck.found?.includes('api_keys')) {
      return [];
    }
    
    const result = await db
      .select()
      .from(apiKeys)
      .where(eq(apiKeys.userId, userId))
      .orderBy(desc(apiKeys.createdAt));
    
    return result || [];
  }, []);
}

export async function deleteApiKey(keyId: string, userId: string) {
  return safeDbQuery('deleteApiKey', async () => {
    const result = await db
      .delete(apiKeys)
      .where(and(
        eq(apiKeys.id, keyId),
        eq(apiKeys.userId, userId)
      ))
      .returning();
      
    return result.length > 0;
  }, false);
}

export async function toggleApiKeyStatus(keyId: string, userId: string, isActive: boolean) {
  return safeDbQuery('toggleApiKeyStatus', async () => {
    const result = await db
      .update(apiKeys)
      .set({ isActive })
      .where(and(
        eq(apiKeys.id, keyId),
        eq(apiKeys.userId, userId)
      ))
      .returning();
      
    return result.length > 0;
  }, false);
}

// Credit management
export async function deductCredits(userId: string, amount: number) {
  return safeDbQuery('deductCredits', async () => {
    const result = await db
      .update(users)
      .set({ 
        credits: sql`credits - ${amount}`,
        updatedAt: new Date()
      })
      .where(and(
        eq(users.id, userId),
        gte(users.credits, amount)
      ))
      .returning();
      
    return result.length > 0;
  }, false);
}

export async function addCredits(userId: string, amount: number) {
  return safeDbQuery('addCredits', async () => {
    await db
      .update(users)
      .set({ 
        credits: sql`credits + ${amount}`,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));
    return true;
  }, false);
}

// Usage analytics
export async function getUserUsageStats(userId: string, days = 30) {
  if (!userId) {
    return [];
  }

  const dateFrom = new Date();
  dateFrom.setDate(dateFrom.getDate() - days);
  
  return safeDbQuery('getUserUsageStats', async () => {
    // Check if usage_logs table exists
    const tablesCheck = await checkTablesExist();
    if (!tablesCheck.success || !tablesCheck.found?.includes('usage_logs')) {
      return [];
    }
    
    const result = await db
      .select({
        date: sql<string>`date_trunc('day', created_at)::text`,
        requests: sql<number>`count(*)::int`,
        creditsUsed: sql<number>`coalesce(sum(credits_used), 0)::int`,
        successRate: sql<number>`coalesce((avg(case when status = 'success' then 1.0 else 0.0 end) * 100), 0)::float`
      })
      .from(usageLogs)
      .where(and(
        eq(usageLogs.userId, userId),
        gte(usageLogs.createdAt, dateFrom)
      ))
      .groupBy(sql`date_trunc('day', created_at)`)
      .orderBy(sql`date_trunc('day', created_at)`);
    
    return result || [];
  }, []);
}

// Database initialization function
export async function initializeDatabase() {
  return silentDbOperation(async () => {
    console.log('[DB] Initializing database...');
    
    // Force check connection
    const connectionTest = await testDatabaseConnection(true);
    if (!connectionTest.success) {
      throw new Error(`Database connection failed: ${connectionTest.error}`);
    }
    
    // Create tables if needed
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS "users" (
        "id" text PRIMARY KEY NOT NULL,
        "email" text UNIQUE NOT NULL,
        "password_hash" text NOT NULL,
        "first_name" text NOT NULL,
        "last_name" text NOT NULL,
        "company" text,
        "role" text,
        "name" text,
        "credits" integer DEFAULT 1000 NOT NULL,
        "is_active" boolean DEFAULT true NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      );
    `;
    
    const createApiKeysTable = `
      CREATE TABLE IF NOT EXISTS "api_keys" (
        "id" text PRIMARY KEY NOT NULL,
        "user_id" text NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "key_hash" text UNIQUE NOT NULL,
        "name" text NOT NULL,
        "is_active" boolean DEFAULT true NOT NULL,
        "last_used" timestamp,
        "created_at" timestamp DEFAULT now() NOT NULL
      );
    `;
    
    const createUsageLogsTable = `
      CREATE TABLE IF NOT EXISTS "usage_logs" (
        "id" text PRIMARY KEY NOT NULL,
        "user_id" text NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "api_key_id" text NOT NULL REFERENCES "api_keys"("id"),
        "endpoint" text NOT NULL,
        "credits_used" integer NOT NULL,
        "request_data" jsonb,
        "response_data" jsonb,
        "processing_time" integer,
        "status" text NOT NULL,
        "error_message" text,
        "created_at" timestamp DEFAULT now() NOT NULL
      );
    `;
    
    const createSessionsTable = `
      CREATE TABLE IF NOT EXISTS "sessions" (
        "id" text PRIMARY KEY NOT NULL,
        "user_id" text NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "token" text UNIQUE NOT NULL,
        "expires_at" timestamp NOT NULL,
        "user_agent" text,
        "ip_address" text,
        "created_at" timestamp DEFAULT now() NOT NULL
      );
    `;
    
    const createPasswordResetTokensTable = `
      CREATE TABLE IF NOT EXISTS "password_reset_tokens" (
        "id" text PRIMARY KEY NOT NULL,
        "user_id" text NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "token" text UNIQUE NOT NULL,
        "expires_at" timestamp NOT NULL,
        "is_used" boolean DEFAULT false NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL
      );
    `;
    
    await db.execute(sql.raw(createUsersTable));
    await db.execute(sql.raw(createApiKeysTable));
    await db.execute(sql.raw(createUsageLogsTable));
    await db.execute(sql.raw(createSessionsTable));
    await db.execute(sql.raw(createPasswordResetTokensTable));
    
    // Create indexes
    const indexes = [
      'CREATE INDEX IF NOT EXISTS "idx_api_keys_user_id" ON "api_keys" ("user_id");',
      'CREATE INDEX IF NOT EXISTS "idx_api_keys_key_hash" ON "api_keys" ("key_hash");',
      'CREATE INDEX IF NOT EXISTS "idx_usage_logs_user_id" ON "usage_logs" ("user_id");',
      'CREATE INDEX IF NOT EXISTS "idx_usage_logs_api_key_id" ON "usage_logs" ("api_key_id");',
      'CREATE INDEX IF NOT EXISTS "idx_usage_logs_created_at" ON "usage_logs" ("created_at");',
      'CREATE INDEX IF NOT EXISTS "idx_sessions_user_id" ON "sessions" ("user_id");',
      'CREATE INDEX IF NOT EXISTS "idx_sessions_token" ON "sessions" ("token");'
    ];
    
    for (const indexSql of indexes) {
      await db.execute(sql.raw(indexSql));
    }
    
    // Reset cache after successful initialization
    dbConnectionState = 'working';
    tablesExistState = 'exist';
    lastConnectionCheck = Date.now();
    
    console.log('[DB] Database initialization completed successfully');
    return { success: true };
  }, {
    success: false,
    error: 'Database initialization failed'
  });
}

// Utility functions
export function hashApiKey(apiKey: string): string {
  return crypto.createHash('sha256').update(apiKey).digest('hex');
}

// Health check function for debugging
export async function getDatabaseHealth() {
  const connectionTest = await testDatabaseConnection(true);
  const tablesCheck = await checkTablesExist(true);
  
  return {
    connection: connectionTest,
    tables: tablesCheck,
    cache: {
      dbConnectionState,
      tablesExistState,
      lastConnectionCheck: new Date(lastConnectionCheck).toISOString()
    },
    environment: {
      nodeEnv: process.env.NODE_ENV,
      hasDbUrl: !!process.env.DATABASE_URL,
      dbUrlHost: process.env.DATABASE_URL ? new URL(process.env.DATABASE_URL).host : 'none'
    }
  };
}
