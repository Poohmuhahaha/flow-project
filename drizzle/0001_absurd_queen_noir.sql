CREATE TABLE "users_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar NOT NULL,
	"email" varchar NOT NULL,
	"password" varchar NOT NULL,
	CONSTRAINT "users_table_id_unique" UNIQUE("id"),
	CONSTRAINT "users_table_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DROP TABLE "users" CASCADE;