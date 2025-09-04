// app/api/demo/setup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { createApiKey } from '@/lib/db/queries';
import { eq } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';

// POST - สร้าง demo user และ API key สำหรับทดสอบ
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name = 'Demo User', credits = 1000 } = body;

    if (!email) {
      return NextResponse.json({ 
        error: 'Email is required' 
      }, { status: 400 });
    }

    // ตรวจสอบว่า user มีอยู่แล้วหรือไม่
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    let userId: string;

    if (existingUser.length > 0) {
      // ใช้ user ที่มีอยู่
      userId = existingUser[0].id;
      
      // อัพเดทเครดิต
      await db
        .update(users)
        .set({ 
          credits,
          updatedAt: new Date()
        })
        .where(eq(users.id, userId));

    } else {
      // สร้าง user ใหม่
      const newUsers = await db.insert(users).values({
        id: createId(),
        email,
        passwordHash: 'demo_password_hash', // ใช้ในการ demo เท่านั้น
        firstName: name,
        lastName: 'Demo',
        credits,
        isActive: true,
      }).returning();

      userId = newUsers[0].id;
    }

    // สร้าง API key
    const apiKey = await createApiKey(userId, `Demo API Key - ${new Date().toISOString()}`);

    // ดึงข้อมูล user อัพเดท
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    return NextResponse.json({
      success: true,
      message: 'Demo setup completed successfully!',
      user: {
        id: user[0].id,
        email: user[0].email,
        credits: user[0].credits
      },
      apiKey,
      instructions: {
        usage: 'Use this API key in Authorization header: Bearer YOUR_API_KEY',
        testEndpoint: '/api/demo',
        example: `curl -X GET http://localhost:3000/api/demo -H "Authorization: Bearer ${apiKey}"`
      }
    });

  } catch (error) {
    console.error('Demo setup error:', error);
    return NextResponse.json({ 
      error: 'Failed to setup demo',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// GET - ดู instructions สำหรับการ setup
export async function GET() {
  return NextResponse.json({
    message: 'Demo Setup Instructions',
    instructions: {
      step1: 'POST to this endpoint with {"email": "your@email.com"} to create a demo user and API key',
      step2: 'Use the returned API key to test other endpoints',
      step3: 'Test with /api/demo endpoint',
    },
    example: {
      setup: `curl -X POST http://localhost:3000/api/demo/setup -H "Content-Type: application/json" -d '{"email": "demo@example.com", "credits": 1000}'`,
      test: `curl -X GET http://localhost:3000/api/demo -H "Authorization: Bearer YOUR_API_KEY"`
    }
  });
}
