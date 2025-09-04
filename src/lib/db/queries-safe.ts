// lib/db/queries-safe.ts - Enhanced error handling and logging
import { eq, desc, and, gte, lte, sql } from 'drizzle-orm';
import { db } from './index';
import { users, apiKeys, usageLogs } from './schema';
import crypto from 'crypto';
import { createId } from '@paralleldrive/cuid2';

// Enhanced logging utility
function logQuery(query: string, params?: any) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[DB Query] ${query}`, params ? JSON.stringify(params, null, 2) : '');
  }
}

// Database connection test
export async function testDatabaseConnection() {
  try {
    logQuery('Testing database connection');
    const result = await db.execute(sql`SELECT 1 as test`);
    console.log('✅ Database connection successful');
    return { success: true, result };
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Check if tables exist
export async function checkTablesExist() {
  try {
    logQuery('Checking if tables exist');
    const result = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'api_keys', 'usage_logs', 'sessions')
    `);
    
    const tableNames = result.rows.map(row => row.table_name);
    const requiredTables = ['users', 'api_keys', 'usage_logs', 'sessions'];
    const missingTables = requiredTables.filter(table => !tableNames.includes(table));
    
    console.log('📋 Found tables:', tableNames);
    if (missingTables.length > 0) {
      console.log('❌ Missing tables:', missingTables);
      return { success: false, missing: missingTables, found: tableNames };
    }
    
    console.log('✅ All required tables exist');
    return { success: true, found: tableNames };
  } catch (error) {
    console.error('❌ Table check failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Enhanced getUserApiKeys with better error handling
export async function getUserApiKeys(userId: string) {
  if (!userId) {
    console.error('❌ getUserApiKeys: userId is required');
    return [];
  }

  try {
    logQuery('getUserApiKeys', { userId });
    
    // Test connection first
    const connectionTest = await testDatabaseConnection();
    if (!connectionTest.success) {
      console.error('❌ Database connection failed for getUserApiKeys');
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
    console.error('❌ Failed query: getUserApiKeys', { 
      userId, 
      error: errorMsg,
      stack: error instanceof Error ? error.stack : undefined
    });
    return [];
  }
}

// Enhanced getUserUsage with better error handling
export async function getUserUsage(userId: string, limit = 100) {
  if (!userId) {
    console.error('❌ getUserUsage: userId is required');
    return [];
  }

  try {
    logQuery('getUserUsage', { userId, limit });
    
    // Test connection first
    const connectionTest = await testDatabaseConnection();
    if (!connectionTest.success) {
      console.error('❌ Database connection failed for getUserUsage');
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
    console.error('❌ Failed query: getUserUsage', { 
      userId, 
      limit, 
      error: errorMsg,
      stack: error instanceof Error ? error.stack : undefined
    });
    return [];
  }
}

// Enhanced getUserUsageStats with better error handling
export async function getUserUsageStats(userId: string, days = 30) {
  if (!userId) {
    console.error('❌ getUserUsageStats: userId is required');
    return [];
  }

  const dateFrom = new Date();
  dateFrom.setDate(dateFrom.getDate() - days);
  
  try {
    logQuery('getUserUsageStats', { userId, days, dateFrom });
    
    // Test connection first
    const connectionTest = await testDatabaseConnection();
    if (!connectionTest.success) {
      console.error('❌ Database connection failed for getUserUsageStats');
      return [];
    }
    
    // Check if usage_logs table exists
    const tablesCheck = await checkTablesExist();
    if (!tablesCheck.success || !tablesCheck.found?.includes('usage_logs')) {
      console.error('❌ usage_logs table does not exist');
      return [];
    }
    
    const result = await db
      .select({
        date: sql<string>`date_trunc('day', created_at)::text`,
        requests: sql<number>`count(*)::int`,
        creditsUsed: sql<number>`sum(credits_used)::int`,
        successRate: sql<number>`(avg(case when status = 'success' then 1.0 else 0.0 end) * 100)::float`
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
    console.error('❌ Failed query: getUserUsageStats', { 
      userId, 
      days, 
      dateFrom, 
      error: errorMsg,
      stack: error instanceof Error ? error.stack : undefined
    });
    return [];
  }
}

// Enhanced createApiKey with better error handling
export async function createApiKey(userId: string, name: string) {
  if (!userId || !name) {
    throw new Error('userId and name are required');
  }

  try {
    logQuery('createApiKey', { userId, name });
    
    // Test connection first
    const connectionTest = await testDatabaseConnection();
    if (!connectionTest.success) {
      throw new Error('Database connection failed');
    }
    
    const rawKey = crypto.randomBytes(32).toString('hex');
    const fullApiKey = `gis_${rawKey}`;
    const keyHash = crypto.createHash('sha256').update(fullApiKey).digest('hex');
    
    await db.insert(apiKeys).values({
      id: createId(),
      userId,
      keyHash,
      name,
    });
    
    logQuery('createApiKey success', { keyHash: keyHash.substring(0, 8) + '...' });
    return fullApiKey;
    
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Failed to create API key:', {
      userId,
      name,
      error: errorMsg,
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
}

// Enhanced deleteApiKey with better error handling
export async function deleteApiKey(keyId: string, userId: string) {
  if (!keyId || !userId) {
    throw new Error('keyId and userId are required');
  }

  try {
    logQuery('deleteApiKey', { keyId, userId });
    
    const result = await db
      .delete(apiKeys)
      .where(and(
        eq(apiKeys.id, keyId),
        eq(apiKeys.userId, userId)
      ))
      .returning();
    
    const success = result.length > 0;
    logQuery('deleteApiKey result', { success });
    return success;
    
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Failed to delete API key:', {
      keyId,
      userId,
      error: errorMsg
    });
    throw error;
  }
}

// Enhanced toggleApiKeyStatus with better error handling
export async function toggleApiKeyStatus(keyId: string, userId: string, isActive: boolean) {
  if (!keyId || !userId) {
    throw new Error('keyId and userId are required');
  }

  try {
    logQuery('toggleApiKeyStatus', { keyId, userId, isActive });
    
    const result = await db
      .update(apiKeys)
      .set({ isActive })
      .where(and(
        eq(apiKeys.id, keyId),
        eq(apiKeys.userId, userId)
      ))
      .returning();
    
    const success = result.length > 0;
    logQuery('toggleApiKeyStatus result', { success });
    return success;
    
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Failed to toggle API key status:', {
      keyId,
      userId,
      isActive,
      error: errorMsg
    });
    throw error;
  }
}

// Database health check endpoint
export async function performHealthCheck() {
  try {
    const results = {
      connection: await testDatabaseConnection(),
      tables: await checkTablesExist(),
      timestamp: new Date().toISOString()
    };
    
    const isHealthy = results.connection.success && results.tables.success;
    
    return {
      healthy: isHealthy,
      details: results
    };
  } catch (error) {
    return {
      healthy: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Export all existing functions with safety wrappers
export * from './queries';
