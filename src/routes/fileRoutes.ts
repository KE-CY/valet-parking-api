import express from 'express';
import { authenticateJWT } from '../middlewares/authMiddleware';
import { filesValidation } from '../validations/fileValidation';
import { uploadFiles } from '../controllers/fileController';

const router = express.Router();

router.post('/', authenticateJWT, filesValidation, uploadFiles);

export default router;