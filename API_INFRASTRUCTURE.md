# API Infrastructure

ระบบ API Infrastructure สำหรับจัดการ Authentication, API Keys, Usage Tracking และ Credit System

## 🚀 Features

- **API Key Management**: สร้าง, ดู, และจัดการ API keys
- **Usage Tracking**: ติดตามการใช้งาน API แบบ real-time
- **Credit System**: ระบบหักเครดิตอัตโนมัติ
- **Rate Limiting**: จำกัดอัตราการเรียกใช้ API
- **Analytics**: สถิติการใช้งานแบบละเอียด

## 📋 API Endpoints

### Authentication & API Keys

#### `POST /api/auth/api-keys`
สร้าง API key ใหม่

**Headers:**
```
Cookie: session_token=your_session_token
Content-Type: application/json
```

**Body:**
```json
{
  "name": "My API Key"
}
```

**Response:**
```json
{
  "success": true,
  "apiKey": "gis_abc123...",
  "message": "API key created successfully. Store it securely - it will not be shown again."
}
```

#### `GET /api/auth/api-keys`
ดูรายการ API keys ทั้งหมด

**Headers:**
```
Cookie: session_token=your_session_token
```

**Response:**
```json
{
  "success": true,
  "apiKeys": [
    {
      "id": "key_id_1",
      "name": "My API Key",
      "isActive": true,
      "lastUsed": "2024-01-01T00:00:00Z",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### `DELETE /api/auth/api-keys?id=key_id`
ลบ API key

### Usage Tracking

#### `GET /api/usage`
ดูสถิติการใช้งาน

**Headers:**
```
Authorization: Bearer gis_your_api_key
```

**Query Parameters:**
- `limit`: จำนวน records ที่ต้องการ (default: 100)
- `days`: ช่วงวันที่ต้องการดู analytics (default: 30)
- `stats`: รวม analytics หรือไม่ (true/false)

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "currentCredits": 1000
  },
  "summary": {
    "totalRequests": 150,
    "totalCreditsUsed": 300,
    "successfulRequests": 145,
    "successRate": 96.67
  },
  "usage": [
    {
      "id": "log_id",
      "endpoint": "/api/demo",
      "creditsUsed": 2,
      "status": "success",
      "processingTime": 234,
      "createdAt": "2024-01-01T00:00:00Z",
      "errorMessage": null
    }
  ],
  "analytics": {
    "dailyStats": [
      {
        "date": "2024-01-01",
        "requests": 50,
        "creditsUsed": 100,
        "successRate": 98
      }
    ],
    "period": "30 days"
  }
}
```

### Credit Management

#### `GET /api/credits`
ดูยอดเครดิตปัจจุบัน

**Headers:**
```
Authorization: Bearer gis_your_api_key
```

**Response:**
```json
{
  "success": true,
  "credits": 1000,
  "userId": "user_id"
}
```

#### `POST /api/credits`
เพิ่มเครดิต (สำหรับ admin)

**Headers:**
```
Cookie: session_token=your_session_token
Content-Type: application/json
```

**Body:**
```json
{
  "amount": 100,
  "reason": "Payment received"
}
```

#### `PUT /api/credits`
หักเครดิต (สำหรับ internal use)

**Headers:**
```
Authorization: Bearer gis_your_api_key
Content-Type: application/json
```

**Body:**
```json
{
  "amount": 5
}
```

### Demo API

#### `GET /api/demo`
API ทดสอบระบบ (ใช้ 2 credits)

**Headers:**
```
Authorization: Bearer gis_your_api_key
```

**Response:**
```json
{
  "message": "This is a demo API endpoint",
  "timestamp": "2024-01-01T00:00:00Z",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "credits": 998
  },
  "apiKey": {
    "id": "key_id",
    "name": "My API Key"
  }
}
```

#### `POST /api/demo`
API ทดสอบ POST (ใช้ 3 credits)

**Headers:**
```
Authorization: Bearer gis_your_api_key
Content-Type: application/json
```

**Body:**
```json
{
  "test": "data"
}
```

## 🔧 Configuration

### Credit Costs
- Demo GET: 2 credits
- Demo POST: 3 credits
- GIS Route Optimization: 5 credits
- GIS Batch Processing: 10 credits

### Rate Limits
- Demo endpoints: 20 requests/minute
- GIS Processing: 50 requests/hour
- Default: 100 requests/hour

### API Key Limits
- Maximum 5 keys per user
- Keys are prefixed with `gis_`
- 64 character length (including prefix)

## 🛠️ Implementation Details

### Middleware System
ระบบใช้ middleware (`withApiHandler`) ที่จัดการ:

1. **Authentication**: ตรวจสอบ API key
2. **Rate Limiting**: จำกัดอัตราการเรียกใช้
3. **Credit Deduction**: หักเครดิตอัตโนมัติ
4. **Usage Logging**: บันทึกการใช้งานทุกครั้ง
5. **Error Handling**: จัดการ errors อย่างสม่ำเสมอ

### Database Schema
- `users`: ข้อมูลผู้ใช้และจำนวนเครดิต
- `api_keys`: API keys ที่สร้างโดยผู้ใช้
- `usage_logs`: บันทึกการใช้งาน API ทุกครั้ง
- `sessions`: จัดการ login sessions

### Security Features
- API keys ถูก hash ก่อนเก็บในฐานข้อมูล
- Request/Response data ถูก sanitize ก่อนบันทึก
- Rate limiting ป้องกันการใช้งานเกินขีดจำกัด
- Credit system ป้องกันการใช้งานเกินที่จ่าย

## 📊 Monitoring

### Usage Analytics
ระบบสามารถดู analytics ต่างๆ ได้:
- การใช้งานรายวัน
- Success rate
- Credits ที่ใช้ไป
- Endpoints ที่ได้รับความนิยม
- Processing time เฉลี่ย

### Error Tracking
- บันทึก errors ทุกประเภท
- Rate limit violations
- Insufficient credits
- Authentication failures

## 🔄 Usage Examples

### Creating and Using API Key

```bash
# 1. Create API key (need to be logged in)
curl -X POST http://localhost:3000/api/auth/api-keys \
  -H "Content-Type: application/json" \
  -H "Cookie: session_token=your_session" \
  -d '{"name": "My Test Key"}'

# Response: {"success": true, "apiKey": "gis_abc123..."}

# 2. Use the API key
curl -X GET http://localhost:3000/api/demo \
  -H "Authorization: Bearer gis_abc123..."

# 3. Check usage
curl -X GET "http://localhost:3000/api/usage?stats=true&days=7" \
  -H "Authorization: Bearer gis_abc123..."
```

### Managing Credits

```bash
# Check current credits
curl -X GET http://localhost:3000/api/credits \
  -H "Authorization: Bearer gis_abc123..."

# Add credits (admin only)
curl -X POST http://localhost:3000/api/credits \
  -H "Content-Type: application/json" \
  -H "Cookie: session_token=admin_session" \
  -d '{"amount": 1000, "reason": "Monthly top-up"}'
```

## 🚨 Error Codes

| Code | Description | Solution |
|------|-------------|----------|
| 401 | Unauthorized | ตรวจสอบ API key หรือ login session |
| 402 | Insufficient Credits | เติมเครดิตเพิ่มเติม |
| 429 | Rate Limited | รอและลองใหม่ตาม `retryAfter` |
| 500 | Server Error | ติดต่อ support |

## ⚙️ Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# API Configuration
API_RATE_LIMIT_ENABLED=true
API_DEFAULT_CREDITS=1000
API_MAX_KEYS_PER_USER=5

# Session
SESSION_SECRET="your-secret-key"
SESSION_EXPIRY_DAYS=30
```

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### API Testing
```bash
# Test API key creation
npm run test:api:auth

# Test usage tracking
npm run test:api:usage

# Test credit system
npm run test:api:credits
```

### Load Testing
```bash
# Test rate limiting
npm run test:load:rate-limit

# Test concurrent requests
npm run test:load:concurrent
```

## 🔍 Troubleshooting

### Common Issues

**API Key Not Working**
- ตรวจสอบว่า key ขึ้นต้นด้วย `gis_`
- ตรวจสอบว่า key ยังใช้งานได้ (`isActive: true`)
- ตรวจสอบว่าส่ง Authorization header ถูกต้อง

**Rate Limit Hit**
- ตรวจสอบ response header `X-RateLimit-*`
- รอตาม `retryAfter` ที่ระบุใน response
- พิจารณาอัพเกรด plan หากต้องการ limit สูงขึ้น

**Insufficient Credits**
- ตรวจสอบยอด credits ด้วย `GET /api/credits`
- เติม credits ผ่านระบบ payment
- ติดต่อ admin หากมีปัญหา

**Database Connection Issues**
- ตรวจสอบ `DATABASE_URL`
- ตรวจสอบว่า database server ทำงานอยู่
- รัน migrations: `npm run db:migrate`

### Logs and Debugging

```bash
# ดู API logs
tail -f logs/api.log

# ดู usage logs
tail -f logs/usage.log

# Debug mode
DEBUG=api:* npm run dev
```

## 🚀 Deployment

### Database Migration
```bash
# รัน migrations
npm run db:migrate

# ตรวจสอบ schema
npm run db:status
```

### Production Setup
```bash
# Build
npm run build

# Start production server
npm start

# หรือใช้ PM2
pm2 start ecosystem.config.js
```

### Health Checks
```bash
# API health
curl http://localhost:3000/api/health

# Database health  
curl http://localhost:3000/api/health/db
```

---

## 📞 Support

หากมีปัญหาหรือคำถาม:
- 📧 Email: dev@company.com
- 💬 Slack: #api-support
- 📖 Documentation: /api-docs

**สร้างโดย:** API Infrastructure Team  
**อัพเดทล่าสุด:** 2024-01-01
