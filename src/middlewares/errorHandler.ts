import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';
import { ResponseBuilder } from '../utils/apiResponse';
import { config } from '../config/config';
import logger from "../utils/logger";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let err = error as AppError;

  // Log error in development
  if (config.nodeEnv === 'development') {
    logger.error({ msg: ' Error:', error });
  }

  // Handle specific error types
  if (error.name === 'CastError') {
    err = AppError.badRequest('Invalid ID format', 'INVALID_ID');
  } else if (error.message?.includes('E11000') || error.message?.includes('duplicate key')) {
    const field = extractDuplicateField(error.message);
    err = AppError.conflict(`Duplicate value for ${field}`, field);
  } else if (error.name === 'ValidationError') {
    err = AppError.validation('Validation failed');
  } else if (error.name === 'JsonWebTokenError') {
    err = AppError.unauthorized('Invalid token');
  } else if (error.name === 'TokenExpiredError') {
    err = AppError.unauthorized('Token expired');
  } else if (!(err instanceof AppError)) {
    // If it's not an AppError, create a generic server error
    err = new AppError(
      config.nodeEnv === 'development' ? error.message : 'Internal server error',
      500,
      'INTERNAL_ERROR'
    );
  }

  const response = ResponseBuilder.error(
    err.message,
    err.code || 'INTERNAL_ERROR',
    config.nodeEnv === 'development' ? error.stack : undefined,
    err.field
  );

  res.status(err.statusCode || 500).json(response);
};

// Helper function to extract field name from duplicate key error
function extractDuplicateField(errorMessage: string): string {
  const match = errorMessage.match(/index: (\w+)/);
  return match ? match[1] : 'field';
}