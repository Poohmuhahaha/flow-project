@echo off
echo 🔧 FLO(W) Database Quick Fix
echo ============================

echo.
echo 1. Testing server connection...
curl -s http://localhost:3000/api/health > nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Server not running or not accessible
    echo 💡 Please run: bun dev
    echo    Then run this script again
    pause
    exit /b 1
)
echo ✅ Server is running

echo.
echo 2. Checking database health...
curl -s http://localhost:3000/api/admin/db-health

echo.
echo 3. Initializing database...
curl -s -X POST http://localhost:3000/api/admin/db-health -H "Content-Type: application/json" -d "{\"action\": \"initialize\"}"

echo.
echo 4. Testing database queries...
curl -s "http://localhost:3000/api/debug/queries?userId=test-user"

echo.
echo.
echo 🎉 Database fix completed!
echo.
echo 💡 Next steps:
echo    1. Visit http://localhost:3000/dashboard
echo    2. Check for console errors
echo    3. If still issues, check: http://localhost:3000/api/admin/db-health
echo.
pause
