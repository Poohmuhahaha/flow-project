// lib/db/queries.ts
import { eq, desc, and, gte, lte, sql } from 'drizzle-orm';
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
  const fullApiKey = `gis_${rawKey}`;
  const keyHash = crypto.createHash('sha256').update(fullApiKey).digest('hex');
  
  await db.insert(apiKeys).values({
    userId,
    keyHash,
    name,
  });
  
  return fullApiKey; // คืนค่า API key ตัวจริง (แสดงครั้งเดียว)
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

// API Key queries (เพิ่มเติม)
export async function getUserApiKeys(userId: string) {
  return await db
    .select()
    .from(apiKeys)
    .where(eq(apiKeys.userId, userId))
    .orderBy(desc(apiKeys.createdAt));
}

export async function deleteApiKey(keyId: string, userId: string) {
  const result = await db
    .delete(apiKeys)
    .where(and(
      eq(apiKeys.id, keyId),
      eq(apiKeys.userId, userId)
    ))
    .returning();
    
  return result.length > 0;
}

export async function toggleApiKeyStatus(keyId: string, userId: string, isActive: boolean) {
  const result = await db
    .update(apiKeys)
    .set({ 
      isActive,
      // updatedAt: new Date() // ลบออกเพราะอาจไม่มี column นี้ใน DB
    })
    .where(and(
      eq(apiKeys.id, keyId),
      eq(apiKeys.userId, userId)
    ))
    .returning();
    
  return result.length > 0;
}

// Credit management
export async function deductCredits(userId: string, amount: number) {
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
}

export async function addCredits(userId: string, amount: number) {
  await db
    .update(users)
    .set({ 
      credits: sql`credits + ${amount}`,
      updatedAt: new Date()
    })
    .where(eq(users.id, userId));
}

// Usage analytics
export async function getUserUsageStats(userId: string, days = 30) {
  const dateFrom = new Date();
  dateFrom.setDate(dateFrom.getDate() - days);
  
  return await db
    .select({
      date: sql<string>`date_trunc('day', created_at)`,
      requests: sql<number>`count(*)`,
      creditsUsed: sql<number>`sum(credits_used)`,
      successRate: sql<number>`avg(case when status = 'success' then 1.0 else 0.0 end) * 100`
    })
    .from(usageLogs)
    .where(and(
      eq(usageLogs.userId, userId),
      gte(usageLogs.createdAt, dateFrom)
    ))
    .groupBy(sql`date_trunc('day', created_at)`)
    .orderBy(sql`date_trunc('day', created_at)`);
}

// Utility functions
export function hashApiKey(apiKey: string): string {
  return crypto.createHash('sha256').update(apiKey).digest('hex');
}