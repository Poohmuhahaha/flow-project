// app/api/admin/fix-db/route.ts - Fix database schema
import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function POST() {
  try {
    console.log('🔧 Starting database schema fix...');
    
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        success: false,
        error: 'DATABASE_URL not found'
      }, { status: 500 });
    }

    const sql = neon(process.env.DATABASE_URL);
    
    // Step 1: Check current table structure
    console.log('📊 Checking current table structure...');
    const tableInfo = await sql`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position;
    `;
    
    console.log('Current users table columns:', tableInfo);
    
    // Step 2: Drop and recreate users table
    console.log('🗑️  Dropping existing users table...');
    await sql`DROP TABLE IF EXISTS "users" CASCADE;`;
    
    console.log('🏗️  Creating users table with correct schema...');
    await sql`
      CREATE TABLE "users" (
        "id" text PRIMARY KEY NOT NULL,
        "email" text NOT NULL,
        "password_hash" text NOT NULL,
        "first_name" text NOT NULL,
        "last_name" text NOT NULL,
        "company" text,
        "role" text,
        "credits" integer DEFAULT 0 NOT NULL,
        "is_active" boolean DEFAULT true NOT NULL,
        "email_verified" boolean DEFAULT false NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL,
        CONSTRAINT "users_email_unique" UNIQUE("email")
      );
    `;
    
    // Step 3: Recreate foreign key constraints
    console.log('🔗 Recreating foreign key constraints...');
    
    const constraints = [
      {
        name: 'sessions',
        sql: `ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;`
      },
      {
        name: 'password_reset_tokens',
        sql: `ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;`
      },
      {
        name: 'api_keys',
        sql: `ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;`
      },
      {
        name: 'usage_logs',
        sql: `ALTER TABLE "usage_logs" ADD CONSTRAINT "usage_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;`
      }
    ];
    
    const constraintResults = [];
    for (const constraint of constraints) {
      try {
        await sql.unsafe(constraint.sql);
        constraintResults.push({ table: constraint.name, status: 'success' });
      } catch (error) {
        console.log(`${constraint.name} FK constraint failed:`, error.message);
        constraintResults.push({ table: constraint.name, status: 'failed', error: error.message });
      }
    }
    
    // Step 4: Verify new structure
    console.log('✅ Verifying new table structure...');
    const newTableInfo = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position;
    `;
    
    console.log('New users table columns:', newTableInfo);
    
    return NextResponse.json({
      success: true,
      message: 'Database schema fixed successfully!',
      details: {
        oldColumns: tableInfo,
        newColumns: newTableInfo,
        constraints: constraintResults
      }
    });
    
  } catch (error: any) {
    console.error('❌ Error fixing database:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}
