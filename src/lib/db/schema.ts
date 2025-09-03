// lib/db/schema.ts - เพิ่มเติมใน schema เดิม
import { pgTable, text, timestamp, integer, boolean, uuid, jsonb } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

// ตาราง users - เพิ่มฟิลด์สำหรับ authentication
export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  email: text('email').unique().notNull(),
  passwordHash: text('password_hash').notNull(), // เพิ่ม
  firstName: text('first_name').notNull(), // เพิ่ม
  lastName: text('last_name').notNull(), // เพิ่ม
  company: text('company'), // เพิ่ม
  role: text('role'), // เพิ่ม
  credits: integer('credits').default(0).notNull(),
  isActive: boolean('is_active').default(true).notNull(), // เพิ่ม
  emailVerified: boolean('email_verified').default(false).notNull(), // เพิ่ม
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ตาราง sessions สำหรับจัดการ login sessions
export const sessions = pgTable('sessions', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  token: text('token').unique().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  userAgent: text('user_agent'),
  ipAddress: text('ip_address'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ตาราง password_reset_tokens
export const passwordResetTokens = pgTable('password_reset_tokens', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  token: text('token').unique().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  isUsed: boolean('is_used').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ตาราง email_verification_tokens
export const emailVerificationTokens = pgTable('email_verification_tokens', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  token: text('token').unique().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ตาราง API keys (เดิม)
export const apiKeys = pgTable('api_keys', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  keyHash: text('key_hash').unique().notNull(),
  name: text('name').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  lastUsed: timestamp('last_used'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ตาราง usage_logs (เดิม)
export const usageLogs = pgTable('usage_logs', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  apiKeyId: text('api_key_id').references(() => apiKeys.id).notNull(),
  endpoint: text('endpoint').notNull(),
  creditsUsed: integer('credits_used').notNull(),
  requestData: jsonb('request_data'),
  responseData: jsonb('response_data'),
  processingTime: integer('processing_time'),
  status: text('status').notNull(),
  errorMessage: text('error_message'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type ApiKey = typeof apiKeys.$inferSelect;
export type UsageLog = typeof usageLogs.$inferSelect;