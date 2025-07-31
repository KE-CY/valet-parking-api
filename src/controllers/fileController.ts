import { NextFunction, Request, Response } from 'express';
import logger from '../utils/logger';
import { ResponseUtil } from '../utils/responseUtil';
import { InternalServerError } from '../utils/customErrors';
import { IFileService } from '../interfaces/services/fileServiceInterface';
import { FileService } from '../services/fileService';

export class FileController {
  constructor(private fileService: IFileService) { }

  uploadMultiple = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const uploadedFiles = files['file'];

    const requestId = res.locals.requestId;
    try {
      logger.debug({ msg: 'In upload files controller.', files: uploadedFiles.length });

      if (!uploadedFiles || uploadedFiles.length === 0) {
        ResponseUtil.error(res, 'No files provided', 400);
        return;
      }

      const result = await this.fileService.uploadFiles(uploadedFiles, 'image', requestId);

      ResponseUtil.success(res, result, 'Get static options successful', 200);

    } catch (error) {
      logger.error({ msg: 'Upload files error.', error: error instanceof Error ? error.message : error });

      const uploadFilesError = error instanceof Error ? error : new InternalServerError(
        'Upload Files Failed',
        error instanceof Error ? error.message : 'Unknown error occurred during upload files.'
      );

      next(uploadFilesError);
    }
  }
}