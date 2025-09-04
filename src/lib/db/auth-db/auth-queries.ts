// lib/auth-queries-updated.ts - Fixed date issues
import { eq, and, gt, sql, lt } from 'drizzle-orm';
import { db } from '../index';
import { users, sessions, passwordResetTokens } from '../schema';
import { hashPassword, generateSecureTokenServer } from '@/lib/db/auth-db/auth-utils-server';
import { generateUserId, generateSessionId, generatePasswordResetId } from '@/lib/db/uuid-helpers';

// User Management
export async function createUser(userData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  company?: string;
  role?: string;
}) {
  const passwordHash = await hashPassword(userData.password);
  
  const newUser = await db.insert(users).values({
    id: generateUserId(),
    email: userData.email,
    passwordHash,
    firstName: userData.firstName,
    lastName: userData.lastName,
    company: userData.company,
    role: userData.role,
  }).returning();
  
  return newUser[0];
}

export async function getUserByEmail(email: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
    
  return result[0] || null;
}

export async function getUserById(id: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
    
  return result[0] || null;
}

export async function updateUserLastLogin(userId: string) {
  const now = new Date();
  await db
    .update(users)
    .set({ updatedAt: now })
    .where(eq(users.id, userId));
}

// Session Management
export async function createSession(userId: string, userAgent?: string, ipAddress?: string) {
  const token = generateSecureTokenServer();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  
  const session = await db.insert(sessions).values({
    id: generateSessionId(),
    userId,
    token,
    expiresAt,
    userAgent,
    ipAddress,
  }).returning();
  
  return session[0];
}

export async function getSessionByToken(token: string) {
  const now = new Date();
  
  const result = await db
    .select({
      session: sessions,
      user: {
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        company: users.company,
        role: users.role,
        credits: users.credits,
        isActive: users.isActive,
      }
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(and(
      eq(sessions.token, token),
      gt(sessions.expiresAt, now),
      eq(users.isActive, true)
    ))
    .limit(1);
    
  return result[0] || null;
}

export async function deleteSession(token: string) {
  await db.delete(sessions).where(eq(sessions.token, token));
}

export async function deleteAllUserSessions(userId: string) {
  await db.delete(sessions).where(eq(sessions.userId, userId));
}

export async function cleanupExpiredSessions() {
  const now = new Date();

  // 2. ใช้ `lt` ในเงื่อนไข where เพื่อเปรียบเทียบค่า
  //    ความหมาย: "ลบ session ที่คอลัมน์ expiresAt มีค่าน้อยกว่า (เกิดก่อน) เวลาปัจจุบัน"
  await db.delete(sessions).where(lt(sessions.expiresAt, now));
  
  console.log('Expired sessions have been cleaned up.');
}

// Password Reset
export async function createPasswordResetToken(userId: string) {
  const token = generateSecureTokenServer();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  
  const resetToken = await db.insert(passwordResetTokens).values({
    id: generatePasswordResetId(),
    userId,
    token,  
    expiresAt,
  }).returning();
  
  return resetToken[0];
}

export async function getPasswordResetToken(token: string) {
  const now = new Date();
  
  const result = await db
    .select({
      resetToken: passwordResetTokens,
      user: users
    })
    .from(passwordResetTokens)
    .innerJoin(users, eq(passwordResetTokens.userId, users.id))
    .where(and(
      eq(passwordResetTokens.token, token),
      gt(passwordResetTokens.expiresAt, now),
      eq(passwordResetTokens.isUsed, false)
    ))
    .limit(1);
    
  return result[0] || null;
}

export async function markPasswordResetTokenAsUsed(tokenId: string) {
  await db
    .update(passwordResetTokens)
    .set({ isUsed: true })
    .where(eq(passwordResetTokens.id, tokenId));
}

export async function usePasswordResetToken(token: string) {
  await db
    .update(passwordResetTokens)
    .set({ isUsed: true })
    .where(eq(passwordResetTokens.token, token));
}


export async function updateUserPassword(userId: string, newPassword: string) {
  const passwordHash = await hashPassword(newPassword);
  const now = new Date();
  
  await db
    .update(users)
    .set({ 
      passwordHash,
      updatedAt: now
    })
    .where(eq(users.id, userId));
}

// Utility functions
export async function getUserSessionCount(userId: string): Promise<number> {
  const now = new Date();
  
  const result = await db
    .select()
    .from(sessions)
    .where(and(
      eq(sessions.userId, userId),
      gt(sessions.expiresAt, now)
    ));
    
  return result.length;
}

// Alternative: Using SQL function for current timestamp (if above doesn't work)
export async function getSessionByTokenSQL(token: string) {
  const result = await db
    .select({
      session: sessions,
      user: {
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        company: users.company,
        role: users.role,
        credits: users.credits,
        isActive: users.isActive,
      }
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(and(
      eq(sessions.token, token),
      sql`${sessions.expiresAt} > NOW()`,
      eq(users.isActive, true)
    ))
    .limit(1);
    
  return result[0] || null;
}

export async function cleanupExpiredSessionsSQL() {
  await db.delete(sessions).where(sql`${sessions.expiresAt} <= NOW()`);
}