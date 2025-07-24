import { AppConfig } from './interfaces';

export const defaultConfig: AppConfig = {
  nodeEnv: 'development',
  environment: 'development',
  port: 3000,
  database: {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'password',
    database: 'database',
    synchronize: true,
    logging: false,
  },
  jwt: {
    secret: 'jwt-key',
    refreshSecret: 'jwt-key',
    accessTokenExpiry: '1h',
    refreshTokenExpiry: '7d',
  },
  session: {
    secret: 'secret-session-key',
  },
  minio: {
    endpoint: 'http://localhost:9000',
    rootUser: 'minioadmin',
    rootPassword: 'minioadmin',
  },
  upload: {
    uploadDir: 'uploads',
    maxFileSize: 10 * 1024 * 1024 * 1024, // 10GB
  },
};