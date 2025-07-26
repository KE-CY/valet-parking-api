import { Application } from 'express';
import logger from '../utils/logger';

import HealthRoutes from './healthRoutes';
import AuthRoutes from './authRoutes';
import UserRoutes from './userRoutes';

interface RouteConfig {
  name: string;
  instance: any;
  mountPath?: string;
}

export class RouteManager {
  private routes: RouteConfig[] = [];

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.routes = [
      { name: 'HealthRoutes', instance: new HealthRoutes(), mountPath: '/' },
      { name: 'AuthRoutes', instance: new AuthRoutes(), mountPath: '/' },
      { name: 'UserRoutes', instance: new UserRoutes(), mountPath: '/' }
    ];

    logger.info({
      msg: 'Routes initialized', totalRoutes: this.routes.length, routeNames: this.routes.map(r => r.name)
    });
  }

  public registerRoutes(app: Application): void {
    this.routes.forEach(routeConfig => {
      try {
        const mountPath = routeConfig.mountPath || '/';
        app.use(mountPath, routeConfig.instance.getRouter());

        logger.info({
          msg: 'Route registered successfully',
          routeName: routeConfig.name,
          mountPath: mountPath,
          prefix: routeConfig.instance.getPrefix ? routeConfig.instance.getPrefix() : 'none'
        });
      } catch (error) {
        logger.error({
          msg: 'Failed to register route',
          routeName: routeConfig.name,
          error: error instanceof Error ? error.message : error
        });
      }
    });
  }

  public getRouteInfo(): Array<{ name: string, prefix: string, mountPath: string }> {
    return this.routes.map(route => ({
      name: route.name,
      prefix: route.instance.getPrefix ? route.instance.getPrefix() : '',
      mountPath: route.mountPath || '/'
    }));
  }
}

export default new RouteManager();