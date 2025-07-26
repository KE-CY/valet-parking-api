import { S3Client } from '@aws-sdk/client-s3';
import { config } from './config';

class MinioClientConfig {
  private static instance: S3Client;

  static getInstance(): S3Client {
    if (!MinioClientConfig.instance) {
      MinioClientConfig.instance = new S3Client({
        endpoint: config.minio.endpoint,
        region: 'us-east-1',
        credentials: {
          accessKeyId: config.minio.rootUser,
          secretAccessKey: config.minio.rootPassword,
        },
        forcePathStyle: true,
      });
    }
    return MinioClientConfig.instance;
  }
}

export const minioClient = MinioClientConfig.getInstance();