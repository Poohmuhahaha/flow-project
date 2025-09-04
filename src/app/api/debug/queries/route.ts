import { NextRequest, NextResponse } from 'next/server';
import { getDatabaseHealth, getUserUsage, getUserApiKeys, getUserUsageStats } from '@/lib/db/queries';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'demo-user-id';
    const days = parseInt(searchParams.get('days') || '30');
    
    console.log('[Debug] Testing queries for userId:', userId);
    
    // Get database health first
    const health = await getDatabaseHealth();
    console.log('[Debug] Database health:', health);
    
    // Test each query individually
    const testResults = {
      health,
      tests: {
        getUserUsage: { success: false, data: null, error: null },
        getUserApiKeys: { success: false, data: null, error: null },
        getUserUsageStats: { success: false, data: null, error: null }
      }
    };
    
    // Test getUserUsage
    try {
      console.log('[Debug] Testing getUserUsage...');
      const usageData = await getUserUsage(userId, 10);
      testResults.tests.getUserUsage = {
        success: true,
        data: usageData,
        error: null
      };
      console.log('[Debug] getUserUsage success, count:', usageData?.length || 0);
    } catch (error) {
      testResults.tests.getUserUsage = {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      console.log('[Debug] getUserUsage failed:', error);
    }
    
    // Test getUserApiKeys
    try {
      console.log('[Debug] Testing getUserApiKeys...');
      const apiKeysData = await getUserApiKeys(userId);
      testResults.tests.getUserApiKeys = {
        success: true,
        data: apiKeysData,
        error: null
      };
      console.log('[Debug] getUserApiKeys success, count:', apiKeysData?.length || 0);
    } catch (error) {
      testResults.tests.getUserApiKeys = {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      console.log('[Debug] getUserApiKeys failed:', error);
    }
    
    // Test getUserUsageStats
    try {
      console.log('[Debug] Testing getUserUsageStats...');
      const statsData = await getUserUsageStats(userId, days);
      testResults.tests.getUserUsageStats = {
        success: true,
        data: statsData,
        error: null
      };
      console.log('[Debug] getUserUsageStats success, count:', statsData?.length || 0);
    } catch (error) {
      testResults.tests.getUserUsageStats = {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      console.log('[Debug] getUserUsageStats failed:', error);
    }
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      userId,
      ...testResults
    });
    
  } catch (error) {
    console.error('[Debug] Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
