// import express from 'express';
import bodyParser from 'body-parser';
// import { AppDataSource } from './config/typeorm-config';
import session from 'express-session';
// import './config/passport';

import express from "express";
import routeManager from './routes/index';
import logger from './utils/logger';
import { config } from './config/config';

// const app = express();

// // Initialize TypeORM
// AppDataSource.initialize()
//   .then(() => {
//     // logger.info({ msg: 'TypeORM: Data Source has been initialized!' });
//   })
//   .catch((err) => {
//     // logger.error({ msg: `TypeORM: Error during Data Source initialization: ${err.message}`, stack: err.stack });
//   });

// // Middleware
// app.use(bodyParser.urlencoded({ extended: true, limit: '1tb' }));
// app.use(bodyParser.json({ limit: '1tb' }));
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET!,
//     resave: false,
//     saveUninitialized: true,
//   })
// );

// // Routes

// // Error handling middleware

// export default app;

export class App {
  private app: express.Application;

  constructor() {
    this.app = express();

    this.initializeMiddlewares();
    this.initializeRoutes();
    // this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    this.app.use(bodyParser.urlencoded({ extended: true, limit: '1tb' }));
    this.app.use(bodyParser.json({ limit: '1tb' }));
    this.app.use(
      session({
        secret: process.env.SESSION_SECRET!,
        resave: false,
        saveUninitialized: true,
      })
    );
  }

  private initializeRoutes(): void {
    routeManager.registerRoutes(this.app);

    const routeInfo = routeManager.getRouteInfo();
    logger.info({ msg: 'All routes registered', routes: routeInfo });

    // 404 handler
    this.app.use(/(.*)/, async (req: express.Request, res: express.Response) => {
      res.status(404).json({
        status: 'NOT_FOUND',
        message: `Route ${req.originalUrl} not found`,
        timestamp: new Date().toISOString()
      });
    });
  }

  public start(): void {
    this.app.listen(config.port, () => {
      logger.info({
        msg: `Server started successfully`,
        port: config.port,
        environment: config.nodeEnv
      });
    });
  }

  public getApp(): express.Application {
    return this.app;
  }
}