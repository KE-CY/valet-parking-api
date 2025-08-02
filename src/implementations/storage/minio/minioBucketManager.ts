import { CreateBucketCommand, HeadBucketCommand, S3Client } from "@aws-sdk/client-s3";
import { IBucketManager } from "../../../interfaces/storage/bucketManager";
import logger from "../../../utils/logger";

export class MinioBucketManager implements IBucketManager {
  constructor(private s3Client: S3Client) { }

  async ensureBucketExists(bucketName: string): Promise<void> {
    const exists = await this.checkBucketExists(bucketName);
    if (!exists) {
      await this.createBucket(bucketName);
    }
  }

  async initBuckets(bucketNames: string[]): Promise<void> {
    await Promise.all(
      bucketNames.map(bucketName => this.ensureBucketExists(bucketName))
    );
  }

  async checkBucketExists(bucketName: string): Promise<boolean> {
    try {
      logger.debug({ msg: ' MinioBucketManager.checkBucketExists', bucketName });
      await this.s3Client.send(new HeadBucketCommand({ Bucket: bucketName }));
      return true;
    } catch (error) {
      logger.error({ msg: 'MinioBucketManager.checkBucketExists error', error });
      return false;
    }
  }

  async createBucket(bucketName: string): Promise<void> {
    try {
      await this.s3Client.send(new CreateBucketCommand({ Bucket: bucketName }));
      logger.info({ msg: `Bucket created successfully: ${bucketName}` });
    } catch (error) {
      logger.error({ msg: `Failed to create bucket: ${bucketName}`, error });
      throw error;
    }
  }
}