import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { ResponseUtil } from '../utils/responseUtil';
import { BaseError, ValidationError } from '../utils/customErrors';
import { config } from '../config/config';

/**
 * 全域錯誤處理中間件
 */
export const errorHandlerMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // 檢查是否已經發送回應
  if (res.headersSent) {
    return next(err);
  }

  const requestId = res.locals.requestId;

  // 記錄錯誤日誌
  logger.error({
    msg: 'Error occurred',
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    requestId,
    errorType: err.constructor.name
  });

  // 處理自定義錯誤
  if (err instanceof BaseError) {
    handleCustomError(err, res);
    return;
  }

  // 處理已知的原生錯誤
  if (err.name === 'SyntaxError' && 'body' in err) {
    ResponseUtil.error(
      res,
      'Invalid JSON format',
      400,
      {
        code: 'INVALID_JSON',
        details: 'Request body contains invalid JSON'
      }
    );
    return;
  }

  if (err.name === 'CastError') {
    ResponseUtil.error(
      res,
      'Invalid data format',
      400,
      {
        code: 'INVALID_DATA_FORMAT',
        details: 'The provided data format is invalid'
      }
    );
    return;
  }

  // 處理未知錯誤
  const isDevelopment = config.environment === 'development';
  ResponseUtil.error(
    res,
    isDevelopment ? err.message : 'An internal server error occurred',
    500,
    {
      code: 'INTERNAL_SERVER_ERROR',
      details: isDevelopment
        ? err.stack
        : 'Please contact support if this problem persists'
    }
  );
};

/**
 * 處理自定義錯誤
 */
function handleCustomError(err: BaseError, res: Response): void {
  const isDevelopment = config.environment === 'development';
  // 處理驗證錯誤
  if (err instanceof ValidationError) {
    ResponseUtil.validationError(
      res,
      err.validationErrors,
      err.message
    );
    return;
  }

  // 處理資源未找到錯誤
  if (err.constructor.name === 'NotFoundError') {
    ResponseUtil.notFound(res, err.message);
    return;
  }

  // 處理未授權錯誤
  if (err.constructor.name === 'UnauthorizedError') {
    ResponseUtil.unauthorized(res, err.message);
    return;
  }

  // 處理禁止訪問錯誤
  if (err.constructor.name === 'ForbiddenError') {
    ResponseUtil.forbidden(res, err.message);
    return;
  }

  // 處理業務邏輯錯誤
  if (err.constructor.name === 'BusinessError') {
    ResponseUtil.fail(
      res,
      err.message,
      err.details ? { details: err.details } : undefined,
      err.statusCode
    );
    return;
  }

  // 處理資料庫錯誤
  if (err.constructor.name === 'DatabaseError') {
    ResponseUtil.error(
      res,
      isDevelopment ? err.message : 'Database operation failed',
      err.statusCode,
      {
        code: err.errorCode,
        details: isDevelopment ? err.details : 'Please try again later'
      }
    );
    return;
  }

  // 處理內部伺服器錯誤
  if (err.constructor.name === 'InternalServerError') {
    ResponseUtil.error(
      res,
      isDevelopment ? err.message : 'An internal server error occurred',
      err.statusCode,
      {
        code: err.errorCode,
        details: isDevelopment ? err.details : 'Please contact support if this problem persists'
      }
    );
    return;
  }

  // 處理其他自定義錯誤（fallback）
  ResponseUtil.error(
    res,
    err.message,
    err.statusCode,
    {
      code: err.errorCode,
      details: err.details
    }
  );
}

/**
 * 捕獲非同步錯誤的包裝器
 */
export const asyncWrapper = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};