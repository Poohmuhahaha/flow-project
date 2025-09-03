# 🔧 Database Issues - Quick Fix

เนื่องจากเกิดปัญหา Database schema ไม่ตรงกัน มีวิธีแก้ไขดังนี้:

## 🚨 Problem
```
Failed query: insert into "api_keys" ... 
```

## ✅ Solution Options

### Option 1: Manual Database Setup (Recommended)

1. **Run the manual SQL script:**
   ```sql
   -- Copy และรัน code ใน manual_db_setup.sql ใน database ของคุณ
   ```

2. **หรือใช้ Drizzle Studio:**
   ```bash
   npm run db:studio
   ```
   แล้วรันคำสั่ง SQL ใน manual_db_setup.sql

### Option 2: Use Simple Setup Endpoint

```bash
# ใช้ endpoint ใหม่ที่ใช้ SQL โดยตรง
curl -X POST http://localhost:3000/api/demo/setup-simple \
  -H "Content-Type: application/json" \
  -d '{"email": "demo@example.com", "credits": 1000}'
```

### Option 3: Reset Database (Nuclear Option)

1. **Delete existing migrations:**
   ```bash
   rm -rf drizzle/*.sql
   ```

2. **Generate new migration:**
   ```bash
   npm run db:generate
   ```

3. **Run migration:**
   ```bash
   npm run db:migrate
   ```

## 🧪 Testing After Fix

### 1. Test Health Check
```bash
curl http://localhost:3000/api/health
```

### 2. Test Database Connection
```bash
# ถ้า database ทำงาน จะไม่ได้ error
curl http://localhost:3000/api/demo/setup-simple
```

### 3. Create Demo User & API Key
```bash
curl -X POST http://localhost:3000/api/demo/setup-simple \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "credits": 1000}'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Demo setup completed successfully!",
  "user": {
    "id": "...",
    "email": "test@example.com", 
    "credits": 1000
  },
  "apiKey": "gis_xxxxxxxxxxxxx..."
}
```

### 4. Test API with the Key
```bash
# ใช้ API key ที่ได้จากขั้นตอนที่ 3
curl -X GET http://localhost:3000/api/demo \
  -H "Authorization: Bearer gis_YOUR_API_KEY_HERE"
```

## 📋 Manual Database Schema

หาก database ว่างเปล่า รัน SQL นี้:

```sql
-- Run this in your database
CREATE TABLE IF NOT EXISTS "users" (
  "id" text PRIMARY KEY NOT NULL,
  "email" text UNIQUE NOT NULL,
  "password_hash" text NOT NULL,
  "first_name" text NOT NULL,
  "last_name" text NOT NULL,
  "credits" integer DEFAULT 1000 NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL,
  "email_verified" boolean DEFAULT false NOT NULL,
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
  "created_at" timestamp DEFAULT now() NOT NULL
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
```

## 🎯 Quick Commands

```bash
# Test new simple setup
curl -X POST http://localhost:3000/api/demo/setup-simple \
  -H "Content-Type: application/json" \
  -d '{"email": "demo@example.com"}'

# Test with result API key
curl -X GET http://localhost:3000/api/demo \
  -H "Authorization: Bearer gis_YOUR_KEY"

# Check usage
curl -X GET http://localhost:3000/api/usage \
  -H "Authorization: Bearer gis_YOUR_KEY"
```

---

💡 **Tip:** ใช้ `/api/demo/setup-simple` แทน `/api/demo/setup` หาก migration มีปัญหา
