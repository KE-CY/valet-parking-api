import express from 'express';
import { registerValidation } from '../middlewares/userMiddleware';
import { register } from '../controllers/userController';

const router = express.Router();

router.post('/register', registerValidation, register);

export default router;
