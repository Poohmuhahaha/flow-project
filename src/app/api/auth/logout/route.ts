// app/api/auth/logout/route.ts - Fixed with await
import { NextRequest, NextResponse } from 'next/server';
import { deleteSession } from '@/lib/auth-queries-updated';
import { clearSessionCookie } from '@/lib/auth-utils-server';
import { getSessionFromRequest } from '@/lib/auth-utils-edge';

export async function POST(request: NextRequest) {
  try {
    const sessionToken = getSessionFromRequest(request);
    
    if (sessionToken) {
      await deleteSession(sessionToken);
    }
    
    // Clear cookie - ใช้ await
    await clearSessionCookie();

    return NextResponse.json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}