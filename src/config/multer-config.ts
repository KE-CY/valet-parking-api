import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { config } from './config';
import logger from '../utils/logger';

// Ensure upload directory exists
const uploadDir = path.isAbsolute(config.upload.uploadDir)
  ? config.upload.uploadDir
  : path.join(process.cwd(), config.upload.uploadDir);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  logger.debug({ msg: `Created upload directory: ${uploadDir}` });
}

// Memory storage for temporary uploads
const memoryStorage = multer.memoryStorage();

// Disk storage configuration
const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    cb(null, `${basename}-${uniqueSuffix}${ext}`);
  }
});

// Multer configurations
export const uploadMemory = multer({
  storage: memoryStorage,
  limits: {
    fileSize: config.upload.maxFileSize,
  }
});

export const uploadDisk = multer({
  storage: diskStorage,
  limits: {
    fileSize: config.upload.maxFileSize,
  }
});

// Legacy support for existing code
export const upload = uploadMemory;
export const upload_disk = multer({
  dest: path.join(uploadDir, 'temp'),
  limits: {
    fileSize: config.upload.maxFileSize,
    fieldSize: config.upload.maxFileSize,
  },
});
export const uploadDiskStorage = uploadDisk;
