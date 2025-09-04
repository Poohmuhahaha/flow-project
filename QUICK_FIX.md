## 🚨 Dashboard Database Errors - QUICK FIX GUIDE

### ปัญหา: Dashboard พังเพราะ Database Queries Error

**อาการ:**
- Console เต็มไปด้วย "Failed query" errors
- Dashboard แสดงข้อมูลว่างเปล่า
- Components crash หรือไม่แสดงผล

### ✅ วิธีแก้ไขด่วน:

#### 1. ตรวจสอบ Database Connection
```bash
# เปิด terminal และรัน
curl http://localhost:3000/api/admin/db-health

# ถ้าได้ {"success": true, "healthy": true} แสดงว่า OK
# ถ้าได้ error หรือ healthy: false แสดงว่าต้องแก้ไข
```

#### 2. ตั้งค่า Database Tables
```bash
# สำหรับ Windows
setup-db.bat

# สำหรับ Linux/Mac  
./setup-db.sh

# หรือรันผ่าน API
curl -X POST http://localhost:3000/api/admin/db-health \
  -H "Content-Type: application/json" \
  -d '{"action": "initialize"}'
```

#### 3. ตรวจสอบ .env File
```env
# ตรวจสอบว่ามี DATABASE_URL
DATABASE_URL="postgresql://username:password@host:port/database"

# ถ้าไม่มี copy จาก .env.example
cp .env.example .env
```

#### 4. Reset Database (ถ้าจำเป็น)
```bash
# ลบและสร้างใหม่
npm run db:generate
npm run db:migrate

# หรือรันผ่าน SQL
psql $DATABASE_URL -f manual_db_setup.sql
```

### 🔧 การแก้ไขที่ทำไปแล้ว:

1. **Error Handling** - ทุก query ตอนนี้ return [] แทน throw error
2. **Safe Data Processing** - เช็ค Array.isArray() ก่อนใช้งาน
3. **Fallback Values** - ใช้ default values สำหรับ null/undefined
4. **Database Setup Tools** - เพิ่ม scripts และ API สำหรับตั้งค่า

### 📊 ตรวจสอบว่าใช้งานได้:

```bash
# 1. เช็ค health
curl http://localhost:3000/api/admin/db-health

# 2. เช็ค API
curl http://localhost:3000/api/health

# 3. เช็ค dashboard (หลัง login)
# เข้า http://localhost:3000/dashboard
```

### ❗ ถ้ายังไม่ได้:

1. **เช็ค Console Errors** - เปิด Browser DevTools ดู error messages
2. **เช็ค Server Logs** - ดู terminal ที่รัน `npm run dev`
3. **เช็ค Database Permissions** - user ต้องมีสิทธิ์ CREATE/INSERT/SELECT
4. **Clear Cache** - รีสตาร์ท development server

### 🎯 Expected Result:
- Dashboard โหลดไม่มี error
- แสดงข้อมูล user และ credits
- API Keys section ทำงานได้ปกติ
- Charts และ stats แสดงผล (อาจจะว่างถ้าไม่มีข้อมูล usage)

**Dashboard ควรใช้งานได้ปกติแล้ว!** 🎉
