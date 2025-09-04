// scripts/test-db.js
const { drizzle } = require('drizzle-orm/neon-http');
const { neon } = require('@neondatabase/serverless');
const { sql } = require('drizzle-orm');

async function testDatabase() {
  console.log('🔍 Testing database connection...');
  
  try {
    // Get database URL from environment
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    
    console.log('📡 Connecting to database...');
    const sqlClient = neon(databaseUrl);
    const db = drizzle(sqlClient);
    
    // Test basic connection
    console.log('🧪 Testing basic connection...');
    const result = await db.execute(sql`SELECT 1 as test, NOW() as timestamp`);
    console.log('✅ Connection successful:', result[0]);
    
    // Check existing tables
    console.log('📋 Checking existing tables...');
    const tables = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('📊 Found tables:', tables.map(t => t.table_name));
    
    // Check if our required tables exist
    const requiredTables = ['users', 'api_keys', 'usage_logs', 'sessions', 'password_reset_tokens'];
    const existingTables = tables.map(t => t.table_name);
    const missingTables = requiredTables.filter(table => !existingTables.includes(table));
    
    if (missingTables.length > 0) {
      console.log('⚠️  Missing tables:', missingTables);
      console.log('💡 Run the database initialization to create missing tables');
    } else {
      console.log('✅ All required tables exist');
    }
    
    // Test table structure for existing tables
    for (const table of existingTables.filter(t => requiredTables.includes(t))) {
      console.log(`🔍 Checking structure of ${table}...`);
      const columns = await db.execute(sql`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = ${table}
        ORDER BY ordinal_position
      `);
      console.log(`📋 ${table} columns:`, columns.map(c => `${c.column_name} (${c.data_type})`));
    }
    
    console.log('🎉 Database test completed successfully!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

// Run the test
testDatabase();
