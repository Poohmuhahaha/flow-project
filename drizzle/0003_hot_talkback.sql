CREATE TABLE "password_reset_tokens" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"is_used" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "password_reset_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
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
--> statement-breakpoint
ALTER TABLE "api_keys" DROP CONSTRAINT "api_keys_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "usage_logs" DROP CONSTRAINT "usage_logs_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "api_keys" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "api_keys" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "api_keys" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "api_keys" ALTER COLUMN "key_hash" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "api_keys" ALTER COLUMN "name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "usage_logs" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "usage_logs" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "usage_logs" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "usage_logs" ALTER COLUMN "api_key_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "usage_logs" ALTER COLUMN "endpoint" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "usage_logs" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "usage_logs" ALTER COLUMN "error_message" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usage_logs" ADD CONSTRAINT "usage_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;