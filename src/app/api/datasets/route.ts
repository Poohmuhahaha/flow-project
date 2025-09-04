// app/api/datasets/route.ts - Main dataset API endpoint
import { NextRequest, NextResponse } from 'next/server';
import { authenticateApiKey, checkCredits } from '@/lib/db/auth-db/auth';
import { createUsageLog, updateUserCredits } from '@/lib/db/queries';

// Demo authentication for testing (bypasses database)
function authenticateApiKeyDemo(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { error: 'Missing or invalid authorization header', status: 401 };
    }

    const apiKey = authHeader.substring(7);
    
    if (!apiKey.startsWith('gis_demo_')) {
      // Try real authentication for non-demo keys
      return null;
    }

    // Demo user with sufficient credits
    return {
      user: {
        id: 'demo_user_123',
        email: 'demo@example.com',
        credits: 1000,
      },
      apiKey: {
        id: 'demo_key_123',
        name: 'Demo API Key',
      }
    };

  } catch (error) {
    console.error('Demo auth error:', error);
    return { error: 'Authentication failed', status: 500 };
  }
}

// Sample dataset structure - you can replace with your actual data
const sampleDatasets = {
  logistics: {
    warehouses: [
      { id: 1, name: "Bangkok Central Warehouse", lat: 13.7563, lng: 100.5018, capacity: 10000 },
      { id: 2, name: "Chiang Mai Distribution Center", lat: 18.7883, lng: 98.9853, capacity: 5000 },
      { id: 3, name: "Phuket Regional Hub", lat: 7.8804, lng: 98.3923, capacity: 3000 }
    ],
    routes: [
      { from: "Bangkok", to: "Chiang Mai", distance: 696, time: "8h 30m", cost: 2500 },
      { from: "Bangkok", to: "Phuket", distance: 862, time: "10h 15m", cost: 3200 },
      { from: "Chiang Mai", to: "Phuket", distance: 1456, time: "17h 45m", cost: 4800 }
    ]
  },
  walkability: {
    areas: [
      { id: 1, area: "Sukhumvit", walkability_score: 85, pedestrian_paths: 250, accessibility: "high" },
      { id: 2, area: "Silom", walkability_score: 90, pedestrian_paths: 180, accessibility: "high" },
      { id: 3, area: "Chatuchak", walkability_score: 75, pedestrian_paths: 120, accessibility: "medium" }
    ],
    infrastructure: [
      { type: "sidewalk", length_km: 1250, condition: "good", maintenance_required: false },
      { type: "crosswalk", count: 450, safety_rating: "high", accessibility_features: true },
      { type: "bridge", count: 85, pedestrian_access: true, condition: "excellent" }
    ]
  },
  gis: {
    boundaries: [
      { id: 1, name: "Bangkok Metropolitan", type: "administrative", area_km2: 1568.7 },
      { id: 2, name: "Chiang Mai Province", type: "administrative", area_km2: 20107.0 },
      { id: 3, name: "Phuket Province", type: "administrative", area_km2: 576.0 }
    ]
  }
};

export async function GET(request: NextRequest) {
  try {
    // 1. Authentication - try demo first, then real auth
    let auth = authenticateApiKeyDemo(request);
    
    if (!auth) {
      // Try real authentication
      auth = await authenticateApiKey(request);
    }
    
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { user, apiKey } = auth;

    // 2. Get query parameters
    const { searchParams } = new URL(request.url);
    const datasetType = searchParams.get('type') || 'all';
    const format = searchParams.get('format') || 'json';
    const limit = parseInt(searchParams.get('limit') || '100');

    // 3. Check credits (1 credit per dataset request)
    const creditsRequired = 1;
    if (!checkCredits(user.credits, creditsRequired)) {
      await createUsageLog({
        userId: user.id,
        apiKeyId: apiKey.id,
        endpoint: '/api/datasets',
        creditsUsed: 0,
        requestData: { type: datasetType, format, limit },
        status: 'insufficient_credits',
        errorMessage: 'Insufficient credits'
      });

      return NextResponse.json({ 
        error: 'Insufficient credits',
        required: creditsRequired,
        available: user.credits
      }, { status: 402 });
    }

    // 4. Get dataset based on type
    let responseData;
    const startTime = Date.now();

    switch (datasetType) {
      case 'logistics':
        responseData = sampleDatasets.logistics;
        break;
      case 'walkability':
        responseData = sampleDatasets.walkability;
        break;
      case 'gis':
        responseData = sampleDatasets.gis;
        break;
      case 'all':
        responseData = sampleDatasets;
        break;
      default:
        return NextResponse.json({ 
          error: 'Invalid dataset type',
          available_types: ['logistics', 'walkability', 'gis', 'all']
        }, { status: 400 });
    }

    const processingTime = Date.now() - startTime;

    // 5. Deduct credits (skip for demo)
    const newCredits = user.credits - creditsRequired;
    if (user.id !== 'demo_user_123') {
      try {
        await updateUserCredits(user.id, newCredits);
      } catch (error) {
        console.log('Database unavailable, continuing with demo...');
      }
    }

    // 6. Log usage (skip for demo)
    if (user.id !== 'demo_user_123') {
      try {
        await createUsageLog({
          userId: user.id,
          apiKeyId: apiKey.id,
          endpoint: '/api/datasets',
          creditsUsed: creditsRequired,
          requestData: { type: datasetType, format, limit },
          responseData: { recordCount: JSON.stringify(responseData).length },
          processingTime,
          status: 'success'
        });
      } catch (error) {
        console.log('Database unavailable, continuing with demo...');
      }
    }

    // 7. Return data
    return NextResponse.json({
      success: true,
      data: responseData,
      meta: {
        type: datasetType,
        format,
        creditsUsed: creditsRequired,
        remainingCredits: newCredits,
        processingTime,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Dataset API error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

// POST endpoint for contributing data to the dataset
export async function POST(request: NextRequest) {
  try {
    // 1. Authentication - try demo first, then real auth
    let auth = authenticateApiKeyDemo(request);
    
    if (!auth) {
      // Try real authentication
      auth = await authenticateApiKey(request);
    }
    
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { user, apiKey } = auth;

    // 2. Parse request body
    const body = await request.json();
    const { datasetType, data, contributorInfo } = body;

    // 3. Validate request
    if (!datasetType || !data) {
      return NextResponse.json({ 
        error: 'datasetType and data are required' 
      }, { status: 400 });
    }

    // 4. Check credits (5 credits for data contribution - reward system)
    const creditsReward = 5;
    const startTime = Date.now();

    // 5. Process contribution (in real implementation, you'd save to database)
    console.log(`Data contribution received:`, {
      user: user.email,
      type: datasetType,
      dataSize: JSON.stringify(data).length,
      contributor: contributorInfo
    });

    const processingTime = Date.now() - startTime;

    // 6. Add reward credits (skip for demo)
    const newCredits = user.credits + creditsReward;
    if (user.id !== 'demo_user_123') {
      try {
        await updateUserCredits(user.id, newCredits);
      } catch (error) {
        console.log('Database unavailable, continuing with demo...');
      }
    }

    // 7. Log contribution (skip for demo)
    if (user.id !== 'demo_user_123') {
      try {
        await createUsageLog({
          userId: user.id,
          apiKeyId: apiKey.id,
          endpoint: '/api/datasets',
          creditsUsed: -creditsReward, // Negative for reward
          requestData: { type: datasetType, action: 'contribute' },
          responseData: { status: 'contributed', dataSize: JSON.stringify(data).length },
          processingTime,
          status: 'success'
        });
      } catch (error) {
        console.log('Database unavailable, continuing with demo...');
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Data contribution received successfully',
      meta: {
        creditsRewarded: creditsReward,
        newCreditBalance: newCredits,
        contributionId: `contrib_${Date.now()}`,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Dataset contribution error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Internal server error' 
    }, { status: 500 });
  }
}