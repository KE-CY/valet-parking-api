import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger';
import { config } from '../config/config';
import { ResponseUtil } from '../utils/responseUtil';
import { InternalServerError } from '../utils/customErrors';

export class HealthController {

  public checkHealth = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const healthStatus = {
        status: 'OK',
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0',
        environment: config.nodeEnv || 'development'
      };

      logger.info({
        msg: 'Health check requested',
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });
      ResponseUtil.success(res, healthStatus, 'Health check completed successfully');
    } catch (error) {
      logger.error({ msg: 'Health check failed', error: error instanceof Error ? error.message : error });

      const healthError = error instanceof Error ? error : new InternalServerError(
        'Health check failed',
        error instanceof Error ? error.message : 'Unknown error occurred during health check'
      );

      next(healthError);
    }
  };
}