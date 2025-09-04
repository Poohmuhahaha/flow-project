// app/api/demo/setup-simple/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, apiKeys } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';
import { createId } from '@paralleldrive/cuid2';

// POST - สร้าง demo user และ API key ด้วย Drizzle ORM
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name = 'Demo User', credits = 1000 } = body;

    if (!email) {
      return NextResponse.json({
         error: 'Email is required'
       }, { status: 400 });
    }

    // สร้าง API key
    const rawKey = crypto.randomBytes(32).toString('hex');
    const fullApiKey = `gis_${rawKey}`;
    const keyHash = crypto.createHash('sha256').update(fullApiKey).digest('hex');

    try {
      // ตรวจสอบว่า user มีอยู่แล้วหรือไม่
      let user = await db.query.users.findFirst({
        where: eq(users.email, email)
      });

      if (user) {
        // อัปเดต credits ของ user ที่มีอยู่
        await db.update(users)
          .set({ 
            credits: credits,
            updatedAt: new Date()
          })
          .where(eq(users.email, email));
      } else {
        // สร้าง user ใหม่
        const [newUser] = await db.insert(users).values({
          id: createId(),
          email,
          passwordHash: 'demo_hash',
          firstName: name,
          lastName: 'Demo',
          credits,
          isActive: true
        }).returning();
        user = newUser;
      }

      // สร้าง API key ใหม่
      await db.insert(apiKeys).values({
        id: createId(),
        userId: user.id,
        keyHash,
        name: `Demo API Key - ${new Date().toISOString()}`,
        isActive: true
      });

      return NextResponse.json({
        success: true,
        message: 'Demo setup completed successfully!',
        user: {
          id: user.id,
          email: user.email,
          credits: user.credits
        },
        apiKey: fullApiKey,
        instructions: {
          usage: 'Use this API key in Authorization header: Bearer YOUR_API_KEY',
          testEndpoint: '/api/demo',
          example: `curl -X GET http://localhost:3000/api/demo -H \"Authorization: Bearer ${fullApiKey}\"`
        }
      });

    } catch (dbError: any) {
      console.error('Database error:', dbError);
      return NextResponse.json({
         error: 'Database operation failed',
        details: dbError.message,
        suggestion: 'Check if database is properly connected and tables exist'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Demo setup error:', error);
    return NextResponse.json({
       error: 'Failed to setup demo',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// GET - ดู instructions
export async function GET() {
  return NextResponse.json({
    message: 'Simple Demo Setup (uses Drizzle ORM)',
    instructions: {
      step1: 'POST to this endpoint with {\"email\": \"your@email.com\"}',
      step2: 'If you get DB errors, check database connection and migrations',
      step3: 'Use the returned API key to test other endpoints'
    },
    example: `curl -X POST http://localhost:3000/api/demo/setup-simple -H \"Content-Type: application/json\" -d '{\"email\": \"demo@example.com\"}'`
  });
}