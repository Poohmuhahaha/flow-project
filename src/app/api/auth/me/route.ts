// app/api/auth/me/route.ts - Updated imports  
import { NextRequest, NextResponse } from 'next/server';
import { getSessionByToken } from '@/lib/db/auth-db/auth-queries-updated';
import { getSessionFromRequest } from '@/lib/db/auth-db/auth-utils-edge';

export async function GET(request: NextRequest) {
  try {
    const sessionToken = getSessionFromRequest(request);
    
    if (!sessionToken) {
      return NextResponse.json({ 
        error: 'No session found' 
      }, { status: 401 });
    }

    const sessionData = await getSessionByToken(sessionToken);
    
    if (!sessionData) {
      return NextResponse.json({ 
        error: 'Invalid session' 
      }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: sessionData.user
    });

  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}