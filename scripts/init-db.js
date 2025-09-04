// scripts/init-db.js
const { drizzle } = require('drizzle-orm/neon-http');
const { neon } = require('@neondatabase/serverless');
const { sql } = require('drizzle-orm');

async function initializeDatabase() {
  console.log('🚀 Initializing FLO(W) Database...');
  
  try {
    // Get database URL from environment
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    
    console.log('📡 Connecting to database...');
    const sqlClient = neon(databaseUrl);
    const db = drizzle(sqlClient);
    
    // Test connection first
    console.log('🧪 Testing connection...');
    await db.execute(sql`SELECT 1`);
    console.log('✅ Connection successful');
    
    console.log('🛠️ Creating tables...');
    
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
        "name" text,
        "credits" integer DEFAULT 1000 NOT NULL,
        "is_active" boolean DEFAULT true NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      );
    `);
    console.log('✅ Users table created');
    
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
      );
    `);
    console.log('✅ Sessions table created');
    
    // Create password_reset_tokens table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "password_reset_tokens" (
        "id" text PRIMARY KEY NOT NULL,
        "user_id" text NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
        "token" text UNIQUE NOT NULL,
        "expires_at" timestamp NOT NULL,
        "is_used" boolean DEFAULT false NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL
      );
    `);
    console.log('✅ Password reset tokens table created');
    
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
      );
    `);
    console.log('✅ API keys table created');
    
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
      );
    `);
    console.log('✅ Usage logs table created');
    
    console.log('📊 Creating indexes...');
    
    const indexes = [
      'CREATE INDEX IF NOT EXISTS "idx_api_keys_user_id" ON "api_keys" ("user_id");',
      'CREATE INDEX IF NOT EXISTS "idx_api_keys_key_hash" ON "api_keys" ("key_hash");',
      'CREATE INDEX IF NOT EXISTS "idx_usage_logs_user_id" ON "usage_logs" ("user_id");',
      'CREATE INDEX IF NOT EXISTS "idx_usage_logs_api_key_id" ON "usage_logs" ("api_key_id");',
      'CREATE INDEX IF NOT EXISTS "idx_usage_logs_created_at" ON "usage_logs" ("created_at");',
      'CREATE INDEX IF NOT EXISTS "idx_sessions_user_id" ON "sessions" ("user_id");',
      'CREATE INDEX IF NOT EXISTS "idx_sessions_token" ON "sessions" ("token");'
    ];
    
    for (const indexSql of indexes) {
      await db.execute(sql.raw(indexSql));
    }
    console.log('✅ Indexes created');
    
    // Verify tables were created
    console.log('🔍 Verifying table creation...');
    const tables = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'api_keys', 'usage_logs', 'sessions', 'password_reset_tokens')
      ORDER BY table_name
    `);
    
    const tableNames = tables.map(t => t.table_name);
    console.log('📋 Created tables:', tableNames);
    
    const expectedTables = ['users', 'sessions', 'password_reset_tokens', 'api_keys', 'usage_logs'];
    const missingTables = expectedTables.filter(table => !tableNames.includes(table));
    
    if (missingTables.length > 0) {
      console.error('❌ Some tables were not created:', missingTables);
      process.exit(1);
    }
    
    console.log('🎉 Database initialization completed successfully!');
    console.log('💡 You can now start the application with: bun dev');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

// Run the initialization
initializeDatabase();
