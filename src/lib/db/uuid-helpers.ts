// lib/db/uuid-helpers.ts
// Helper functions for ID generation
import { randomUUID } from 'crypto';

export function generateId(): string {
  return randomUUID();
}

export function generateUserId(): string {
  return `user_${generateId()}`;
}

export function generateSessionId(): string {
  return `session_${generateId()}`;
}

export function generateApiKeyId(): string {
  return `apikey_${generateId()}`;
}

export function generateUsageLogId(): string {
  return `usage_${generateId()}`;
}

export function generatePasswordResetId(): string {
  return `reset_${generateId()}`;
}