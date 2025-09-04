import { NextRequest, NextResponse } from 'next/server';
import { testDatabaseConnection, checkTablesExist, initializeDatabase } from '@/lib/db/queries';

export async function GET(request: NextRequest) {
  try {
    console.log('[DB Health] Checking database health...');
    
    // Test database connection
    const connectionTest = await testDatabaseConnection();
    console.log('[DB Health] Connection test:', connectionTest);
    
    // Check if tables exist
    const tablesCheck = await checkTablesExist();
    console.log('[DB Health] Tables check:', tablesCheck);
    
    const healthStatus = {
      timestamp: new Date().toISOString(),
      connection: connectionTest,
      tables: tablesCheck,
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasDbUrl: !!process.env.DATABASE_URL,
        dbUrlLength: process.env.DATABASE_URL?.length || 0
      }
    };
    
    return NextResponse.json({
      success: connectionTest.success && tablesCheck.success,
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
      error: 'Invalid action'
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
