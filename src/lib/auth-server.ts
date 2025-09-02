// lib/auth-server.ts - Server-side auth utilities (Fixed)
import { cookies } from 'next/headers';
import { getSessionByToken } from '@/lib/auth-queries-updated';

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies(); // เพิ่ม await
    const sessionToken = cookieStore.get('session')?.value;

    if (!sessionToken) {
      return null;
    }

    const sessionData = await getSessionByToken(sessionToken);
    return sessionData?.user || null;

  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}

export async function requireAuth() {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error('Authentication required');
  }
  
  return user;
}