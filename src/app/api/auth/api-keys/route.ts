// app/api/auth/api-keys/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createApiKey, getUserApiKeys, deleteApiKey } from '@/lib/db/queries';
import { getServerSession } from '@/lib/db/auth-db/auth-server';

// GET - ดึงรายการ API Keys ของผู้ใช้
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const apiKeys = await getUserApiKeys(session.userId);

    return NextResponse.json({
      success: true,
      apiKeys: apiKeys.map(key => ({
        id: key.id,
        name: key.name,
        keyHash: key.keyHash, // ส่งกลับมาเพื่อแสดงบางส่วน
        isActive: key.isActive,
        lastUsed: key.lastUsed,
        createdAt: key.createdAt,
      }))
    });

  } catch (error) {
    console.error('Get API keys error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - สร้าง API Key ใหม่
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ 
        error: 'API key name is required' 
      }, { status: 400 });
    }

    // ตรวจสอบจำนวน API keys ที่มีอยู่ (จำกัดไม่เกิน 5 keys ต่อผู้ใช้)
    const existingKeys = await getUserApiKeys(session.userId);
    if (existingKeys.length >= 5) {
      return NextResponse.json({ 
        error: 'Maximum API keys limit reached (5 keys)' 
      }, { status: 429 });
    }

    const apiKey = await createApiKey(session.userId, name.trim());

    return NextResponse.json({
      success: true,
      apiKey,
      message: 'API key created successfully. Store it securely - it will not be shown again.'
    });

  } catch (error) {
    console.error('API key creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - ลบ API Key
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { keyId } = body;

    if (!keyId) {
      return NextResponse.json({ error: 'API key ID is required' }, { status: 400 });
    }

    const success = await deleteApiKey(keyId, session.userId);
    
    if (!success) {
      return NextResponse.json({ error: 'API key not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'API key deleted successfully'
    });

  } catch (error) {
    console.error('API key deletion error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
