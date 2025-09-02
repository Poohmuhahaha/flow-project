// lib/auth.ts
import { NextRequest } from 'next/server';
import { getUserByApiKey, hashApiKey, updateApiKeyLastUsed } from '../queries';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    email: string;
    credits: number;
  };
  apiKey?: {
    id: string;
    name: string;
  };
}

export async function authenticateApiKey(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { error: 'Missing or invalid authorization header', status: 401 };
    }

    const apiKey = authHeader.substring(7); // ลบ "Bearer " ออก
    
    if (!apiKey.startsWith('gis_')) {
      return { error: 'Invalid API key format', status: 401 };
    }

    const rawKey = apiKey.substring(4); // ลบ "gis_" ออก
    const keyHash = hashApiKey(rawKey);
    
    const result = await getUserByApiKey(keyHash);
    
    if (!result) {
      return { error: 'Invalid API key', status: 401 };
    }

    // อัพเดท last used (ไม่ต้องรอ)
    updateApiKeyLastUsed(result.apiKey.id).catch(console.error);

    return {
      user: {
        id: result.user.id,
        email: result.user.email,
        credits: result.user.credits,
      },
      apiKey: {
        id: result.apiKey.id,
        name: result.apiKey.name,
      }
    };

  } catch (error) {
    console.error('Auth error:', error);
    return { error: 'Authentication failed', status: 500 };
  }
}

export function checkCredits(userCredits: number, requiredCredits: number) {
  return userCredits >= requiredCredits;
}