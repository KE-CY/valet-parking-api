import { NextFunction, Request, Response } from 'express';
import { FileService } from '../services/internal/fileService';
import logger from '../utils/logger';
import { ApiResponse } from '../utils/responseModel';

export const uploadFiles = async (req: Request, res: Response, next: NextFunction) => {
  const files = req.files as { [fieldName: string]: Express.Multer.File[] };
  logger.debug('In upload files controller.');

  try {
    const result = await FileService.uploadFiles(files, 'valet-parking');

    return res.status(200).json(
      new ApiResponse('success', 'OK', result)
    );
  } catch (error) {
    logger.error('Error upload files', error);
    next(error);
  }
}