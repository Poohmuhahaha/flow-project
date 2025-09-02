// lib/db/auth-queries.ts - Fixed version
import { eq, and, gt, lt } from 'drizzle-orm';
import { db } from '../index';
import { users, sessions, passwordResetTokens } from '../schema';
import { hashPassword, generateSecureToken } from '@/lib/db/auth-db/auth-utils';

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
  const currentDate = new Date();
  
  await db
    .update(users)
    .set({ updatedAt: currentDate })
    .where(eq(users.id, userId));
}

// Session Management
export async function createSession(userId: string, userAgent?: string, ipAddress?: string) {
  const token = generateSecureToken();
  const currentDate = new Date();
  const expiresAt = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
  
  const session = await db.insert(sessions).values({
    userId,
    token,
    expiresAt,
    userAgent,
    ipAddress,
  }).returning();
  
  return session[0];
}

export async function getSessionByToken(token: string) {
  const currentDate = new Date();
  
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
      gt(sessions.expiresAt, currentDate),
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
  const currentDate = new Date();
  await db.delete(sessions).where(lt(sessions.expiresAt, currentDate));
}

// Password Reset
export async function createPasswordResetToken(userId: string) {
  const token = generateSecureToken();
  const currentDate = new Date();
  const expiresAt = new Date(currentDate.getTime() + 60 * 60 * 1000); // 1 hour
  
  const resetToken = await db.insert(passwordResetTokens).values({
    userId,
    token,
    expiresAt,
  }).returning();
  
  return resetToken[0];
}

export async function getPasswordResetToken(token: string) {
  const currentDate = new Date();
  
  const result = await db
    .select({
      resetToken: passwordResetTokens,
      user: users
    })
    .from(passwordResetTokens)
    .innerJoin(users, eq(passwordResetTokens.userId, users.id))
    .where(and(
      eq(passwordResetTokens.token, token),
      gt(passwordResetTokens.expiresAt, currentDate),
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

export async function updateUserPassword(userId: string, newPassword: string) {
  const passwordHash = await hashPassword(newPassword);
  const currentDate = new Date();
  
  await db
    .update(users)
    .set({ 
      passwordHash,
      updatedAt: currentDate
    })
    .where(eq(users.id, userId));
}

// Utility functions
export async function getUserSessionCount(userId: string): Promise<number> {
  const currentDate = new Date();
  
  const result = await db
    .select()
    .from(sessions)
    .where(and(
      eq(sessions.userId, userId),
      gt(sessions.expiresAt, currentDate)
    ));
    
  return result.length;
}