import { NextFunction, Request, Response } from 'express';
import { ApiResponse } from '../utils/responseModel';
import { SystemService } from '../services/internal/systemService';

export const getSystemStaticOptions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const staticOptions = await SystemService.getStaticOptions();
  return res.status(200).json(new ApiResponse('success', 'OK', staticOptions));
}