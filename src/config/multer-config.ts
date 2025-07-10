import fs from 'fs';
import multer from 'npm ';
import path from 'path';

const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });

export const upload_disk = multer({
  dest: 'dist/uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024 * 1024,
    fieldSize: 10 * 1024 * 1024 * 1024,
  },
});


const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

export const uploadDiskStorage = multer({ storage: diskStorage });
