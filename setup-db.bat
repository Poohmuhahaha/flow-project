@echo off
echo 🚀 Setting up FLO(W) Database...

REM Check if database is accessible
echo 📡 Testing database connection...
curl -s http://localhost:3000/api/admin/db-health

echo.
echo 🛠️ Initializing database tables...
curl -s -X POST http://localhost:3000/api/admin/db-health ^
  -H "Content-Type: application/json" ^
  -d "{\"action\": \"initialize\"}"

echo.
echo ✅ Database setup completed!

echo.
echo 🧪 Testing API endpoints...

REM Test health endpoint
echo Testing /api/health...
curl -s http://localhost:3000/api/health

echo.
echo Testing dashboard API (requires login)...
echo Visit http://localhost:3000/dashboard after login

echo.
echo 🎉 Setup completed! Your database should now be ready.
pause
