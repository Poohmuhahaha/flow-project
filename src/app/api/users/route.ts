import { NextResponse } from 'next/server';
import { db } from '@/db/drizzle';
import { users } from '@/db/schema';

export async function GET() {
  try {
    // ตรวจสอบ environment variable
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Database configuration missing' },
        { status: 500 }
      );
    }

    // ดึงข้อมูล users จากฐานข้อมูล
    const usersData = await db.select().from(users);

    return NextResponse.json({
      success: true,
      data: usersData,
      count: usersData.length,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    // ตรวจสอบประเภท error
    const isDbError =
      error?.message?.includes('connect') ||
      error?.message?.includes('timeout');

    return NextResponse.json(
      {
        error: isDbError
          ? 'Database connection failed'
          : 'Internal server error',
        message:
          process.env.NODE_ENV === 'development'
            ? error.message
            : 'Something went wrong',
        timestamp: new Date().toISOString()
      },
      { status: isDbError ? 503 : 500 }
    );
  }
}
//สาธุ