/**
 * 基礎自定義錯誤類別
 */
export abstract class BaseError extends Error {
  public abstract statusCode: number;
  public abstract errorCode: string;
  public abstract isOperational: boolean;

  constructor(message: string, public details?: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 驗證錯誤
 */
export class ValidationError extends BaseError {
  public statusCode = 422;
  public errorCode = 'VALIDATION_ERROR';
  public isOperational = true;

  constructor(
    message: string = 'Validation failed',
    public validationErrors: Array<{ field: string; message: string; value?: any }> = [],
    details?: string
  ) {
    super(message, details);
  }
}

/**
 * 資源未找到錯誤
 */
export class NotFoundError extends BaseError {
  public statusCode = 404;
  public errorCode = 'NOT_FOUND';
  public isOperational = true;

  constructor(message: string = 'Resource not found', details?: string) {
    super(message, details);
  }
}

/**
 * 未授權錯誤
 */
export class UnauthorizedError extends BaseError {
  public statusCode = 401;
  public errorCode = 'UNAUTHORIZED';
  public isOperational = true;

  constructor(message: string = 'Unauthorized access', details?: string) {
    super(message, details);
  }
}

/**
 * 禁止訪問錯誤
 */
export class ForbiddenError extends BaseError {
  public statusCode = 403;
  public errorCode = 'FORBIDDEN';
  public isOperational = true;

  constructor(message: string = 'Forbidden access', details?: string) {
    super(message, details);
  }
}

/**
 * 業務邏輯錯誤
 */
export class BusinessError extends BaseError {
  public statusCode = 400;
  public errorCode = 'BUSINESS_ERROR';
  public isOperational = true;

  constructor(message: string, errorCode?: string, details?: string) {
    super(message, details);
    if (errorCode) {
      this.errorCode = errorCode;
    }
  }
}

/**
 * 伺服器內部錯誤
 */
export class InternalServerError extends BaseError {
  public statusCode = 500;
  public errorCode = 'INTERNAL_SERVER_ERROR';
  public isOperational = false;

  constructor(message: string = 'Internal server error', details?: string) {
    super(message, details);
  }
}

/**
 * 資料庫錯誤
 */
export class DatabaseError extends BaseError {
  public statusCode = 500;
  public errorCode = 'DATABASE_ERROR';
  public isOperational = false;

  constructor(message: string = 'Database error occurred', details?: string) {
    super(message, details);
  }
}