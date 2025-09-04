# Fix Neon Database Tables

## Steps to fix the missing table error:

### Option 1: Using Neon Dashboard (Recommended)
1. Go to https://console.neon.tech/
2. Open your project: `playing_with_neon`
3. Go to SQL Editor
4. Copy and paste the content of `create-missing-tables.sql`
5. Execute the SQL

### Option 2: Using a PostgreSQL client
If you have a PostgreSQL client installed:
```bash
psql "postgresql://neondb_owner:npg_yFZ4YoDBeu6A@ep-wild-bird-a1ytw3z2-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require" -f create-missing-tables.sql
```

### Option 3: Using Node.js script
Create a temporary script to execute the SQL:

```javascript
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

await client.connect();
const db = drizzle(client);

// Execute SQL directly
await client.query(`
  ALTER TABLE "api_keys" ADD COLUMN IF NOT EXISTS "updated_at" timestamp DEFAULT now() NOT NULL;
  
  CREATE TABLE IF NOT EXISTS "email_verification_tokens" (
    "id" text PRIMARY KEY NOT NULL,
    "user_id" text NOT NULL,
    "token" text NOT NULL,
    "expires_at" timestamp NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    CONSTRAINT "email_verification_tokens_token_unique" UNIQUE("token")
  );
`);

await client.end();
```

## After fixing the database:
1. Restart your Next.js dev server: `bun run dev`
2. The dashboard should now work without errors