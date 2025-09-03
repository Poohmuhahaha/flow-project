// app/api/credits/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { authenticateApiKey } from '@/lib/db/auth-db/auth';
import { addCredits, deductCredits } from '@/lib/db/queries';
import { getServerSession } from '@/lib/db/auth-db/auth-server';

// GET - ดูข้อมูล credits ปัจจุบัน
export async function GET(request: NextRequest) {
  try {
    // ลองใช้ API key authentication ก่อน
    const apiAuth = await authenticateApiKey(request);
    
    if ('error' in apiAuth) {
      // ถ้าไม่มี API key ให้ลอง session authentication
      const session = await getServerSession(request);
      if (!session) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
      }
      
      return NextResponse.json({
        success: true,
        credits: session.credits,
        userId: session.userId
      });
    }

    return NextResponse.json({
      success: true,
      credits: apiAuth.user.credits,
      userId: apiAuth.user.id
    });

  } catch (error) {
    console.error('Credits fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - เพิ่ม credits (สำหรับ admin หรือ payment system)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(request);
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { amount, reason } = body;

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ 
        error: 'Valid amount is required' 
      }, { status: 400 });
    }

    await addCredits(session.userId, amount);

    return NextResponse.json({
      success: true,
      message: `${amount} credits added successfully`,
      reason: reason || 'Manual credit addition'
    });

  } catch (error) {
    console.error('Credits addition error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - หัก credits (สำหรับ internal usage)
export async function PUT(request: NextRequest) {
  try {
    const apiAuth = await authenticateApiKey(request);
    if ('error' in apiAuth) {
      return NextResponse.json({ error: apiAuth.error }, { status: apiAuth.status });
    }

    const body = await request.json();
    const { amount } = body;

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ 
        error: 'Valid amount is required' 
      }, { status: 400 });
    }

    const success = await deductCredits(apiAuth.user.id, amount);
    
    if (!success) {
      return NextResponse.json({ 
        error: 'Insufficient credits' 
      }, { status: 402 }); // Payment Required
    }

    return NextResponse.json({
      success: true,
      message: `${amount} credits deducted successfully`,
      remainingCredits: apiAuth.user.credits - amount
    });

  } catch (error) {
    console.error('Credits deduction error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
