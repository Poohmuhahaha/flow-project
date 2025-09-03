// scripts/sync-db.mjs - Force sync database with current schema
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const sql = neon(process.env.DATABASE_URL);

async function syncDatabase() {
  try {
    console.log('🔄 Syncing database schema...');
    
    // Drop everything and start fresh
    await sql`DROP TABLE IF EXISTS "password_reset_tokens" CASCADE;`;
    await sql`DROP TABLE IF EXISTS "sessions" CASCADE;`;
    await sql`DROP TABLE IF EXISTS "usage_logs" CASCADE;`;
    await sql`DROP TABLE IF EXISTS "api_keys" CASCADE;`;
    await sql`DROP TABLE IF EXISTS "users" CASCADE;`;
    
    console.log('🗑️  Dropped all tables');
    
    // Create users table
    console.log('👤 Creating users table...');
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
    
    // Create sessions table
    console.log('🔐 Creating sessions table...');
    await sql`
      CREATE TABLE "sessions" (
        "id" text PRIMARY KEY NOT NULL,
        "user_id" text NOT NULL,
        "token" text NOT NULL,
        "expires_at" timestamp NOT NULL,
        "user_agent" text,
        "ip_address" text,
        "created_at" timestamp DEFAULT now() NOT NULL,
        CONSTRAINT "sessions_token_unique" UNIQUE("token")
      );
    `;
    
    // Create api_keys table
    console.log('🔑 Creating api_keys table...');
    await sql`
      CREATE TABLE "api_keys" (
        "id" text PRIMARY KEY NOT NULL,
        "user_id" text NOT NULL,
        "key_hash" text NOT NULL,
        "name" text NOT NULL,
        "is_active" boolean DEFAULT true NOT NULL,
        "last_used" timestamp,
        "created_at" timestamp DEFAULT now() NOT NULL,
        CONSTRAINT "api_keys_key_hash_unique" UNIQUE("key_hash")
      );
    `;
    
    // Create usage_logs table
    console.log('📊 Creating usage_logs table...');
    await sql`
      CREATE TABLE "usage_logs" (
        "id" text PRIMARY KEY NOT NULL,
        "user_id" text NOT NULL,
        "api_key_id" text NOT NULL,
        "endpoint" text NOT NULL,
        "credits_used" integer NOT NULL,
        "request_data" jsonb,
        "response_data" jsonb,
        "processing_time" integer,
        "status" text NOT NULL,
        "error_message" text,
        "created_at" timestamp DEFAULT now() NOT NULL
      );
    `;
    
    // Add foreign keys
    console.log('🔗 Adding foreign key constraints...');
    await sql`
      ALTER TABLE "sessions" 
      ADD CONSTRAINT "sessions_user_id_users_id_fk" 
      FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") 
      ON DELETE cascade ON UPDATE no action;
    `;
    
    await sql`
      ALTER TABLE "api_keys" 
      ADD CONSTRAINT "api_keys_user_id_users_id_fk" 
      FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") 
      ON DELETE cascade ON UPDATE no action;
    `;
    
    await sql`
      ALTER TABLE "usage_logs" 
      ADD CONSTRAINT "usage_logs_user_id_users_id_fk" 
      FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") 
      ON DELETE cascade ON UPDATE no action;
    `;
    
    await sql`
      ALTER TABLE "usage_logs" 
      ADD CONSTRAINT "usage_logs_api_key_id_api_keys_id_fk" 
      FOREIGN KEY ("api_key_id") REFERENCES "public"."api_keys"("id") 
      ON DELETE no action ON UPDATE no action;
    `;
    
    // Verify schema
    console.log('✅ Verifying users table...');
    const columns = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position;
    `;
    
    console.log('Users table columns:', columns);
    
    console.log('🎉 Database sync completed!');
    console.log('✅ You can now test registration and login!');
    
  } catch (error) {
    console.error('❌ Error syncing database:', error);
  }
}

syncDatabase();
