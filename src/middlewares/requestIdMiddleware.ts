import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

/**
 * 請求 ID 中間件
 * 為每個請求生成唯一的 ID，用於追蹤和日誌記錄
 */
export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const requestId = req.headers['x-request-id'] as string || uuidv4();

  res.locals.requestId = requestId;

  res.setHeader('X-Request-ID', requestId);

  next();
};