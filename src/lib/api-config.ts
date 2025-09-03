// lib/api-config.ts
export const API_CONFIG = {
  // Credit costs for different operations
  CREDITS: {
    DEMO_GET: 2,
    DEMO_POST: 3,
    GIS_ROUTE_OPTIMIZATION: 5,
    GIS_BATCH_PROCESSING: 10,
    DATA_EXPORT: 1,
  },
  
  // Rate limiting configurations
  RATE_LIMITS: {
    DEFAULT: {
      requests: 100,
      windowMs: 60 * 60 * 1000, // 1 hour
    },
    DEMO: {
      requests: 20,
      windowMs: 60 * 1000, // 1 minute
    },
    GIS_PROCESSING: {
      requests: 50,
      windowMs: 60 * 60 * 1000, // 1 hour
    },
  },
  
  // API Key settings
  API_KEYS: {
    MAX_KEYS_PER_USER: 5,
    PREFIX: 'gis_',
    KEY_LENGTH: 32,
  },
  
  // Session settings
  SESSION: {
    EXPIRY_DAYS: 30,
    CLEANUP_INTERVAL_MS: 24 * 60 * 60 * 1000, // 24 hours
  },
  
  // Usage logs
  USAGE_LOGS: {
    DEFAULT_LIMIT: 100,
    MAX_LIMIT: 1000,
    RETENTION_DAYS: 90,
  },
} as const;

export type ApiEndpoint = keyof typeof API_CONFIG.CREDITS;
