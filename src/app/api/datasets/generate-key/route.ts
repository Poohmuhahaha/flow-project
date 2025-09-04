// app/api/datasets/generate-key/route.ts - Generate API key for dataset access
import { NextRequest, NextResponse } from 'next/server';
import { createApiKey } from '@/lib/db/queries';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Temporary user verification - in production, use proper session management
function verifyUser(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return decoded;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    // For demo purposes, we'll create a simple verification
    // In production, you should use proper session authentication
    const body = await request.json();
    const { email, password, keyName } = body;

    // Simple demo verification - replace with your actual auth
    if (!email || !password) {
      return NextResponse.json({ 
        error: 'Email and password required for API key generation' 
      }, { status: 400 });
    }

    // For demo: create a dummy user ID based on email
    const demoUserId = `demo_${Buffer.from(email).toString('base64').slice(0, 10)}`;
    
    const apiKeyName = keyName || `Dataset Access Key - ${new Date().toLocaleDateString()}`;

    try {
      // Generate API key
      const newApiKey = await createApiKey(demoUserId, apiKeyName);

      return NextResponse.json({
        success: true,
        message: 'API key generated successfully',
        data: {
          apiKey: newApiKey,
          keyName: apiKeyName,
          userId: demoUserId,
          createdAt: new Date().toISOString(),
          usage: {
            endpoint: 'https://your-domain.com/api/datasets',
            methods: ['GET', 'POST'],
            authentication: 'Bearer token in header',
            creditCost: {
              'GET /api/datasets': 1,
              'POST /api/datasets': -5 // Reward for contribution
            }
          }
        },
        instructions: {
          header: 'Authorization: Bearer YOUR_API_KEY',
          examples: [
            'curl -H "Authorization: Bearer ' + newApiKey + '" https://your-domain.com/api/datasets?type=logistics',
            'curl -H "Authorization: Bearer ' + newApiKey + '" https://your-domain.com/api/datasets?type=all'
          ]
        }
      });

    } catch (dbError) {
      console.error('Database error creating API key:', dbError);
      
      // If there's a DB error, return the demo key anyway for testing
      const demoKey = `gis_demo_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      
      return NextResponse.json({
        success: true,
        message: 'Demo API key generated (database unavailable)',
        data: {
          apiKey: demoKey,
          keyName: apiKeyName,
          userId: demoUserId,
          createdAt: new Date().toISOString(),
          note: 'This is a demo key for testing. In production, keys are stored securely in database.',
          usage: {
            endpoint: 'http://localhost:3000/api/datasets',
            methods: ['GET', 'POST'],
            authentication: 'Bearer token in header'
          }
        },
        instructions: {
          header: 'Authorization: Bearer YOUR_API_KEY',
          examples: [
            'curl -H "Authorization: Bearer ' + demoKey + '" http://localhost:3000/api/datasets?type=logistics',
            'curl -H "Authorization: Bearer ' + demoKey + '" http://localhost:3000/api/datasets?type=all'
          ]
        }
      });
    }

  } catch (error) {
    console.error('API key generation error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// GET endpoint to show API key generation form/info
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Dataset API Key Generation Service',
    instructions: {
      method: 'POST',
      endpoint: '/api/datasets/generate-key',
      body: {
        email: 'your-email@example.com',
        password: 'your-password',
        keyName: 'Optional: My Dataset Access Key'
      },
      response: {
        apiKey: 'gis_xxxxxxxxxx',
        usage: 'Use this key in Authorization header'
      }
    },
    availableDatasets: {
      types: ['logistics', 'walkability', 'gis', 'all'],
      endpoints: [
        'GET /api/datasets?type=logistics - Get logistics data (1 credit)',
        'GET /api/datasets?type=walkability - Get walkability data (1 credit)', 
        'GET /api/datasets?type=gis - Get GIS boundary data (1 credit)',
        'GET /api/datasets?type=all - Get all datasets (1 credit)',
        'POST /api/datasets - Contribute data (earn 5 credits)'
      ]
    }
  });
}