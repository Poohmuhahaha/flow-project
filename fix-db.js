#!/usr/bin/env node

// Quick database fix script
const { execSync } = require('child_process');

console.log('🔧 FLO(W) Database Quick Fix');
console.log('============================');

try {
  // Step 1: Test if server is running
  console.log('\n1. Testing server connection...');
  try {
    const healthResponse = execSync('curl -s http://localhost:3000/api/health', { encoding: 'utf8', timeout: 5000 });
    const health = JSON.parse(healthResponse);
    if (health.success) {
      console.log('✅ Server is running');
    } else {
      throw new Error('Server not healthy');
    }
  } catch (error) {
    console.log('❌ Server not running or not accessible');
    console.log('💡 Please run: bun dev');
    console.log('   Then run this script again');
    process.exit(1);
  }

  // Step 2: Check database health
  console.log('\n2. Checking database health...');
  try {
    const dbHealthResponse = execSync('curl -s http://localhost:3000/api/admin/db-health', { encoding: 'utf8', timeout: 10000 });
    const dbHealth = JSON.parse(dbHealthResponse);
    
    console.log('🔍 Connection:', dbHealth.connection?.success ? '✅ OK' : '❌ Failed');
    console.log('🔍 Tables:', dbHealth.tables?.success ? '✅ OK' : '❌ Missing');
    
    if (dbHealth.connection?.success && dbHealth.tables?.success) {
      console.log('✅ Database is healthy!');
    } else {
      throw new Error('Database needs initialization');
    }
  } catch (error) {
    console.log('⚠️  Database needs setup');
  }

  // Step 3: Initialize database if needed
  console.log('\n3. Initializing database...');
  try {
    const initResponse = execSync('curl -s -X POST http://localhost:3000/api/admin/db-health -H "Content-Type: application/json" -d "{\\"action\\": \\"initialize\\"}"', { encoding: 'utf8', timeout: 30000 });
    const initResult = JSON.parse(initResponse);
    
    if (initResult.success) {
      console.log('✅ Database initialized successfully');
    } else {
      console.log('❌ Database initialization failed:', initResult.error);
    }
  } catch (error) {
    console.log('❌ Failed to initialize database:', error.message);
  }

  // Step 4: Test queries
  console.log('\n4. Testing database queries...');
  try {
    const queryResponse = execSync('curl -s "http://localhost:3000/api/debug/queries?userId=test-user"', { encoding: 'utf8', timeout: 10000 });
    const queryResult = JSON.parse(queryResponse);
    
    if (queryResult.success) {
      console.log('🧪 Query tests:');
      console.log('   getUserUsage:', queryResult.tests?.getUserUsage?.success ? '✅' : '❌');
      console.log('   getUserApiKeys:', queryResult.tests?.getUserApiKeys?.success ? '✅' : '❌');
      console.log('   getUserUsageStats:', queryResult.tests?.getUserUsageStats?.success ? '✅' : '❌');
    }
  } catch (error) {
    console.log('⚠️  Query tests failed:', error.message);
  }

  console.log('\n🎉 Database fix completed!');
  console.log('\n💡 Next steps:');
  console.log('   1. Visit http://localhost:3000/dashboard');
  console.log('   2. Check for console errors');
  console.log('   3. If still issues, check: http://localhost:3000/api/admin/db-health');

} catch (error) {
  console.error('\n❌ Fix script failed:', error.message);
  console.log('\n🔍 Manual steps:');
  console.log('   1. Ensure server is running: bun dev');
  console.log('   2. Check database URL in .env file');
  console.log('   3. Visit: http://localhost:3000/api/admin/db-health');
  process.exit(1);
}
