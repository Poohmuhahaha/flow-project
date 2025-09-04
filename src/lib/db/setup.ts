// Database Health Check & Setup Script
import { db } from './index';
import { sql } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';

export async function checkDatabaseHealth() {
  try {
    console.log('🔍 Checking database connection...');
    
    // Test basic connection
    const result = await db.execute(sql`SELECT 1 as test`);
    console.log('✅ Database connection successful');
    
    // Check if tables exist
    const tables = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    const tableNames = tables.rows.map(row => row.table_name);
    console.log('📋 Existing tables:', tableNames);
    
    const requiredTables = ['users', 'api_keys', 'usage_logs', 'sessions', 'password_reset_tokens'];
    const missingTables = requiredTables.filter(table => !tableNames.includes(table));
    
    if (missingTables.length > 0) {
      console.log('❌ Missing tables:', missingTables);
      return false;
    }
    
    console.log('✅ All required tables exist');
    return true;
    
  } catch (error) {
    console.error('❌ Database health check failed:', error);
    return false;
  }
}

export async function setupDatabase() {
  try {
    console.log('🛠️ Setting up database...');
    
    // Create users table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" text PRIMARY KEY NOT NULL,
        "email" text UNIQUE NOT NULL,
        "password_hash" text NOT NULL,
        "first_name" text NOT NULL,
        "last_name" text NOT NULL,
        "company" text,
        "role" text,
        "credits" integer DEFAULT 1000 NOT NULL,
        "is_active" boolean DEFAULT true NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      )
    `);
    
    // Create sessions table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "sessions" (
        "id" text PRIMARY KEY NOT NULL,
        "user_id" text NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "token" text UNIQUE NOT NULL,
        "expires_at" timestamp NOT NULL,
        "user_agent" text,
        "ip_address" text,
        "created_at" timestamp DEFAULT now() NOT NULL
      )
    `);
    
    // Create password_reset_tokens table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "password_reset_tokens" (
        "id" text PRIMARY KEY NOT NULL,
        "user_id" text NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "token" text UNIQUE NOT NULL,
        "expires_at" timestamp NOT NULL,
        "is_used" boolean DEFAULT false NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL
      )
    `);
    
    // Create api_keys table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "api_keys" (
        "id" text PRIMARY KEY NOT NULL,
        "user_id" text NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "key_hash" text UNIQUE NOT NULL,
        "name" text NOT NULL,
        "is_active" boolean DEFAULT true NOT NULL,
        "last_used" timestamp,
        "created_at" timestamp DEFAULT now() NOT NULL
      )
    `);
    
    // Create usage_logs table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "usage_logs" (
        "id" text PRIMARY KEY NOT NULL,
        "user_id" text NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "api_key_id" text NOT NULL REFERENCES "api_keys"("id"),
        "endpoint" text NOT NULL,
        "credits_used" integer NOT NULL,
        "request_data" jsonb,
        "response_data" jsonb,
        "processing_time" integer,
        "status" text NOT NULL,
        "error_message" text,
        "created_at" timestamp DEFAULT now() NOT NULL
      )
    `);
    
    // Create indexes
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "idx_api_keys_user_id" ON "api_keys" ("user_id")`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "idx_api_keys_key_hash" ON "api_keys" ("key_hash")`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "idx_usage_logs_user_id" ON "usage_logs" ("user_id")`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "idx_usage_logs_api_key_id" ON "usage_logs" ("api_key_id")`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "idx_usage_logs_created_at" ON "usage_logs" ("created_at")`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "idx_sessions_user_id" ON "sessions" ("user_id")`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "idx_sessions_token" ON "sessions" ("token")`);
    
    console.log('✅ Database setup completed');
    return true;
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    return false;
  }
}

export async function createDemoUser() {
  try {
    console.log('👤 Creating demo user...');
    
    const demoUser = {
      id: createId(),
      email: 'demo@example.com',
      password_hash: '$2a$12$demo.hash.for.testing',
      first_name: 'Demo',
      last_name: 'User', 
      company: 'Demo Company',
      credits: 5000
    };
    
    await db.execute(sql`
      INSERT INTO "users" ("id", "email", "password_hash", "first_name", "last_name", "company", "credits")
      VALUES (${demoUser.id}, ${demoUser.email}, ${demoUser.password_hash}, ${demoUser.first_name}, ${demoUser.last_name}, ${demoUser.company}, ${demoUser.credits})
      ON CONFLICT ("email") DO NOTHING
    `);
    
    console.log('✅ Demo user created/updated');
    return demoUser.id;
    
  } catch (error) {
    console.error('❌ Demo user creation failed:', error);
    return null;
  }
}

export async function initializeDatabase() {
  console.log('🚀 Initializing database...');
  
  const isHealthy = await checkDatabaseHealth();
  
  if (!isHealthy) {
    console.log('🔧 Database needs setup...');
    await setupDatabase();
    await checkDatabaseHealth();
  }
  
  console.log('🎉 Database initialization completed');
}
