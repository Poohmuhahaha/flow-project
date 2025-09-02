// app/api/auth/api-key/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createApiKey } from '@/lib/db/queries';

// สำหรับ demo - ในการใช้งานจริงต้องมี user authentication
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, name } = body;

    if (!userId || !name) {
      return NextResponse.json({ 
        error: 'userId and name are required' 
      }, { status: 400 });
    }

    const apiKey = await createApiKey(userId, name);

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