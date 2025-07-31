export interface IFileStorage {
  uploadOne(file: Express.Multer.File, options?: IFileUploadOptions): Promise<IFileUploadResult>;
  ensureBucketExists(bucketName: string): Promise<void>;
  initBuckets(bucketNames: string[]): Promise<void>;
}

export interface IFileUploadOptions {
  bucket?: string;
  folder?: string;
  fileName?: string;
  metadata?: Record<string, string>;
  generateUniqueFileName?: boolean;
}

export interface IFileUploadResult {
  success: boolean;
  fileKey: string;
  url: string;
  originalName: string;
  size: number;
  mimetype: string;
  metadata?: Record<string, any>;
}
