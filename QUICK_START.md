# 🚀 API Infrastructure - Quick Start Guide

ระบบ API Infrastructure ได้รับการพัฒนาเสร็จสิ้นแล้ว! 

## ✅ สิ่งที่สร้างเสร็จแล้ว

### 🔑 API Key Management
- ✅ `POST /api/auth/api-keys` - สร้าง API key ใหม่
- ✅ `GET /api/auth/api-keys` - ดูรายการ API keys
- ✅ `DELETE /api/auth/api-keys?id=key_id` - ลบ API key
- ✅ `PUT /api/auth/api-keys/toggle` - เปิด/ปิด API key

### 📊 Usage Tracking
- ✅ `GET /api/usage` - ดูสถิติการใช้งานพร้อม analytics
- ✅ บันทึกการใช้งานอัตโนมัติทุก API call
- ✅ Analytics รายวัน/รายเดือน
- ✅ Success rate tracking

### 💰 Credit System
- ✅ `GET /api/credits` - ดูยอดเครดิต
- ✅ `POST /api/credits` - เพิ่มเครดิต (admin)
- ✅ `PUT /api/credits` - หักเครดิต (internal)
- ✅ ระบบหักเครดิตอัตโนมัติ

### 🛡️ Security & Middleware
- ✅ API Key authentication
- ✅ Rate limiting
- ✅ Request/Response logging
- ✅ Error handling
- ✅ Data sanitization

### 🔧 Demo & Health
- ✅ `GET /api/demo` - API ทดสอบ (2 credits)
- ✅ `POST /api/demo` - API ทดสอบ POST (3 credits)
- ✅ `GET /api/health` - Health check endpoint

## 🎯 วิธีเริ่มใช้งาน

### 1. รันระบบ
```bash
npm run dev
```

### 2. ตรวจสอบ Health
```bash
npm run api:health
# หรือ
curl http://localhost:3000/api/health
```

### 3. สร้าง API Key
```bash
# ต้อง login เข้าระบบก่อน แล้วใช้ session cookie
curl -X POST http://localhost:3000/api/auth/api-keys \
  -H "Content-Type: application/json" \
  -H "Cookie: session_token=YOUR_SESSION_TOKEN" \
  -d '{"name": "My First API Key"}'
```

### 4. ทดสอบ API
```bash
# ใช้ API key ที่ได้รับ
curl -X GET http://localhost:3000/api/demo \
  -H "Authorization: Bearer gis_YOUR_API_KEY"
```

### 5. ดู Usage Statistics
```bash
curl -X GET "http://localhost:3000/api/usage?stats=true&days=7" \
  -H "Authorization: Bearer gis_YOUR_API_KEY"
```

## 📋 Database Tables ที่ต้องมี

ตารางเหล่านี้ได้ถูกสร้างไว้ใน schema แล้ว:
- ✅ `users` - ข้อมูลผู้ใช้และเครดิต
- ✅ `sessions` - จัดการ login sessions  
- ✅ `api_keys` - เก็บ API keys ที่สร้าง
- ✅ `usage_logs` - บันทึกการใช้งาน API
- ✅ `password_reset_tokens` - รีเซ็ตรหัสผ่าน

## ⚡ Credit Costs ที่กำหนดไว้

| Endpoint | Credits | Rate Limit |
|----------|---------|------------|
| `GET /api/demo` | 2 | 10/min |
| `POST /api/demo` | 3 | 5/min |
| `GET /api/usage` | 0 | 100/hr |
| `GET /api/credits` | 0 | 100/hr |
| GIS Processing* | 5-10 | 50/hr |

*GIS endpoints ยังไม่ได้ implement แต่ infrastructure พร้อมแล้ว

## 🚨 การใช้งาน Middleware

ระบบใช้ `withApiHandler` wrapper สำหรับ API endpoints:

```typescript
import { createApiRoute } from '@/lib/api-middleware';

const handler = async (request, context) => {
  const { user, apiKey } = context;
  // Your API logic here
  return NextResponse.json(data);
};

export const GET = createApiRoute(handler, {
  requiresAuth: true,
  creditCost: 2,
  rateLimit: { requests: 10, windowMs: 60 * 1000 }
});
```

## 📈 Monitoring & Analytics

### Real-time Monitoring
- API response times
- Success/error rates
- Credit consumption
- Rate limit hits

### Analytics
```bash
# ดู analytics รายสัปดาห์
curl "http://localhost:3000/api/usage?stats=true&days=7" \
  -H "Authorization: Bearer gis_YOUR_API_KEY"
```

## 🔍 Troubleshooting

### ปัญหาที่พบบ่อย

1. **401 Unauthorized**
   - ตรวจสอบ API key format (`gis_...`)
   - ตรวจสอบ Authorization header

2. **402 Insufficient Credits**
   - เติมเครดิตผ่าน `POST /api/credits`
   - ตรวจสอบยอดด้วย `GET /api/credits`

3. **429 Rate Limit**
   - รอตาม `retryAfter` ใน response
   - ลดความถี่ของ requests

4. **Database Connection**
   - ตรวจสอบ `DATABASE_URL`
   - รัน `npm run db:migrate`

## 📁 ไฟล์สำคัญที่สร้างขึ้น

```
src/
├── app/api/
│   ├── auth/api-keys/         # API key management
│   ├── usage/                 # Usage tracking
│   ├── credits/               # Credit management
│   ├── demo/                  # Demo endpoints
│   └── health/                # Health check
├── lib/
│   ├── api-middleware.ts      # Main middleware
│   ├── api-config.ts          # Configuration
│   ├── api-utils.ts           # Utility functions
│   └── db/
│       ├── queries.ts         # Database queries
│       ├── schema.ts          # Database schema
│       └── auth-db/
│           ├── auth.ts        # API key auth
│           └── auth-server.ts # Session auth
└── middleware.ts              # Next.js middleware
```

## 🎉 Next Steps

1. **รัน Migrations**
   ```bash
   npm run db:migrate
   ```

2. **ทดสอบระบบ**
   ```bash
   npm run api:health
   npm run dev
   ```

3. **สร้าง API Key แรก**
   - Login เข้าระบบ
   - เรียก POST /api/auth/api-keys

4. **เริ่มใช้งาน**
   - เรียก API ด้วย API key
   - ดู usage statistics
   - Monitor credit consumption

---

🎯 **ระบบพร้อมใช้งานแล้ว!** เริ่มต้นด้วยการรัน `npm run dev` และทดสอบ API ตัวแรกของคุณ
