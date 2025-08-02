import { FileResponse, UploadFilesResponse } from "../interfaces/responses/fileResponse";
import { IFileService } from "../interfaces/services/fileServiceInterface";
import { IFileUploadOptions, IFileStorage, } from "../interfaces/storage/fileStorage";
import { InternalServerError } from "../utils/customErrors";
import logger from "../utils/logger";
import { config } from "../config/config";

export class FileService implements IFileService {
  constructor(
    private fileStorage: IFileStorage,
    private defaultBucket: string
  ) { }

  async uploadFiles(files: Express.Multer.File[], type: string, requestId: string): Promise<UploadFilesResponse> {
    try {
      logger.debug({
        msg: 'FileService: Start upload files',
        requestId,
        fileCount: files.length,
        type,
        totalSize: files.reduce((sum, file) => sum + file.size, 0)
      });

      // 驗證檔案
      if (!files || files.length === 0) {
        throw new Error('No files provided for upload');
      }

      // 驗證記憶體中的檔案
      this.validateMemoryFiles(files);

      // 根據類型決定存儲選項
      const uploadOptions = this.getUploadOptionsByType(type, requestId);

      // 確保 bucket 存在
      await this.fileStorage.ensureBucketExists(uploadOptions.bucket!);

      // 並行上傳所有檔案（從記憶體直接上傳）
      const uploadPromises = files.map(async (file, index) => {
        const fileOptions: IFileUploadOptions = {
          ...uploadOptions,
          // 為每個檔案添加索引和請求 ID 到 metadata
          metadata: {
            ...uploadOptions.metadata,
            'file-index': index.toString(),
            'memory-upload': 'true',
            'buffer-size': file.buffer.length.toString()
          }
        };

        logger.debug({
          msg: 'FileService: Uploading file from memory',
          requestId,
          fileName: file.originalname,
          size: file.size,
          mimetype: file.mimetype,
          bufferSize: file.buffer.length,
          fieldName: file.fieldname
        });

        const result = await this.fileStorage.uploadOne(file, fileOptions);

        if (!result.success) {
          throw new Error(`Failed to upload file: ${file.originalname}. ${result.metadata?.error || 'Unknown error'}`);
        }

        logger.debug({
          msg: 'FileService: File uploaded successfully from memory',
          requestId,
          fileName: file.originalname,
          fileKey: result.fileKey,
          url: result.url
        });

        return result;
      });

      const uploadResults = await Promise.all(uploadPromises);

      const fileResponses: FileResponse[] = uploadResults.map((result, index) => ({
        url: result.url,
        fieldName: files[index].fieldname || 'files',
        originalName: result.originalName
      }));

      const response: UploadFilesResponse = {
        files: fileResponses
      };

      const totalSize = uploadResults.reduce((sum, result) => sum + result.size, 0);

      logger.info({
        msg: 'FileService: Memory upload completed successfully',
        requestId,
        totalFiles: files.length,
        successCount: uploadResults.length,
        totalSize,
        type,
        bucketUsed: uploadOptions.bucket,
        memoryToStorage: true
      });

      return response;

    } catch (error) {
      logger.error({
        msg: 'FileService: Memory upload failed',
        requestId,
        error: error instanceof Error ? error.message : error,
        type,
        fileCount: files?.length || 0,
        totalSize: files?.reduce((sum, file) => sum + file.size, 0) || 0
      });

      throw new InternalServerError(
        'Upload files failed.',
        error instanceof Error ? error.message : 'Unknown error during upload files failed'
      );
    }
  }

  private getUploadOptionsByType(type: string, requestId: string): IFileUploadOptions {
    const baseOptions: IFileUploadOptions = {
      bucket: this.defaultBucket,
      generateUniqueFileName: true,
      metadata: {
        'upload-type': type,
        'request-id': requestId,
        'upload-timestamp': new Date().toISOString(),
        'storage-type': 'memory-to-minio'
      }
    };
    return baseOptions;
  }

  private validateMemoryFiles(files: Express.Multer.File[]): void {
    for (const file of files) {
      // 檢查是否有 buffer（memory storage 的特徵）
      if (!file.buffer) {
        throw new Error(`File ${file.originalname} missing buffer - ensure using multer.memoryStorage()`);
      }

      // 檢查 buffer 大小與檔案大小是否一致
      if (file.buffer.length !== file.size) {
        logger.warn(`File size mismatch for ${file.originalname}: buffer=${file.buffer.length}, size=${file.size}`);
      }

      // 檢查檔案是否為空
      if (file.size === 0 || file.buffer.length === 0) {
        throw new Error(`File ${file.originalname} is empty`);
      }

      logger.debug({
        msg: 'Memory file validation passed',
        fileName: file.originalname,
        size: file.size,
        bufferLength: file.buffer.length,
        mimetype: file.mimetype,
        fieldname: file.fieldname
      });
    }
  }

  async initializeStorage(): Promise<void> {
    try {
      const buckets = [
        this.defaultBucket,
      ];

      await this.fileStorage.initBuckets(buckets);
      logger.info({ msg: 'FileService: Storage initialization completed for memory upload', buckets });
    } catch (error) {
      logger.error({ msg: 'FileService: Storage initialization failed', error });
      throw new InternalServerError('Failed to initialize storage for memory upload');
    }
  }

}

export class FileServiceFactory {
  static async create(
    fileStorage: IFileStorage,
    defaultBucket: string = config.minio.defaultBucket as string
  ): Promise<IFileService> {
    const fileService = new FileService(fileStorage, defaultBucket);

    // 初始化存儲
    await fileService.initializeStorage();

    return fileService;
  }
}