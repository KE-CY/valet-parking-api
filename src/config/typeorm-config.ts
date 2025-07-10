import path from 'path';
import { DataSource } from 'typeorm';
import './config';

const isProduction = process.env.ENVIRONMENT === 'production';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [
    isProduction
      ? path.join(__dirname, '../entities/*.js')
      : path.join(__dirname, '../entities/*.ts'),
  ],
  synchronize: !isProduction, // Disable synchronize in production
  // logging: !isProduction,  // Optional: Disable logging in production
});
