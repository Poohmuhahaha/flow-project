// debug/check-database.ts - Test database connection and schema
import { db } from '@/lib/db/index';
import { users } from '@/lib/db/schema';
import { sql } from 'drizzle-orm';

export async function checkDatabase() {
  console.log('Testing database connection...');
  
  try {
    // Test basic connection
    const result = await db.execute(sql`SELECT NOW()`);
    console.log('✅ Database connected:', result);
    
    // Check if users table exists
    const tableExists = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);
    console.log('✅ Users table exists:', tableExists);
    
    // Check users table structure
    const tableStructure = await db.execute(sql`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'users'
      ORDER BY ordinal_position;
    `);
    console.log('📋 Users table structure:', tableStructure);
    
    // Test user creation with manual UUID
    const testUserId = crypto.randomUUID();
    console.log('🧪 Testing user creation with UUID:', testUserId);
    
  } catch (error) {
    console.error('❌ Database error:', error);
    throw error;
  }
}