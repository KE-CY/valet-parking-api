export interface IBucketManager {
  ensureBucketExists(bucketName: string): Promise<void>;
  initBuckets(bucketNames: string[]): Promise<void>;
  checkBucketExists(bucketName: string): Promise<boolean>;
  createBucket(bucketName: string): Promise<void>;
}
