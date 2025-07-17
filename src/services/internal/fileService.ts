import logger from "../../utils/logger";
import { uploadFilesToMinio } from "../minioService";

export class FileService {
  static get getFilesAllType() {
    return [
      'valet-parking',
    ];
  }

  static async uploadFiles(
    files: {
      [fieldName: string]: Express.Multer.File[];
    },
    type: string
  ) {
    logger.debug({ msg: 'In FileService.uploadFiles' });

    const uploadedFiles = await uploadFilesToMinio(files, type);

    return uploadedFiles;
  }
}