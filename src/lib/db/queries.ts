// lib/db/queries.ts - Enhanced with proper error handling
import { eq, desc, and, gte, lte, sql } from 'drizzle-orm';
import { db } from './index';
import { users, apiKeys, usageLogs } from './schema';
import crypto from 'crypto';
import { createId } from '@paralleldrive/cuid2';

// Utility functions
function logQuery(operation: string, params?: any) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[DB] ${operation}:`, params || '');
  }
}

// Database connection test
export async function testDatabaseConnection() {
  try {
    const result = await db.execute(sql`SELECT 1 as test`);
    return { success: true, result };
  } catch (error) {
    console.error('Database connection test failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Check if required tables exist
export async function checkTablesExist() {
  try {
    const result = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'api_keys', 'usage_logs', 'sessions')
    `);
    
    const tableNames = result.map(row => row.table_name);
    const requiredTables = ['users', 'api_keys', 'usage_logs', 'sessions'];
    const missingTables = requiredTables.filter(table => !tableNames.includes(table));
    
    if (missingTables.length > 0) {
      return { success: false, missing: missingTables, found: tableNames };
    }
    
    return { success: true, found: tableNames };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// User queries
export async function getUserByApiKey(apiKeyHash: string) {
  try {
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
  } catch (error) {
    console.error('Failed to get user by API key:', error);
    return null;
  }
}

export async function updateUserCredits(userId: string, credits: number) {
  try {
    await db
      .update(users)
      .set({ 
        credits,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));
  } catch (error) {
    console.error('Failed to update user credits:', error);
    throw error;
  }
}

// API Key queries
export async function createApiKey(userId: string, name: string) {
  try {
    console.log('[DB] Creating API key for user:', userId, 'with name:', name);
    const rawKey = crypto.randomBytes(32).toString('hex');
    const fullApiKey = `gis_${rawKey}`;
    const keyHash = crypto.createHash('sha256').update(fullApiKey).digest('hex');
    
    console.log('[DB] Generated API key hash, inserting to database...');
    await db.insert(apiKeys).values({
      id: createId(),
      userId,
      keyHash,
      name,
    });
    
    console.log('[DB] API key inserted successfully');
    return fullApiKey; // คืนค่า API key ตัวจริง (แสดงครั้งเดียว)
  } catch (error) {
    console.error('[DB] Failed to create API key:', error);
    throw error;
  }
}

export async function updateApiKeyLastUsed(apiKeyId: string) {
  try {
    await db
      .update(apiKeys)
      .set({ lastUsed: new Date() })
      .where(eq(apiKeys.id, apiKeyId));
  } catch (error) {
    console.error('Failed to update API key last used:', error);
  }
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
  try {
    await db.insert(usageLogs).values({
      id: createId(),
      ...data
    });
  } catch (error) {
    console.error('Failed to create usage log:', error);
    throw error;
  }
}

export async function getUserUsage(userId: string, limit = 100) {
  if (!userId) {
    console.warn('[DB] getUserUsage: userId is required');
    return [];
  }

  try {
    logQuery('getUserUsage', { userId, limit });
    
    // Test connection first
    const connectionTest = await testDatabaseConnection();
    if (!connectionTest.success) {
      console.error('[DB] Connection failed for getUserUsage');
      return [];
    }
    
    // Check if usage_logs table exists
    const tablesCheck = await checkTablesExist();
    if (!tablesCheck.success) {
      console.warn('[DB] Tables check failed for getUserUsage');
      return [];
    }
    
    if (!tablesCheck.found?.includes('usage_logs')) {
      console.warn('[DB] usage_logs table does not exist');
      return [];
    }
    
    const result = await db
      .select()
      .from(usageLogs)
      .where(eq(usageLogs.userId, userId))
      .orderBy(desc(usageLogs.createdAt))
      .limit(limit);
    
    logQuery('getUserUsage success', { count: result?.length || 0 });
    return result || [];
    
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed query: getUserUsage', { 
      userId, 
      limit, 
      error: errorMsg
    });
    return [];
  }
}

// API Key queries (เพิ่มเติม)
export async function getUserApiKeys(userId: string) {
  if (!userId) {
    console.warn('[DB] getUserApiKeys: userId is required');
    return [];
  }

  try {
    logQuery('getUserApiKeys', { userId });
    
    // Test connection first
    const connectionTest = await testDatabaseConnection();
    if (!connectionTest.success) {
      console.error('[DB] Connection failed for getUserApiKeys');
      return [];
    }
    
    // Check if api_keys table exists
    const tablesCheck = await checkTablesExist();
    if (!tablesCheck.success) {
      console.warn('[DB] Tables check failed for getUserApiKeys');
      return [];
    }
    
    if (!tablesCheck.found?.includes('api_keys')) {
      console.warn('[DB] api_keys table does not exist');
      return [];
    }
    
    const result = await db
      .select()
      .from(apiKeys)
      .where(eq(apiKeys.userId, userId))
      .orderBy(desc(apiKeys.createdAt));
    
    logQuery('getUserApiKeys success', { count: result?.length || 0 });
    return result || [];
    
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed query: getUserApiKeys', { 
      userId, 
      error: errorMsg
    });
    return [];
  }
}

export async function deleteApiKey(keyId: string, userId: string) {
  try {
    const result = await db
      .delete(apiKeys)
      .where(and(
        eq(apiKeys.id, keyId),
        eq(apiKeys.userId, userId)
      ))
      .returning();
      
    return result.length > 0;
  } catch (error) {
    console.error('Failed to delete API key:', error);
    return false;
  }
}

export async function toggleApiKeyStatus(keyId: string, userId: string, isActive: boolean) {
  try {
    const result = await db
      .update(apiKeys)
      .set({ 
        isActive,
      })
      .where(and(
        eq(apiKeys.id, keyId),
        eq(apiKeys.userId, userId)
      ))
      .returning();
      
    return result.length > 0;
  } catch (error) {
    console.error('Failed to toggle API key status:', error);
    return false;
  }
}

// Credit management
export async function deductCredits(userId: string, amount: number) {
  try {
    const result = await db
      .update(users)
      .set({ 
        credits: sql`credits - ${amount}`,
        updatedAt: new Date()
      })
      .where(and(
        eq(users.id, userId),
        gte(users.credits, amount) // ตรวจสอบว่ามี credits เพียงพอ
      ))
      .returning();
      
    return result.length > 0;
  } catch (error) {
    console.error('Failed to deduct credits:', error);
    return false;
  }
}

export async function addCredits(userId: string, amount: number) {
  try {
    await db
      .update(users)
      .set({ 
        credits: sql`credits + ${amount}`,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));
  } catch (error) {
    console.error('Failed to add credits:', error);
    throw error;
  }
}

// Usage analytics
export async function getUserUsageStats(userId: string, days = 30) {
  if (!userId) {
    console.warn('[DB] getUserUsageStats: userId is required');
    return [];
  }

  const dateFrom = new Date();
  dateFrom.setDate(dateFrom.getDate() - days);
  
  try {
    logQuery('getUserUsageStats', { userId, days, dateFrom });
    
    // Test connection first
    const connectionTest = await testDatabaseConnection();
    if (!connectionTest.success) {
      console.error('[DB] Connection failed for getUserUsageStats');
      return [];
    }
    
    // Check if usage_logs table exists
    const tablesCheck = await checkTablesExist();
    if (!tablesCheck.success) {
      console.warn('[DB] Tables check failed for getUserUsageStats');
      return [];
    }
    
    if (!tablesCheck.found?.includes('usage_logs')) {
      console.warn('[DB] usage_logs table does not exist');
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
    
    logQuery('getUserUsageStats success', { count: result?.length || 0 });
    return result || [];
    
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed query: getUserUsageStats', { 
      userId, 
      days, 
      dateFrom, 
      error: errorMsg
    });
    return [];
  }
}

// Database initialization function
export async function initializeDatabase() {
  try {
    console.log('[DB] Initializing database...');
    
    // Test connection first
    const connectionTest = await testDatabaseConnection();
    if (!connectionTest.success) {
      throw new Error(`Database connection failed: ${connectionTest.error}`);
    }
    
    // Check and create tables if needed
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
    
    console.log('[DB] Database initialization completed successfully');
    return { success: true };
    
  } catch (error) {
    console.error('[DB] Database initialization failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Utility functions
export function hashApiKey(apiKey: string): string {
  return crypto.createHash('sha256').update(apiKey).digest('hex');
}
