export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  code?: string;
  field?: string;

  constructor(
    message: string, 
    statusCode: number, 
    code?: string,
    field?: string
  ) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.code = code;
    this.field = field;

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, code?: string, field?: string): AppError {
    return new AppError(message, 400, code || 'BAD_REQUEST', field);
  }

  static unauthorized(message: string = 'Unauthorized access'): AppError {
    return new AppError(message, 401, 'UNAUTHORIZED');
  }

  static forbidden(message: string = 'Access forbidden'): AppError {
    return new AppError(message, 403, 'FORBIDDEN');
  }

  static notFound(resource: string = 'Resource'): AppError {
    return new AppError(`${resource} not found`, 404, 'NOT_FOUND');
  }

  static conflict(message: string, field?: string): AppError {
    return new AppError(message, 409, 'CONFLICT', field);
  }

  static validation(message: string, field?: string): AppError {
    return new AppError(message, 422, 'VALIDATION_ERROR', field);
  }
}