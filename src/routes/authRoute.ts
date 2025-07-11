import express from 'express';
import passport from 'passport';
import { login } from '../controllers/authController';

const router = express.Router();

router.post('/login', passport.authenticate('local', { session: false }), login);

export default router;
