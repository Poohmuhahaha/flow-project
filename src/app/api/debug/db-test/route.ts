// app/api/debug/db-test/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/index';
import { sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    const time = await db.execute(sql`SELECT NOW() as current_time`);
    console.log('Database time:', time);
    
    // Check tables exist
    const tables = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('Available tables:', tables);
    
    // Check users table structure if exists
    const usersStructure = await db.execute(sql`
      SELECT column_name, data_type, column_default
      FROM information_schema.columns 
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `);
    console.log('Users table structure:', usersStructure);
    
    return NextResponse.json({
      success: true,
      time: time,
      tables: tables,
      usersStructure: usersStructure
    });
    
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}