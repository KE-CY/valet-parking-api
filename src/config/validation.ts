import { AppConfig } from './interfaces';
import { defaultConfig } from './defaults';
import logger from '../utils/logger';

export class ConfigValidator {
  static validateConfig(config: AppConfig): void {
    const errors: string[] = [];

    // Validate production environment
    if (config.nodeEnv === 'production') {
      if (config.jwt.secret === defaultConfig.jwt.secret) {
        errors.push('JWT_SECRET must be set in production environment');
      }

      if (config.jwt.refreshSecret === defaultConfig.jwt.refreshSecret) {
        errors.push('JWT_REFRESH_SECRET must be set in production environment');
      }

      if (config.session.secret === defaultConfig.session.secret) {
        errors.push('SESSION_SECRET must be set in production environment');
      }

      if (config.database.password === defaultConfig.database.password) {
        errors.push('Database password should be changed in production environment');
      }

      if (config.minio.rootPassword === defaultConfig.minio.rootPassword) {
        errors.push('MinIO root password should be changed in production environment');
      }
    }

    // Validate port range
    if (config.port < 1 || config.port > 65535) {
      errors.push('Port must be between 1 and 65535');
    }

    // Validate database port
    if (config.database.port < 1 || config.database.port > 65535) {
      errors.push('Database port must be between 1 and 65535');
    }

    // Validate required fields
    if (!config.database.host) {
      errors.push('Database host is required');
    }

    if (!config.database.username) {
      errors.push('Database username is required');
    }

    if (!config.database.database) {
      errors.push('Database name is required');
    }

    if (!config.minio.endpoint) {
      errors.push('MinIO endpoint is required');
    }

    if (errors.length > 0) {
      logger.error({ msg: 'Configuration validation failed:', errors });
      throw new Error('Invalid configuration. Please check your environment variables.');
    }

    // Show warnings for development
    if (config.nodeEnv === 'development') {
      const warnings: string[] = [];

      if (config.jwt.secret === defaultConfig.jwt.secret) {
        warnings.push('Using default JWT secret (OK for development)');
      }

      if (warnings.length > 0) {
        logger.warn({ msg: 'Development warnings:', warnings });
      }
    }
  }

  static logConfigStatus(config: AppConfig): void {
    logger.debug({ msg: `Configuration loaded successfully` });
    logger.debug({ msg: `Environment: ${config.nodeEnv}` });
    logger.debug({ msg: `Port: ${config.port}` });
    logger.debug({ msg: `Database: ${config.database.host}:${config.database.port}/${config.database.database}` });
    logger.debug({ msg: `MinIO: ${config.minio.endpoint}` });
    logger.debug({ msg: `JWT Access Token Expiry: ${config.jwt.accessTokenExpiry}` });
    logger.debug({ msg: `JWT Refresh Token Expiry: ${config.jwt.refreshTokenExpiry}` });
  }
}