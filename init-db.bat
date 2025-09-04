@echo off
echo 🚀 Initializing FLO(W) Database...
echo.

echo 📡 Testing database connection...
bun run db:test
if %errorlevel% neq 0 (
    echo ❌ Database connection test failed
    echo 💡 Please check your DATABASE_URL in .env file
    pause
    exit /b 1
)

echo.
echo 🛠️ Initializing database tables...
bun run db:init
if %errorlevel% neq 0 (
    echo ❌ Database initialization failed
    pause
    exit /b 1
)

echo.
echo ✅ Database setup completed successfully!
echo 💡 You can now start the application with: bun dev
echo.
pause
