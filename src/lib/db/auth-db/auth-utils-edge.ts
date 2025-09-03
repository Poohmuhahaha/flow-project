// lib/db/auth-db/auth-utils-edge.ts
import { NextRequest } from 'next/server';

/**
 * Extract session token from request (Edge Runtime compatible)
 */
export function getSessionFromRequest(request: NextRequest): string | undefined {
  // ลอง cookie ก่อน
  const sessionToken = request.cookies.get('session_token')?.value;
  if (sessionToken) {
    return sessionToken;
  }

  // ลอง Authorization header (สำหรับ session-based auth)
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Session ')) {
    return authHeader.substring(8); // ลบ "Session " ออก
  }

  return undefined;
}

/**
 * Extract API key from request (Edge Runtime compatible)
 */
export function getApiKeyFromRequest(request: NextRequest): string | undefined {
  const authHeader = request.headers.get('authorization');
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const apiKey = authHeader.substring(7); // ลบ "Bearer " ออก
    
    // ตรวจสอบว่าเป็น API key format หรือไม่
    if (apiKey.startsWith('gis_')) {
      return apiKey;
    }
  }
  
  return undefined;
}

/**
 * Validate API key format (Edge Runtime compatible)
 */
export function isValidApiKeyFormat(apiKey: string): boolean {
  if (!apiKey || typeof apiKey !== 'string') {
    return false;
  }
  
  // Check prefix
  if (!apiKey.startsWith('gis_')) {
    return false;
  }
  
  // Check length (gis_ + 64 hex chars = 68 total)
  if (apiKey.length !== 68) {
    return false;
  }
  
  // Check if the part after prefix is valid hex
  const keyPart = apiKey.substring(4);
  const hexRegex = /^[a-f0-9]{64}$/i;
  
  return hexRegex.test(keyPart);
}

/**
 * Create session cookie options
 */
export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  };
}
