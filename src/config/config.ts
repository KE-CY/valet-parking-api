import dotenv from 'dotenv';

// Load environment variables
// NODE_ENV=production load from docker-compose.yml environment
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: process.env.ENVIRONMENT === 'production' ? '.env.production' : '.env' });
}