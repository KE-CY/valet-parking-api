import { ErrorCodes } from './errorCodes';

export class CustomError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
  }
}

export class ValidationError extends CustomError {
  constructor(message: string = 'Validation Error') {
    super(message, 400);
  }
}

export class SystemError extends CustomError {
  constructor(message: string = 'System Error') {
    super(message, 500);
  }
}