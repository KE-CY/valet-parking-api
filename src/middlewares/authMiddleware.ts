import { NextFunction, Request, Response } from 'express';
import logger from '../utils/logger';
import { UnauthorizedError } from '../utils/customErrors';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { UserRepository } from '../repositories/userRepository';

declare global {
  namespace Express {
    interface User {
      id: number;
      name: string;
      username: string;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
    }
  }
}

export const requireJWTAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const requestId = res.locals.requestId;
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn({
        msg: 'AuthMiddleware: No JWT token provided',
        requestId,
        path: req.path
      });
      return next(new UnauthorizedError('Authentication token required'));
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const JWT_SECRET = config.jwt.secret;

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;

      // 驗證用戶是否仍然存在且活躍
      const userRepository = UserRepository.getInstance();
      const user = await userRepository.findById(decoded.id);

      if (!user || !user.isActive) {
        logger.warn({
          msg: 'AuthMiddleware: User not found or inactive',
          userId: decoded.id,
          requestId
        });
        return next(new UnauthorizedError('Invalid authentication token'));
      }

      // 將用戶資訊添加到 request 對象
      req.user = user.toResponse() as Express.User;

      logger.debug({
        msg: 'AuthMiddleware: JWT authentication successful',
        userId: user.id,
        requestId
      });

      next();
    } catch (jwtError) {
      logger.warn({
        msg: 'AuthMiddleware: Invalid JWT token',
        error: jwtError instanceof Error ? jwtError.message : jwtError,
        requestId
      });
      next(new UnauthorizedError('Invalid or expired authentication token'));
    }
  } catch (error) {
    logger.error({
      msg: 'AuthMiddleware: JWT authentication error',
      error: error instanceof Error ? error.message : error,
      requestId
    });
    next(new UnauthorizedError('Authentication failed'));
  }
}