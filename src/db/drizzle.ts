import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle(sql, {
  // เพิ่ม logger สำหรับ debug (เฉพาะ development)
  logger: process.env.NODE_ENV === 'development',
});

export default db;