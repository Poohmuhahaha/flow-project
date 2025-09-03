// lib/api-utils.ts
import { NextRequest } from 'next/server';
import { API_CONFIG } from './api-config';

/**
 * Extract user IP address from request
 */
export function getUserIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }
  
  // Fallback for development
  return request.ip || '127.0.0.1';
}

/**
 * Extract user agent from request
 */
export function getUserAgent(request: NextRequest): string {
  return request.headers.get('user-agent') || 'Unknown';
}

/**
 * Generate rate limit key
 */
export function generateRateLimitKey(userId: string, endpoint: string): string {
  return `rate_limit:${userId}:${endpoint}`;
}

/**
 * Validate API key format
 */
export function isValidApiKeyFormat(apiKey: string): boolean {
  if (!apiKey) return false;
  
  const { PREFIX, KEY_LENGTH } = API_CONFIG.API_KEYS;
  
  if (!apiKey.startsWith(PREFIX)) return false;
  
  const keyPart = apiKey.substring(PREFIX.length);
  return keyPart.length === KEY_LENGTH * 2; // hex string is 2x length
}

/**
 * Calculate credits required for an endpoint
 */
export function getEndpointCreditCost(endpoint: string): number {
  // Map endpoints to credit costs
  const endpointMap: Record<string, number> = {
    '/api/demo': API_CONFIG.CREDITS.DEMO_GET,
    '/api/gis/optimize': API_CONFIG.CREDITS.GIS_ROUTE_OPTIMIZATION,
    '/api/gis/batch': API_CONFIG.CREDITS.GIS_BATCH_PROCESSING,
  };
  
  return endpointMap[endpoint] || 1; // Default cost
}

/**
 * Format error response
 */
export interface ApiError {
  error: string;
  code?: string;
  details?: any;
  timestamp?: string;
}

export function createErrorResponse(
  message: string, 
  code?: string, 
  details?: any
): ApiError {
  return {
    error: message,
    code,
    details,
    timestamp: new Date().toISOString()
  };
}

/**
 * Format success response
 */
export interface ApiSuccess<T = any> {
  success: true;
  data: T;
  timestamp: string;
  meta?: any;
}

export function createSuccessResponse<T>(
  data: T, 
  meta?: any
): ApiSuccess<T> {
  return {
    success: true,
    data,
    timestamp: new Date().toISOString(),
    meta
  };
}

/**
 * Sanitize request data for logging
 */
export function sanitizeRequestData(data: any): any {
  if (!data) return null;
  
  const sanitized = { ...data };
  
  // Remove sensitive fields
  const sensitiveFields = ['password', 'token', 'apiKey', 'secret'];
  
  for (const field of sensitiveFields) {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  }
  
  return sanitized;
}

/**
 * Calculate processing time in milliseconds
 */
export function calculateProcessingTime(startTime: number): number {
  return Date.now() - startTime;
}
