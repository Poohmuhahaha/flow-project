// app/api/auth/api-key/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createApiKey } from '@/lib/db/queries';
import { getServerSession } from '@/lib/db/auth-db/auth-server';

// สำหรับ demo - ใช้ session authentication แทน
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(request);
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ 
        error: 'name is required' 
      }, { status: 400 });
    }

    const apiKey = await createApiKey(session.userId, name);

    return NextResponse.json({
      success: true,
      apiKey,
      message: 'API key created successfully. Store it securely - it will not be shown again.'
    });

  } catch (error) {
    console.error('API key creation error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}