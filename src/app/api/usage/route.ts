import { NextRequest, NextResponse } from 'next/server';
import { authenticateApiKey } from '@/lib/db/auth-db/auth';
import { getUserUsage, getUserUsageStats } from '@/lib/db/queries';

export async function GET(request: NextRequest) {
  try {
    // Authentication
    const auth = await authenticateApiKey(request);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { user } = auth;

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const days = parseInt(searchParams.get('days') || '30');
    const includeStats = searchParams.get('stats') === 'true';

    // Fetch usage logs
    const usageLogs = await getUserUsage(user.id, limit);

    // Calculate summary
    const totalRequests = usageLogs.length;
    const totalCreditsUsed = usageLogs.reduce((sum, log) => sum + log.creditsUsed, 0);
    const successfulRequests = usageLogs.filter(log => log.status === 'success').length;

    const response: any = {
      user: {
        id: user.id,
        email: user.email,
        currentCredits: user.credits
      },
      summary: {
        totalRequests,
        totalCreditsUsed,
        successfulRequests,
        successRate: totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 0
      },
      usage: usageLogs.map(log => ({
        id: log.id,
        endpoint: log.endpoint,
        creditsUsed: log.creditsUsed,
        status: log.status,
        processingTime: log.processingTime,
        createdAt: log.createdAt,
        errorMessage: log.errorMessage
      }))
    };

    // เพิ่ม analytics ถ้าร้องขอ
    if (includeStats) {
      const stats = await getUserUsageStats(user.id, days);
      response.analytics = {
        dailyStats: stats,
        period: `${days} days`
      };
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Usage fetch error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}