// app/api/gis/analyze/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { authenticateApiKey, checkCredits } from '@/lib/auth';
import { GISProcessor } from '@/lib/gis-processor';
import { createUsageLog, updateUserCredits } from '@/lib/db/queries';

const gisProcessor = new GISProcessor();

export async function POST(request: NextRequest) {
  try {
    // 1. Authentication
    const auth = await authenticateApiKey(request);
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { user, apiKey } = auth;

    // 2. Parse request body
    const body = await request.json();
    
    // 3. Validate request
    const validation = gisProcessor.validateRequest(body);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // 4. Check credits (ประมาณการ credits ที่ใช้)
    const estimatedCredits = getEstimatedCredits(body.analysisType);
    if (!checkCredits(user.credits, estimatedCredits)) {
      await createUsageLog({
        userId: user.id,
        apiKeyId: apiKey.id,
        endpoint: '/api/gis/analyze',
        creditsUsed: 0,
        requestData: body,
        status: 'insufficient_credits',
        errorMessage: 'Insufficient credits'
      });

      return NextResponse.json({ 
        error: 'Insufficient credits',
        required: estimatedCredits,
        available: user.credits
      }, { status: 402 });
    }

    // 5. Process GIS Analysis (Realtime processing)
    const analysisResult = await gisProcessor.processAnalysis(body);

    if (analysisResult.success) {
      // 6. Deduct credits
      const newCredits = user.credits - analysisResult.creditsUsed;
      await updateUserCredits(user.id, newCredits);

      // 7. Log usage
      await createUsageLog({
        userId: user.id,
        apiKeyId: apiKey.id,
        endpoint: '/api/gis/analyze',
        creditsUsed: analysisResult.creditsUsed,
        requestData: body,
        responseData: analysisResult.result,
        processingTime: analysisResult.processingTime,
        status: 'success'
      });

      return NextResponse.json({
        success: true,
        data: analysisResult.result,
        meta: {
          creditsUsed: analysisResult.creditsUsed,
          remainingCredits: newCredits,
          processingTime: analysisResult.processingTime
        }
      });

    } else {
      // Log failed analysis
      await createUsageLog({
        userId: user.id,
        apiKeyId: apiKey.id,
        endpoint: '/api/gis/analyze',
        creditsUsed: 0,
        requestData: body,
        processingTime: analysisResult.processingTime,
        status: 'error',
        errorMessage: analysisResult.error
      });

      return NextResponse.json({
        success: false,
        error: analysisResult.error
      }, { status: 500 });
    }

  } catch (error) {
    console.error('GIS Analysis error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

function getEstimatedCredits(analysisType: string): number {
  const creditMap: Record<string, number> = {
    'area': 1,
    'distance': 1,
    'buffer': 2,
    'overlay': 3
  };
  return creditMap[analysisType] || 1;
}

// app/api/usage/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { authenticateApiKey } from '@/lib/auth';
import { getUserUsage } from '@/lib/db/queries';

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

    // Fetch usage logs
    const usageLogs = await getUserUsage(user.id, limit);

    // Calculate summary
    const totalRequests = usageLogs.length;
    const totalCreditsUsed = usageLogs.reduce((sum, log) => sum + log.creditsUsed, 0);
    const successfulRequests = usageLogs.filter(log => log.status === 'success').length;

    return NextResponse.json({
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
    });

  } catch (error) {
    console.error('Usage fetch error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

// app/api/auth/api-key/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createApiKey } from '@/lib/db/queries';

// สำหรับ demo - ในการใช้งานจริงต้องมี user authentication
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, name } = body;

    if (!userId || !name) {
      return NextResponse.json({ 
        error: 'userId and name are required' 
      }, { status: 400 });
    }

    const apiKey = await createApiKey(userId, name);

    return NextResponse.json({
      success: true,
      apiKey,
      message: 'API key created successfully. Store it securely - it will not be shown again.'
    });

  } catch (error) {
    console.error('API key creation error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}