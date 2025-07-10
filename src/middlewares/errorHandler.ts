import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/responseModel";
import { ErrorCodes } from "../utils/errorCodes";
import logger from "../utils/logger";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || ErrorCodes.SERVER_ERROR.message;
  const errorResponse = new ApiResponse("error", message, undefined, err.code);

  res.status(statusCode).json(errorResponse);
};
