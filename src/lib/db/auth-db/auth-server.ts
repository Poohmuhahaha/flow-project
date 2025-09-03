// lib/db/auth-db/auth-server.ts
import { NextRequest } from 'next/server';
import crypto from 'crypto';
import { cookies } from 'next/headers';
import { db } from '../index';
import { sessions, users } from '../schema';
import { eq, and, gt } from 'drizzle-orm';

export interface ServerSession {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  credits: number;
}

export async function getServerSession(request?: NextRequest): Promise<ServerSession | null> {
  try {
    let sessionToken: string | undefined;

    if (request) {
      // ใน API route
      sessionToken = request.cookies.get('session_token')?.value;
    } else {
      // ใน server component
      const cookieStore = cookies();
      sessionToken = cookieStore.get('session_token')?.value;
    }

    if (!sessionToken) {
      return null;
    }

    // ตรวจสอบ session ในฐานข้อมูล
    const result = await db
      .select({
        session: sessions,
        user: users
      })
      .from(sessions)
      .innerJoin(users, eq(sessions.userId, users.id))
      .where(and(
        eq(sessions.token, sessionToken),
        gt(sessions.expiresAt, new Date())
      ))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const { user } = result[0];

    return {
      userId: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      credits: user.credits
    };

  } catch (error) {
    console.error('Session validation error:', error);
    return null;
  }
}

export async function createSession(userId: string, userAgent?: string, ipAddress?: string) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30); // หมดอายุใน 30 วัน

  await db.insert(sessions).values({
    userId,
    token,
    expiresAt,
    userAgent,
    ipAddress
  });

  return token;
}

export async function deleteSession(sessionToken: string) {
  await db
    .delete(sessions)
    .where(eq(sessions.token, sessionToken));
}

export async function deleteAllUserSessions(userId: string) {
  await db
    .delete(sessions)
    .where(eq(sessions.userId, userId));
}
