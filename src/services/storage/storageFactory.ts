import { S3Client } from '@aws-sdk/client-s3';
import { MinioConfig } from '../../config/interfaces';
import { MinioStorage } from '../../implementations/storage/minio/minioStorage';
import { MinioBucketManager } from '../../implementations/storage/minio/minioBucketManager';
import { IFileStorage } from '../../interfaces/storage/fileStorage';
import logger from '../../utils/logger';

export class StorageFactory {
  static createMinioStorage(config: MinioConfig): IFileStorage {

    const endpointUrl = new URL(config.endpoint.startsWith('http') ? config.endpoint : `http://${config.endpoint}`);


    const s3Client = new S3Client({
      endpoint: endpointUrl.href,
      region: 'us-east-1',
      credentials: {
        accessKeyId: config.rootUser,
        secretAccessKey: config.rootPassword
      },
      forcePathStyle: true,
    });


    const bucketManager = new MinioBucketManager(s3Client);

    const minioStorage = new MinioStorage(s3Client, bucketManager, config);

    logger.info({
      msg: 'MinIO Storage initialized with AWS SDK',
      endpoint: config.endpoint,
      defaultBucket: config.defaultBucket,
      region: 'us-east-1'
    });

    return minioStorage;
  }
}