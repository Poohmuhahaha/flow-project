// app/api/test/route.ts - Test database connection
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';

export async function GET() {
  try {
    console.log('Testing database connection...');
    
    // Test database connection
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        success: false,
        error: 'DATABASE_URL not found'
      }, { status: 500 });
    }

    console.log('DATABASE_URL exists:', process.env.DATABASE_URL.substring(0, 20) + '...');

    // Test simple query
    const result = await db.select().from(users).limit(1);
    console.log('Database query successful, users count:', result.length);

    // Test imports
    const { isValidEmail, isValidPassword } = await import('@/lib/db/auth-db/auth-utils-server');
    const { createUser, getUserByEmail } = await import('@/lib/db/auth-db/auth-queries');
    
    console.log('All imports successful');

    return NextResponse.json({
      success: true,
      message: 'Database connection and imports working',
      userCount: result.length,
      hasValidation: typeof isValidEmail === 'function',
      hasQueries: typeof createUser === 'function'
    });

  } catch (error: any) {
    console.error('Test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}
