import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { config } from '../config/config';

export class HealthController {

  public checkHealth = (req: Request, res: Response): void => {
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

      res.status(200).json(healthStatus);
    } catch (error) {
      logger.error({ msg: 'Health check failed', error: error instanceof Error ? error.message : error });

      res.status(500).json({
        status: 'ERROR',
        timestamp: new Date().toISOString(),
        message: 'Health check failed'
      });
    }
  };
}