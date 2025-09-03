// app/api/health/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Test database connection
    const dbStart = Date.now();
    await db.execute('SELECT 1');
    const dbTime = Date.now() - dbStart;

    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      memory: {
        used: process.memoryUsage().heapUsed / 1024 / 1024, // MB
        total: process.memoryUsage().heapTotal / 1024 / 1024, // MB
      },
      database: {
        status: 'connected',
        responseTime: `${dbTime}ms`
      },
      services: {
        api: 'operational',
        auth: 'operational',
        usage_tracking: 'operational',
        credits: 'operational'
      }
    };

    return NextResponse.json(healthStatus);

  } catch (error) {
    console.error('Health check error:', error);
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      database: {
        status: 'disconnected'
      }
    }, { status: 503 });
  }
}
