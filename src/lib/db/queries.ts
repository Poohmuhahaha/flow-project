// lib/db/queries.ts
import { eq, desc, and, gte, lte } from 'drizzle-orm';
import { db } from './index';
import { users, apiKeys, usageLogs } from './schema';
import crypto from 'crypto';

// User queries
export async function getUserByApiKey(apiKeyHash: string) {
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
}

export async function updateUserCredits(userId: string, credits: number) {
  await db
    .update(users)
    .set({ 
      credits,
      updatedAt: new Date()
    })
    .where(eq(users.id, userId));
}

// API Key queries
export async function createApiKey(userId: string, name: string) {
  const rawKey = crypto.randomBytes(32).toString('hex');
  const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');
  
  await db.insert(apiKeys).values({
    userId,
    keyHash,
    name,
  });
  
  return `gis_${rawKey}`; // คืนค่า API key ตัวจริง (แสดงครั้งเดียว)
}

export async function updateApiKeyLastUsed(apiKeyId: string) {
  await db
    .update(apiKeys)
    .set({ lastUsed: new Date() })
    .where(eq(apiKeys.id, apiKeyId));
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
  await db.insert(usageLogs).values(data);
}

export async function getUserUsage(userId: string, limit = 100) {
  return await db
    .select()
    .from(usageLogs)
    .where(eq(usageLogs.userId, userId))
    .orderBy(desc(usageLogs.createdAt))
    .limit(limit);
}

// Utility functions
export function hashApiKey(apiKey: string): string {
  return crypto.createHash('sha256').update(apiKey).digest('hex');
}