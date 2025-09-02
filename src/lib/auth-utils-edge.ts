// lib/auth-utils-edge.ts - Edge Runtime compatible
import { NextRequest } from 'next/server';

// Generate secure token using Web Crypto API (Edge compatible)
export function generateSecureToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Get session from request
export function getSessionFromRequest(request: NextRequest): string | null {
  return request.cookies.get('session')?.value || null;
}

// Get client IP address
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const real = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (real) {
    return real.trim();
  }
  
  return 'unknown';
}

// Get user agent
export function getUserAgent(request: NextRequest): string {
  return request.headers.get('user-agent') || 'unknown';
}