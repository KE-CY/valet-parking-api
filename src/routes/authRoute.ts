import express from 'express';
import passport from 'passport';
import { login, refreshToken } from '../controllers/authController';
import { refreshTokenValidation } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/login', passport.authenticate('local', { session: false }), login);
router.post('/refresh-token', refreshTokenValidation, refreshToken);


export default router;
