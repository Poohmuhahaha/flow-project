import { uuid, integer, pgTable, varchar, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";

// ตาราง users
export const users = pgTable("users", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  credits: integer("credits").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ตาราง API keys
export const apiKeys = pgTable("api_keys", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  keyHash: varchar("key_hash", { length: 255 }).notNull().unique(), // เก็บ hash ของ API key
  name: varchar("name", { length: 255 }).notNull(),
  isActive: boolean("is_active").notNull().default(true),
  lastUsed: timestamp("last_used"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ตาราง usage logs
export const usageLogs = pgTable("usage_logs", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  apiKeyId: uuid("api_key_id").notNull().references(() => apiKeys.id),
  endpoint: varchar("endpoint", { length: 255 }).notNull(), // '/api/gis/analyze'
  creditsUsed: integer("credits_used").notNull(),
  requestData: jsonb("request_data"), // เก็บข้อมูล request
  responseData: jsonb("response_data"), // เก็บข้อมูล response
  processingTime: integer("processing_time"), // milliseconds
  status: varchar("status", { length: 50 }).notNull(), // 'success', 'error', 'insufficient_credits'
  errorMessage: varchar("error_message", { length: 1000 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type ApiKey = typeof apiKeys.$inferSelect;
export type UsageLog = typeof usageLogs.$inferSelect;