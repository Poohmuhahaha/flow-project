// lib/db/schema.ts - แก้ไข schema ให้ตรงกับ database จริง
import { pgTable, text, timestamp, integer, boolean, uuid, jsonb, varchar } from 'drizzle-orm/pg-core';
// ลบ createId import เพราะไม่ใช้แล้ว

// ตาราง users - เปลี่ยนจาก text เป็น uuid ให้ตรงกับ database
export const users = pgTable('users', {
  id: text('id').primaryKey(), // ใช้ text ตาม database จริง
  email: text('email').unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(), 
  company: text('company'),
  role: text('role'),
  credits: integer('credits').default(0).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ตาราง sessions สำหรับจัดการ login sessions
export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(), // ใช้ text ตาม database จริง
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  token: text('token').unique().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  userAgent: text('user_agent'),
  ipAddress: text('ip_address'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ตาราง password_reset_tokens
export const passwordResetTokens = pgTable('password_reset_tokens', {
  id: text('id').primaryKey(), // ใช้ text ตาม database จริง
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  token: text('token').unique().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  isUsed: boolean('is_used').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});


// ตาราง API keys - แก้ไขให้ตรงกับ database
export const apiKeys = pgTable('api_keys', {
  id: text('id').primaryKey(), // ใช้ text ตาม database จริง
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  keyHash: text('key_hash').unique().notNull(), // ใช้ text ตาม database จริง
  name: text('name').notNull(), // ใช้ text ตาม database จริง 
  isActive: boolean('is_active').default(true).notNull(),
  lastUsed: timestamp('last_used'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  // ลบ updatedAt ออกเพราะไม่มีใน database จริง
});

// ตาราง usage_logs - แก้ไขให้ตรงกับ database
export const usageLogs = pgTable('usage_logs', {
  id: text('id').primaryKey(), // ใช้ text ตาม database จริง
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  apiKeyId: text('api_key_id').references(() => apiKeys.id).notNull(),
  endpoint: text('endpoint').notNull(), // ใช้ text ตาม database จริง
  creditsUsed: integer('credits_used').notNull(),
  requestData: jsonb('request_data'),
  responseData: jsonb('response_data'),
  processingTime: integer('processing_time'),
  status: text('status').notNull(), // ใช้ text ตาม database จริง
  errorMessage: text('error_message'), // ใช้ text ตาม database จริง
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type ApiKey = typeof apiKeys.$inferSelect;
export type UsageLog = typeof usageLogs.$inferSelect;