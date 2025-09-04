-- Manual Database Setup Script
-- Run this if migrations are not working properly

-- Check if tables exist and create if needed
CREATE TABLE IF NOT EXISTS "users" (
  "id" text PRIMARY KEY NOT NULL,
  "email" text UNIQUE NOT NULL,
  "password_hash" text NOT NULL,
  "first_name" text NOT NULL,
  "last_name" text NOT NULL,
  "company" text,
  "role" text,
  "name" text,
  "credits" integer DEFAULT 1000 NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "api_keys" (
  "id" text PRIMARY KEY NOT NULL,
  "user_id" text NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "key_hash" text UNIQUE NOT NULL,
  "name" text NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL,
  "last_used" timestamp,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "usage_logs" (
  "id" text PRIMARY KEY NOT NULL,
  "user_id" text NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "api_key_id" text NOT NULL REFERENCES "api_keys"("id"),
  "endpoint" text NOT NULL,
  "credits_used" integer NOT NULL,
  "request_data" jsonb,
  "response_data" jsonb,
  "processing_time" integer,
  "status" text NOT NULL,
  "error_message" text,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "sessions" (
  "id" text PRIMARY KEY NOT NULL,
  "user_id" text NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "token" text UNIQUE NOT NULL,
  "expires_at" timestamp NOT NULL,
  "user_agent" text,
  "ip_address" text,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "password_reset_tokens" (
  "id" text PRIMARY KEY NOT NULL,
  "user_id" text NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "token" text UNIQUE NOT NULL,
  "expires_at" timestamp NOT NULL,
  "is_used" boolean DEFAULT false NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);


-- Create indexes for performance
CREATE INDEX IF NOT EXISTS "idx_api_keys_user_id" ON "api_keys" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_api_keys_key_hash" ON "api_keys" ("key_hash");
CREATE INDEX IF NOT EXISTS "idx_usage_logs_user_id" ON "usage_logs" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_usage_logs_api_key_id" ON "usage_logs" ("api_key_id");
CREATE INDEX IF NOT EXISTS "idx_usage_logs_created_at" ON "usage_logs" ("created_at");
CREATE INDEX IF NOT EXISTS "idx_sessions_user_id" ON "sessions" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_sessions_token" ON "sessions" ("token");

-- Insert sample data for testing (optional)
-- INSERT INTO "users" ("id", "email", "password_hash", "first_name", "last_name", "credits") 
-- VALUES ('demo_user_id', 'demo@example.com', 'demo_hash', 'Demo', 'User', 1000)
-- ON CONFLICT ("email") DO NOTHING;
