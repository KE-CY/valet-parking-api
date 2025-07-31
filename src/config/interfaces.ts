export interface DatabaseConfig {
  type: 'postgres' | 'mysql' | 'mariadb';
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
  logging: boolean;
}

export interface JwtConfig {
  secret: string;
  refreshSecret: string;
  accessTokenExpiry: string;
  refreshTokenExpiry: string;
}

export interface SessionConfig {
  secret: string;
}

export interface MinioConfig {
  endpoint: string;
  rootUser: string;
  rootPassword: string;
  defaultBucket?: string;
}

export interface UploadConfig {
  uploadDir: string;
  maxFileSize: number;
}

export interface LoggerConfig {
  level: string
}

export interface AppConfig {
  nodeEnv: string;
  environment: string;
  port: number;
  database: DatabaseConfig;
  jwt: JwtConfig;
  session: SessionConfig;
  minio: MinioConfig;
  upload: UploadConfig;
  logger: LoggerConfig;
}