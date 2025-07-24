import { PutObjectCommand, HeadBucketCommand, CreateBucketCommand } from '@aws-sdk/client-s3';
import { minioClient } from '../config/minioClient';
import logger from '../utils/logger';
import { FileService } from './internal/fileService';
import { checkAllSettled } from '../utils/checkAllSettled';
import { v4 as uuidv4 } from 'uuid';

interface UploadFileParams {
  bucketName: string;
  fileName: string;
  fileContent: Buffer;
  contentType: string;
}

export const initBucket = async () => {
  const bucketNames = FileService.getFilesAllType;
  const promises = [];
  for (const bucketName of bucketNames) {
    promises.push(ensureBucketExists(bucketName));
  }

  const rAllSettledRet = await Promise.allSettled(promises);
  const rHasError = checkAllSettled(rAllSettledRet);

  if (rHasError) {
    logger.error({ msg: 'initBucket failed' });
    throw new Error('initBucket failed');
  }
};

export const ensureBucketExists = async (bucketName: string) => {
  try {
    await minioClient.send(new HeadBucketCommand({ Bucket: bucketName }));
    logger.info(`Bucket ${bucketName} exists`);
  } catch (error: any) {
    if (error.name === "NotFound" || error.name === "NoSuchBucket") {
      logger.info({ msg: `Bucket ${bucketName} does not exist, creating...` });
      try {
        await minioClient.send(new CreateBucketCommand({ Bucket: bucketName }));
        logger.info({ msg: `Bucket ${bucketName} created successfully` });
      } catch (createError) {
        logger.error({ msg: `Failed to create bucket ${bucketName}`, createError });
      }
    } else {
      logger.error({ msg: `Failed to check bucket ${bucketName}`, error });
    }
  }
}

export const uploadFileOne = async ({
  bucketName,
  fileName,
  fileContent,
  contentType,
}: UploadFileParams): Promise<string> => {
  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: fileContent,
    ContentType: contentType,
  };

  const size = Buffer.byteLength(fileContent);

  // 如果上傳事 0 size 的檔案，則不進行上傳
  if (size === 0) {
    logger.warn({ msg: 'Attempted to upload an empty file, skipping upload' });
    return '';
  }

  try {
    const command = new PutObjectCommand(params);
    await minioClient.send(command);

    const fileUrl = `${process.env.MINIO_ENDPOINT}/${bucketName}/${fileName}`;
    return fileUrl;
  } catch (error) {
    logger.error({ msg: 'File upload failed', error });
    throw new Error('File upload failed');
  }
};

export const uploadFilesToMinio = async (
  files: {
    [fieldName: string]: Express.Multer.File[];
  },
  bucketName: string
) => {
  logger.debug({ msg: 'In uploadFilesToMinio' });
  const uploadPromises: Promise<{ fieldName: string; url: string }>[] = [];

  for (const fieldName in files) {
    const fileArray = files[fieldName];
    for (const file of fileArray) {
      const uploadBody = {
        bucketName,
        fileName: `${uuidv4()}_${file.originalname}`,
        fileContent: file.buffer,
        contentType: file.mimetype,
      };

      uploadPromises.push(
        uploadFileOne(uploadBody).then((resUrl) => ({
          fileOriginalName: file.originalname,
          fieldName,
          url: resUrl,
        }))
      );
    }
  }

  const uploadedUrls = await Promise.all(uploadPromises);

  return { files: uploadedUrls };
};
