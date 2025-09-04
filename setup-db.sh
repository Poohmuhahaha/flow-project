#!/bin/bash

echo "🚀 Setting up FLO(W) Database..."

# Check if database is accessible
echo "📡 Testing database connection..."
curl -s http://localhost:3000/api/admin/db-health | jq .

echo ""
echo "🛠️ Initializing database tables..."
curl -s -X POST http://localhost:3000/api/admin/db-health \
  -H "Content-Type: application/json" \
  -d '{"action": "initialize"}' | jq .

echo ""
echo "✅ Database setup completed!"

echo ""
echo "🧪 Testing API endpoints..."

# Test health endpoint
echo "Testing /api/health..."
curl -s http://localhost:3000/api/health | jq .

echo ""
echo "Testing dashboard API (requires login)..."
echo "Visit http://localhost:3000/dashboard after login"

echo ""
echo "🎉 Setup completed! Your database should now be ready."
