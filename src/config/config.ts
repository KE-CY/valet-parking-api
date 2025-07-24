import dotenv from 'dotenv';
import { AppConfig } from './interfaces';
import { defaultConfig } from './defaults';
import { ConfigValidator } from './validation';

// Load environment variables
dotenv.config();

/**
 * Parse integer from environment variable with fallback
 */
const parseIntWithFallback = (value: string | undefined, fallback: number): number => {
  if (!value) return fallback;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? fallback : parsed;
};

/**
 * Get boolean value from environment variable
 */
const getBooleanValue = (value: string | undefined, fallback: boolean): boolean => {
  if (!value) return fallback;
  return value.toLowerCase() === 'true';
};

/**
 * Get database type with validation
 */
const getDatabaseType = (value: string | undefined): 'postgres' | 'mysql' | 'mariadb' => {
  const validTypes = ['postgres', 'mysql', 'mariadb'];
  if (!value || !validTypes.includes(value)) {
    return defaultConfig.database.type;
  }
  return value as 'postgres' | 'mysql' | 'mariadb';
};

// Build configuration object with environment variables and fallbacks
export const config: AppConfig = {
  nodeEnv: process.env.NODE_ENV || defaultConfig.nodeEnv,
  environment: process.env.ENVIRONMENT || defaultConfig.environment,
  port: parseIntWithFallback(process.env.PORT, defaultConfig.port),
  
  database: {
    type: getDatabaseType(process.env.DB_TYPE),
    host: process.env.DB_HOST || defaultConfig.database.host,
    port: parseIntWithFallback(process.env.DB_PORT, defaultConfig.database.port),
    username: process.env.DB_USERNAME || defaultConfig.database.username,
    password: process.env.DB_PASSWORD || defaultConfig.database.password,
    database: process.env.DB_NAME || defaultConfig.database.database,
    synchronize: getBooleanValue(process.env.DB_SYNCHRONIZE, 
      process.env.ENVIRONMENT !== 'production'),
    logging: getBooleanValue(process.env.DB_LOGGING, 
      process.env.NODE_ENV === 'development'),
  },

  jwt: {
    secret: process.env.JWT_SECRET || defaultConfig.jwt.secret,
    refreshSecret: process.env.JWT_REFRESH_SECRET || defaultConfig.jwt.refreshSecret,
    accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY || defaultConfig.jwt.accessTokenExpiry,
    refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY || defaultConfig.jwt.refreshTokenExpiry,
  },

  session: {
    secret: process.env.SESSION_SECRET || defaultConfig.session.secret,
  },

  minio: {
    endpoint: process.env.MINIO_ENDPOINT || defaultConfig.minio.endpoint,
    rootUser: process.env.MINIO_ROOT_USER || defaultConfig.minio.rootUser,
    rootPassword: process.env.MINIO_ROOT_PASSWORD || defaultConfig.minio.rootPassword,
  },

  upload: {
    uploadDir: process.env.UPLOAD_DIR || defaultConfig.upload.uploadDir,
    maxFileSize: parseIntWithFallback(process.env.MAX_FILE_SIZE, defaultConfig.upload.maxFileSize),
  },
};

// Validate configuration
ConfigValidator.validateConfig(config);

// Log configuration status
ConfigValidator.logConfigStatus(config);