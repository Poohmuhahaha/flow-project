import { NextRequest, NextResponse } from 'next/server';
import { testDatabaseConnection, checkTablesExist, initializeDatabase, getDatabaseHealth } from '@/lib/db/queries';

export async function GET(request: NextRequest) {
  try {
    console.log('[DB Health] Checking database health...');
    
    const healthStatus = await getDatabaseHealth();
    
    return NextResponse.json({
      success: healthStatus.connection.success && healthStatus.tables.success,
      timestamp: new Date().toISOString(),
      ...healthStatus
    });
    
  } catch (error) {
    console.error('[DB Health] Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (body.action === 'initialize') {
      console.log('[DB Health] Initializing database...');
      const result = await initializeDatabase();
      
      return NextResponse.json({
        success: result.success,
        message: result.success ? 'Database initialized successfully' : 'Database initialization failed',
        error: result.error,
        timestamp: new Date().toISOString()
      });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Invalid action. Use {"action": "initialize"} to setup database'
    }, { status: 400 });
    
  } catch (error) {
    console.error('[DB Health] Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
