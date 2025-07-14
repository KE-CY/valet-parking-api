import express from 'express';
import bodyParser from 'body-parser';
import { AppDataSource } from './config/typeorm-config';
import logger from './utils/logger';
import session from 'express-session';
import { errorHandler } from './middlewares/errorHandler';
import './config/passport';

import healthRoutes from './routes/healthRoute';
import userRoutes from './routes/userRoute';
import appRoutes from './routes/authRoute';
import systemRoutes from './routes/systemRoutes'
import fileRoutes from './routes/fileRoutes';

const app = express();

// Initialize TypeORM
AppDataSource.initialize()
  .then(() => {
    logger.info('TypeORM: Data Source has been initialized!');
  })
  .catch((err) => {
    logger.error(`TypeORM: Error during Data Source initialization: ${err.message}`, { stack: err.stack });
  });

// Middleware
app.use(bodyParser.urlencoded({ extended: true, limit: '1tb' }));
app.use(bodyParser.json({ limit: '1tb' }));
app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: true,
  })
);

// Routes
app.use('/health', healthRoutes);
app.use('/auth', appRoutes);
app.use('/users', userRoutes);
app.use('/systems', systemRoutes);
app.use('/files', fileRoutes);

// Error handling middleware
app.use(errorHandler);

export default app;