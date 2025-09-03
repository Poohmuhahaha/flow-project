-- Migration: Add missing columns to tables
-- Created: 2024-01-01

-- Add missing columns to users table
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "name" text;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "credits" integer DEFAULT 1000 NOT NULL;

-- Ensure api_keys has proper columns
ALTER TABLE "api_keys" ADD COLUMN IF NOT EXISTS "updated_at" timestamp DEFAULT now() NOT NULL;

-- Ensure usage_logs has proper columns  
ALTER TABLE "usage_logs" ADD COLUMN IF NOT EXISTS "request_data" jsonb;
ALTER TABLE "usage_logs" ADD COLUMN IF NOT EXISTS "response_data" jsonb;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS "idx_api_keys_user_id" ON "api_keys" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_usage_logs_user_id" ON "usage_logs" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_usage_logs_created_at" ON "usage_logs" ("created_at");
CREATE INDEX IF NOT EXISTS "idx_sessions_user_id" ON "sessions" ("user_id");
