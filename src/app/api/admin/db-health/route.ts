// app/api/admin/db-health/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { checkDatabaseHealth, setupDatabase, initializeDatabase } from '@/lib/db/setup';

export async function GET(request: NextRequest) {
  try {
    const isHealthy = await checkDatabaseHealth();
    
    return NextResponse.json({
      success: true,
      healthy: isHealthy,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Database health check error:', error);
    return NextResponse.json({
      success: false,
      error: 'Health check failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;
    
    if (action === 'setup') {
      const success = await setupDatabase();
      
      return NextResponse.json({
        success,
        message: success ? 'Database setup completed' : 'Database setup failed'
      });
    }
    
    if (action === 'initialize') {
      await initializeDatabase();
      
      return NextResponse.json({
        success: true,
        message: 'Database initialized successfully'
      });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Invalid action'
    }, { status: 400 });
    
  } catch (error) {
    console.error('Database setup error:', error);
    return NextResponse.json({
      success: false,
      error: 'Setup failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
