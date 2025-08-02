import { S3Client, PutObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3';
import { MinioConfig } from "../../../config/interfaces";
import { IBucketManager } from "../../../interfaces/storage/bucketManager";
import { IFileUploadResult, IFileStorage, IFileUploadOptions } from "../../../interfaces/storage/fileStorage";
import logger from "../../../utils/logger";
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { InternalServerError } from '../../../utils/customErrors';

export class MinioStorage implements IFileStorage {
  constructor(
    private s3Client: S3Client,
    private bucketManager: IBucketManager,
    private config: MinioConfig
  ) { }

  async ensureBucketExists(bucketName: string): Promise<void> {
    return this.bucketManager.ensureBucketExists(bucketName);
  }

  async initBuckets(bucketNames: string[]): Promise<void> {
    return this.bucketManager.initBuckets(bucketNames);
  }

  async uploadOne(file: Express.Multer.File, options?: IFileUploadOptions): Promise<IFileUploadResult> {
    try {
      const bucket = options?.bucket || this.config.defaultBucket!;
      const folder = options?.folder || 'uploads';

      await this.ensureBucketExists(bucket);

      let fileName: string;
      if (options?.fileName) {
        fileName = options.fileName;
      } else if (options?.generateUniqueFileName !== false) {
        // 預設生成唯一檔名
        const ext = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, ext);
        fileName = `${baseName}_${uuidv4()}${ext}`;
      } else {
        fileName = file.originalname;
      }

      // 構建完整的檔案路徑 (key)
      const fileKey = folder ? `${folder}/${fileName}` : fileName;

      // 準備上傳的 metadata
      const metadata = {
        'original-name': file.originalname,
        'upload-date': new Date().toISOString(),
        ...options?.metadata
      };

      // 準備 PutObject 參數
      const putObjectParams: PutObjectCommandInput = {
        Bucket: bucket,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
        ContentLength: file.size,
        Metadata: metadata
      };

      // 使用 AWS SDK 上傳檔案
      const command = new PutObjectCommand(putObjectParams);
      await this.s3Client.send(command);

      // 生成檔案 URL
      const endpointUrl = new URL(this.config.endpoint.startsWith('http') ? this.config.endpoint : `http://${this.config.endpoint}`);
      const url = `${endpointUrl.protocol}//${endpointUrl.host}/${bucket}/${fileKey}`;

      logger.info(`File uploaded successfully: ${fileKey} to bucket: ${bucket}`, {
        fileKey,
        bucket,
        size: file.size,
        mimetype: file.mimetype
      });

      return {
        success: true,
        fileKey,
        url,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
        metadata: {
          ...metadata,
          bucket
        }
      };

    } catch (error) {
      logger.error({
        msg: 'Failed to upload file:',
        error: error instanceof Error ? error.message : error,
        fileName: file.originalname,
        size: file.size
      });

      throw new InternalServerError(
        'MinioStorage upload error',
        error instanceof Error ? error.message : 'Unknown error upload'
      );
    }
  }
}