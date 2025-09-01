import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required');
}

const sql = neon(process.env.DATABASE_URL);

export const db = drizzle(sql, {
  // เพิ่ม logger สำหรับ debug (เฉพาะ development)
  logger: process.env.NODE_ENV === 'development',
});

export default db;