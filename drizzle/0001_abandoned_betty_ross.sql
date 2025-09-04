ALTER TABLE "email_verification_tokens" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "email_verification_tokens" CASCADE;--> statement-breakpoint
ALTER TABLE "api_keys" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "api_keys" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "api_keys" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "api_keys" ALTER COLUMN "key_hash" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "api_keys" ALTER COLUMN "name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "password_reset_tokens" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "password_reset_tokens" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "password_reset_tokens" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "usage_logs" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "usage_logs" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "usage_logs" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "usage_logs" ALTER COLUMN "api_key_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "usage_logs" ALTER COLUMN "endpoint" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "usage_logs" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "usage_logs" ALTER COLUMN "error_message" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "email_verified";