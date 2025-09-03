// app/api/demo/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createApiRoute } from '@/lib/api-middleware';

// Demo API endpoint สำหรับทดสอบระบบ
const handler = async (request: NextRequest, context: any) => {
  const { user, apiKey } = context;
  
  // จำลองการประมวลผล
  await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));
  
  const demoData = {
    message: 'This is a demo API endpoint',
    timestamp: new Date().toISOString(),
    user: {
      id: user.id,
      email: user.email,
      credits: user.credits
    },
    apiKey: {
      id: apiKey.id,
      name: apiKey.name
    },
    requestInfo: {
      method: request.method,
      url: request.url,
      userAgent: request.headers.get('user-agent')
    }
  };
  
  // สุ่มข้อผิดพลาดเพื่อทดสอบ error handling
  if (Math.random() < 0.1) { // 10% chance ของ error
    throw new Error('Random demo error for testing');
  }
  
  return NextResponse.json(demoData);
};

// สร้าง API route ด้วย middleware
export const GET = createApiRoute(handler, {
  requiresAuth: true,
  creditCost: 2,
  rateLimit: {
    requests: 10,
    windowMs: 60 * 1000 // 10 requests per minute
  }
});

export const POST = createApiRoute(async (request: NextRequest, context: any) => {
  const { user } = context;
  const body = await request.json();
  
  return NextResponse.json({
    message: 'POST request processed',
    receivedData: body,
    user: user.email,
    processedAt: new Date().toISOString()
  });
}, {
  requiresAuth: true,
  creditCost: 3,
  rateLimit: {
    requests: 5,
    windowMs: 60 * 1000 // 5 requests per minute
  }
});
