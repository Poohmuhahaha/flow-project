// lib/api-middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { authenticateApiKey } from '@/lib/db/auth-db/auth';
import { createUsageLog, deductCredits } from '@/lib/db/queries';

export interface ApiConfig {
  requiresAuth: boolean;
  creditCost: number;
  rateLimit?: {
    requests: number;
    windowMs: number;
  };
}

// Rate limiting store (ในการใช้งานจริงควรใช้ Redis)
const rateLimitStore = new Map<string, { requests: number; resetTime: number }>();

export function withApiHandler(
  handler: (req: NextRequest, context: any) => Promise<NextResponse>,
  config: ApiConfig
) {
  return async function (request: NextRequest, context?: any) {
    const startTime = Date.now();
    let authResult: any = null;
    let usageLogData: any = {
      endpoint: request.nextUrl.pathname,
      creditsUsed: config.creditCost,
      requestData: null,
      responseData: null,
      processingTime: 0,
      status: 'error',
      errorMessage: null
    };

    try {
      // 1. Authentication
      if (config.requiresAuth) {
        authResult = await authenticateApiKey(request);
        if ('error' in authResult) {
          usageLogData.errorMessage = authResult.error;
          return NextResponse.json({ error: authResult.error }, { status: authResult.status });
        }

        usageLogData.userId = authResult.user.id;
        usageLogData.apiKeyId = authResult.apiKey.id;
      }

      // 2. Rate Limiting
      if (config.rateLimit && authResult) {
        const rateLimitKey = `${authResult.user.id}:${request.nextUrl.pathname}`;
        const now = Date.now();
        const windowStart = now - config.rateLimit.windowMs;
        
        let userRateLimit = rateLimitStore.get(rateLimitKey);
        
        if (!userRateLimit || userRateLimit.resetTime < windowStart) {
          userRateLimit = { requests: 0, resetTime: now + config.rateLimit.windowMs };
          rateLimitStore.set(rateLimitKey, userRateLimit);
        }
        
        if (userRateLimit.requests >= config.rateLimit.requests) {
          usageLogData.errorMessage = 'Rate limit exceeded';
          usageLogData.status = 'rate_limited';
          
          // Log the rate limit violation
          if (authResult) {
            await createUsageLog(usageLogData);
          }
          
          return NextResponse.json({ 
            error: 'Rate limit exceeded',
            retryAfter: Math.ceil((userRateLimit.resetTime - now) / 1000)
          }, { status: 429 });
        }
        
        userRateLimit.requests++;
      }

      // 3. Credit Check and Deduction
      if (config.creditCost > 0 && authResult) {
        const hasCredits = await deductCredits(authResult.user.id, config.creditCost);
        if (!hasCredits) {
          usageLogData.errorMessage = 'Insufficient credits';
          usageLogData.status = 'insufficient_credits';
          
          await createUsageLog(usageLogData);
          
          return NextResponse.json({ 
            error: 'Insufficient credits',
            required: config.creditCost,
            current: authResult.user.credits
          }, { status: 402 });
        }
      }

      // 4. บันทึก request data (ถ้าต้องการ)
      try {
        const contentType = request.headers.get('content-type');
        if (contentType?.includes('application/json') && request.body) {
          const clonedRequest = request.clone();
          usageLogData.requestData = await clonedRequest.json();
        }
      } catch {
        // ไม่สามารถอ่าน request body ได้
      }

      // 5. Execute the actual handler
      const response = await handler(request, { 
        user: authResult?.user, 
        apiKey: authResult?.apiKey 
      });

      // 6. Log successful usage
      usageLogData.processingTime = Date.now() - startTime;
      usageLogData.status = response.status < 400 ? 'success' : 'error';
      
      // บันทึก response data (เฉพาะ status code และขนาด)
      try {
        usageLogData.responseData = {
          status: response.status,
          statusText: response.statusText,
          size: response.headers.get('content-length') || 0
        };
      } catch {
        // ไม่สามารถอ่าน response ได้
      }

      // Log to database
      if (authResult) {
        createUsageLog(usageLogData).catch(console.error); // ไม่รอ
      }

      return response;

    } catch (error) {
      console.error('API Handler Error:', error);
      
      usageLogData.processingTime = Date.now() - startTime;
      usageLogData.status = 'error';
      usageLogData.errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Log error
      if (authResult) {
        createUsageLog(usageLogData).catch(console.error);
      }

      return NextResponse.json({ 
        error: 'Internal server error' 
      }, { status: 500 });
    }
  };
}

// Helper function สำหรับ endpoints ธรรมดา
export function createApiRoute(
  handler: (req: NextRequest, context: any) => Promise<NextResponse>,
  config: Partial<ApiConfig> = {}
) {
  const fullConfig: ApiConfig = {
    requiresAuth: true,
    creditCost: 1,
    ...config
  };
  
  return withApiHandler(handler, fullConfig);
}
