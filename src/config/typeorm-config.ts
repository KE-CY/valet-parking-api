import path from 'path';
import { DataSource } from 'typeorm';
import { config } from './config';

const isProduction = config.environment === 'production';

export const AppDataSource = new DataSource({
  type: config.database.type,
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,
  entities: [
    isProduction
      ? path.join(__dirname, '../entities/*.js')
      : path.join(__dirname, '../entities/*.ts'),
  ],
  synchronize: config.database.synchronize,
  logging: config.database.logging,
});