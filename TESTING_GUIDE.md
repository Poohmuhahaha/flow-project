# 🚀 Step-by-Step API Testing Guide

เนื่องจากระบบต้องใช้ authentication ผมสร้าง demo setup endpoint ให้แล้ว ลองทดสอบตามขั้นตอนนี้:

## 📋 ขั้นตอนการทดสอบ

### 1. เริ่มต้นระบบ
```bash
npm run dev
```

### 2. ทดสอบ Health Check (ไม่ต้อง auth)
```bash
curl http://localhost:3000/api/health
```

### 3. สร้าง Demo User และ API Key
```bash
curl -X POST http://localhost:3000/api/demo/setup \
  -H "Content-Type: application/json" \
  -d '{"email": "demo@example.com", "credits": 1000}'
```

**Response ที่คาดหวัง:**
```json
{
  "success": true,
  "message": "Demo setup completed successfully!",
  "user": {
    "id": "user_xxx",
    "email": "demo@example.com",
    "credits": 1000
  },
  "apiKey": "gis_xxxxxxxxxxxxx...",
  "instructions": {
    "usage": "Use this API key in Authorization header: Bearer YOUR_API_KEY",
    "testEndpoint": "/api/demo"
  }
}
```

### 4. บันทึก API Key และทดสอบ
```bash
# ใช้ API Key ที่ได้จากขั้นตอนที่ 3
export API_KEY="gis_xxxxxxxxxxxxx..."

# ทดสอบ Demo API (ใช้ 2 credits)
curl -X GET http://localhost:3000/api/demo \
  -H "Authorization: Bearer $API_KEY"
```

### 5. ทดสอบ POST Demo API (ใช้ 3 credits)
```bash
curl -X POST http://localhost:3000/api/demo \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"test": "Hello API!"}'
```

### 6. ดู Usage Statistics
```bash
curl -X GET "http://localhost:3000/api/usage?stats=true&days=7" \
  -H "Authorization: Bearer $API_KEY"
```

### 7. ตรวจสอบ Credits
```bash
curl -X GET http://localhost:3000/api/credits \
  -H "Authorization: Bearer $API_KEY"
```

## 🔧 Windows PowerShell Commands

หากใช้ Windows PowerShell:

```powershell
# 1. สร้าง demo user
$response = Invoke-RestMethod -Uri "http://localhost:3000/api/demo/setup" `
    -Method POST `
    -ContentType "application/json" `
    -Body '{"email": "demo@example.com", "credits": 1000}'

# 2. เก็บ API Key
$apiKey = $response.apiKey

# 3. ทดสอบ API
$headers = @{ "Authorization" = "Bearer $apiKey" }
Invoke-RestMethod -Uri "http://localhost:3000/api/demo" -Headers $headers

# 4. ดู usage
Invoke-RestMethod -Uri "http://localhost:3000/api/usage?stats=true" -Headers $headers
```

## 📊 Expected Responses

### Demo API Response:
```json
{
  "message": "This is a demo API endpoint",
  "timestamp": "2024-01-01T00:00:00Z",
  "user": {
    "id": "user_xxx",
    "email": "demo@example.com",
    "credits": 998
  },
  "apiKey": {
    "id": "key_xxx",
    "name": "Demo API Key - 2024-01-01T00:00:00Z"
  },
  "requestInfo": {
    "method": "GET",
    "url": "http://localhost:3000/api/demo",
    "userAgent": "curl/7.68.0"
  }
}
```

### Usage Statistics Response:
```json
{
  "user": {
    "id": "user_xxx",
    "email": "demo@example.com",
    "currentCredits": 995
  },
  "summary": {
    "totalRequests": 2,
    "totalCreditsUsed": 5,
    "successfulRequests": 2,
    "successRate": 100
  },
  "usage": [
    {
      "id": "log_xxx",
      "endpoint": "/api/demo",
      "creditsUsed": 3,
      "status": "success",
      "processingTime": 234,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "analytics": {
    "dailyStats": [...],
    "period": "7 days"
  }
}
```

## ❌ Error Troubleshooting

### ถ้าได้ "Missing or invalid authorization header"
- ตรวจสอบว่าส่ง `Authorization: Bearer gis_xxxxx` header
- ตรวจสอบว่า API key ขึ้นต้นด้วย `gis_`

### ถ้าได้ "Invalid API key"
- API key อาจจะผิด หรือไม่ได้สร้างจาก demo setup
- ลองสร้าง API key ใหม่ด้วย demo setup

### ถ้าได้ "Insufficient credits"
- ตรวจสอบยอด credits ด้วย `/api/credits`
- สร้าง user ใหม่ด้วย demo setup (จะได้ 1000 credits)

## 🎯 Next Steps

หลังจากทดสอบเบื้องต้นแล้ว คุณสามารถ:

1. **ปรับแต่ง Credit Costs** ในไฟล์ `/lib/api-config.ts`
2. **เพิ่ม Rate Limits** ตาม endpoint
3. **สร้าง API endpoints ใหม่** โดยใช้ `createApiRoute` wrapper
4. **ดู Analytics** ในรายละเอียดผ่าน `/api/usage`

---

🎉 **หากทุกขั้นตอนทำงานได้ แสดงว่าระบบ API Infrastructure ของคุณพร้อมใช้งานแล้ว!**
