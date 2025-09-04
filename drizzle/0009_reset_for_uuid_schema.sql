-- Reset all tables to match new UUID schema
-- WARNING: This will delete ALL data in these tables!

-- Drop all tables in correct order (dependencies first)
DROP TABLE IF EXISTS "usage_logs" CASCADE;
DROP TABLE IF EXISTS "api_keys" CASCADE;  
DROP TABLE IF EXISTS "sessions" CASCADE;
DROP TABLE IF EXISTS "password_reset_tokens" CASCADE;
DROP TABLE IF EXISTS "email_verification_tokens" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;

-- Drop the user ID mapping table if exists
DROP TABLE IF EXISTS "user_id_mapping" CASCADE;

-- Clear migration history for clean restart
DELETE FROM "drizzle"."__drizzle_migrations" WHERE "hash" IS NOT NULL;