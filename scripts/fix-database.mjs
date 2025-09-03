// scripts/fix-database.mjs - รัน SQL migration ตรง database
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
const sql = neon(connectionString);
const db = drizzle(sql);

async function fixDatabase() {
  try {
    console.log('🔧 Fixing database schema...');
    
    // Check current users table structure
    console.log('📊 Checking current table structure...');
    const tableInfo = await sql`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position;
    `;
    
    console.log('Current users table columns:', tableInfo);
    
    // Drop and recreate users table with correct schema
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
    
    console.log('🔗 Recreating foreign key constraints...');
    
    // Recreate foreign key constraints (ignore errors if constraints already exist)
    try {
      await sql`
        ALTER TABLE "sessions" 
        ADD CONSTRAINT "sessions_user_id_users_id_fk" 
        FOREIGN KEY ("user_id") 
        REFERENCES "public"."users"("id") 
        ON DELETE cascade ON UPDATE no action;
      `;
    } catch (e) { console.log('Sessions FK already exists or table not found'); }
    
    try {
      await sql`
        ALTER TABLE "password_reset_tokens" 
        ADD CONSTRAINT "password_reset_tokens_user_id_users_id_fk" 
        FOREIGN KEY ("user_id") 
        REFERENCES "public"."users"("id") 
        ON DELETE cascade ON UPDATE no action;
      `;
    } catch (e) { console.log('Password reset tokens FK already exists or table not found'); }
    
    try {
      await sql`
        ALTER TABLE "api_keys" 
        ADD CONSTRAINT "api_keys_user_id_users_id_fk" 
        FOREIGN KEY ("user_id") 
        REFERENCES "public"."users"("id") 
        ON DELETE cascade ON UPDATE no action;
      `;
    } catch (e) { console.log('API keys FK already exists or table not found'); }
    
    try {
      await sql`
        ALTER TABLE "usage_logs" 
        ADD CONSTRAINT "usage_logs_user_id_users_id_fk" 
        FOREIGN KEY ("user_id") 
        REFERENCES "public"."users"("id") 
        ON DELETE cascade ON UPDATE no action;
      `;
    } catch (e) { console.log('Usage logs FK already exists or table not found'); }
    
    // Verify the new structure
    console.log('✅ Verifying new table structure...');
    const newTableInfo = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position;
    `;
    
    console.log('New users table columns:', newTableInfo);
    
    console.log('🎉 Database schema fixed successfully!');
    console.log('📝 You can now test user registration.');
    
  } catch (error) {
    console.error('❌ Error fixing database:', error);
    process.exit(1);
  }
}

fixDatabase();
