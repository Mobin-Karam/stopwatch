export default () => ({
  app: {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.APP_PORT ?? process.env.PORT ?? '3000', 10),
    baseUrl: process.env.APP_BASE_URL || 'http://localhost:3000',
    frontendOrigins: (process.env.CORS_ORIGINS || process.env.FRONTEND_ORIGIN || 'http://localhost:3000')
      .split(',')
      .map((o) => o.trim())
      .filter(Boolean),
  },
  database: {
    uri: process.env.MONGO_URI || process.env.POSTGRES_URL || 'mongodb://localhost:27017/time',
    retryAttempts: parseInt(process.env.DB_RETRY_ATTEMPTS ?? '5', 10),
    retryDelay: parseInt(process.env.DB_RETRY_DELAY_MS ?? '2000', 10),
    queryTimeoutMs: parseInt(process.env.DB_QUERY_TIMEOUT_MS ?? '5000', 10),
  },
  redis: {
    url: process.env.REDIS_URL || '',
  },
  security: {
    sessionSecret: process.env.SESSION_SECRET || 'dev-secret-change-me',
    cookieDomain: process.env.COOKIE_DOMAIN || '',
  },
  oauth: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    },
  },
  payments: {
    zarinpalMerchantId: process.env.ZARINPAL_MERCHANT_ID || '',
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    pretty: process.env.LOG_PRETTY === 'true',
    toFile: process.env.LOG_TO_FILE === 'true',
    filePath: process.env.LOG_FILE_PATH || 'logs/app.log',
  },
  realtime: {
    voiceSharedSecret: process.env.VOICE_SHARED_SECRET || 'dev-voice-secret',
    turnUrls: process.env.TURN_URLS || '',
    turnUsername: process.env.TURN_USERNAME || '',
    turnPassword: process.env.TURN_PASSWORD || '',
    offlineMode: process.env.OFFLINE_MODE === 'true',
  },
  tracing: {
    otlpEndpoint: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318',
  },
});
