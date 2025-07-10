import express from 'express';
import bodyParser from 'body-parser';
import { AppDataSource } from './config/typeorm-config';

import healthRoutes from './routes/healthRoute';
import logger from './utils/logger';

const app = express();

app.use(bodyParser.urlencoded({ extended: true, limit: '1tb' }));
app.use(bodyParser.json({ limit: '1tb' }));

// Initialize TypeORM
AppDataSource.initialize()
  .then(() => {
    logger.info('TypeORM: Data Source has been initialized!');
  })
  .catch((err) => {
    logger.error(`TypeORM: Error during Data Source initialization: ${err.message}`, { stack: err.stack }); 
   });

// Routes
app.use('/health', healthRoutes);

export default app;