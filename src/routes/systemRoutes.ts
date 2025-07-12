import express from 'express';
import { getSystemStaticOptions } from '../controllers/systemController';
import { authenticateJWT } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/static_options', authenticateJWT, getSystemStaticOptions);

export default router;
