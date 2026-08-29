import * as Joi from 'joi';

export default Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().port().default(3000),
  APP_BASE_URL: Joi.string().uri().default('http://localhost:3000'),
  FRONTEND_ORIGIN: Joi.string().default('http://localhost:3000'),

  MONGO_URI: Joi.string().uri().default('mongodb://localhost:27017/time'),
  DB_RETRY_ATTEMPTS: Joi.number().integer().min(0).default(5),
  DB_RETRY_DELAY_MS: Joi.number().integer().min(0).default(2000),

  REDIS_URL: Joi.string().allow('').default(''),

  SESSION_SECRET: Joi.string().min(16).default('dev-secret-change-me'),
  COOKIE_DOMAIN: Joi.string().allow('').default(''),

  GOOGLE_CLIENT_ID: Joi.string().allow('').default(''),
  GOOGLE_CLIENT_SECRET: Joi.string().allow('').default(''),
  GITHUB_CLIENT_ID: Joi.string().allow('').default(''),
  GITHUB_CLIENT_SECRET: Joi.string().allow('').default(''),

  ZARINPAL_MERCHANT_ID: Joi.string().allow('').default(''),

  LOG_LEVEL: Joi.string().default('info'),
  LOG_PRETTY: Joi.boolean().default(false),
  LOG_TO_FILE: Joi.boolean().default(false),
  LOG_FILE_PATH: Joi.string().default('logs/app.log'),

  VOICE_SHARED_SECRET: Joi.string().default('change-me-for-ws'),
  TURN_URLS: Joi.string().allow('').default(''),
  TURN_USERNAME: Joi.string().allow('').default(''),
  TURN_PASSWORD: Joi.string().allow('').default(''),
  OFFLINE_MODE: Joi.boolean().default(false),
});
