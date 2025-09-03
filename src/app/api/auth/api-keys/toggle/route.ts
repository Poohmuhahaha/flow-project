// app/api/auth/api-keys/toggle/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { toggleApiKeyStatus } from '@/lib/db/queries';
import { getServerSession } from '@/lib/db/auth-db/auth-server';

// PUT - เปิด/ปิด API Key
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(request);
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { keyId, isActive } = body;

    if (!keyId || typeof keyId !== 'string') {
      return NextResponse.json({ error: 'API key ID is required' }, { status: 400 });
    }

    if (typeof isActive !== 'boolean') {
      return NextResponse.json({ error: 'isActive must be a boolean' }, { status: 400 });
    }

    const success = await toggleApiKeyStatus(keyId, session.userId, isActive);
    
    if (!success) {
      return NextResponse.json({ error: 'API key not found or access denied' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `API key ${isActive ? 'activated' : 'deactivated'} successfully`
    });

  } catch (error) {
    console.error('API key toggle error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
