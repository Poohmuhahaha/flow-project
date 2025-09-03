// scripts/fix-sessions.mjs - แก้ไขปัญหา sessions table
import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const sql = neon(process.env.DATABASE_URL);

async function fixSessions() {
  try {
    console.log('🔧 Fixing sessions table...');
    
    // ตรวจสอบว่า sessions table มีอยู่หรือไม่
    const tablesCheck = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'sessions');
    `;
    
    console.log('Existing tables:', tablesCheck.map(t => t.table_name));
    
    // ลบ sessions table ถ้ามีอยู่
    await sql`DROP TABLE IF EXISTS "sessions" CASCADE;`;
    console.log('🗑️ Dropped sessions table');
    
    // สร้าง sessions table ใหม่
    console.log('🏗️ Creating sessions table...');
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
    
    // เพิ่ม foreign key constraint
    console.log('🔗 Adding foreign key constraint...');
    await sql`
      ALTER TABLE "sessions" 
      ADD CONSTRAINT "sessions_user_id_users_id_fk" 
      FOREIGN KEY ("user_id") 
      REFERENCES "public"."users"("id") 
      ON DELETE cascade ON UPDATE no action;
    `;
    
    // ตรวจสอบ sessions table structure
    const sessionsColumns = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'sessions' 
      ORDER BY ordinal_position;
    `;
    
    console.log('Sessions table columns:', sessionsColumns);
    
    // ทดสอบ insert session
    console.log('🧪 Testing session insert...');
    const testSession = {
      id: 'test_session_12345',
      user_id: 'test_user_12345', // fake user id for test
      token: 'test_token_12345',
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
      user_agent: 'Test Browser',
      ip_address: '127.0.0.1'
    };
    
    try {
      // ลบ test session ถ้ามีอยู่
      await sql`DELETE FROM "sessions" WHERE "id" = ${testSession.id};`;
      
      // ลอง insert (จะ fail เพราะ user_id ไม่มีจริง)
      await sql`
        INSERT INTO "sessions" 
        ("id", "user_id", "token", "expires_at", "user_agent", "ip_address", "created_at")
        VALUES (${testSession.id}, ${testSession.user_id}, ${testSession.token}, ${testSession.expires_at}, ${testSession.user_agent}, ${testSession.ip_address}, now());
      `;
      
      console.log('❌ Test insert should have failed (foreign key constraint)');
      
    } catch (fkError) {
      if (fkError.message.includes('foreign key')) {
        console.log('✅ Foreign key constraint working correctly');
      } else {
        console.log('⚠️ Unexpected error:', fkError.message);
      }
    }
    
    // ทดสอบกับ user จริง
    console.log('🔍 Testing with real user...');
    const realUsers = await sql`SELECT id FROM users LIMIT 1;`;
    
    if (realUsers.length > 0) {
      const realUserId = realUsers[0].id;
      console.log('Found real user:', realUserId);
      
      try {
        await sql`
          INSERT INTO "sessions" 
          ("id", "user_id", "token", "expires_at", "user_agent", "ip_address", "created_at")
          VALUES ('test_real_session', ${realUserId}, 'test_real_token', ${testSession.expires_at}, 'Test Browser', '127.0.0.1', now());
        `;
        
        console.log('✅ Session insert with real user successful');
        
        // ลบ test session
        await sql`DELETE FROM "sessions" WHERE "id" = 'test_real_session';`;
        console.log('🧹 Cleaned up test session');
        
      } catch (realError) {
        console.log('❌ Session insert failed:', realError.message);
      }
    } else {
      console.log('ℹ️ No users found - that\'s okay, register first');
    }
    
    console.log('🎉 Sessions table fixed successfully!');
    console.log('✅ You can now test login!');
    
  } catch (error) {
    console.error('❌ Error fixing sessions table:', error.message);
  }
}

fixSessions();
