import { Request, Response, NextFunction } from 'express'
import { User } from '../entities/User';
import { ApiResponse } from '../utils/responseModel';
import logger from '../utils/logger';
import { AuthService } from '../services/internal/authService';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, id } = req.user as User;
    const token = AuthService.generateToken({ id, username } as User);

    return res.json(new ApiResponse('success', 'OK', token));
  } catch (error) {
    logger.error({ msg: 'Error during login: ', error });
    next(error);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    const token = AuthService.refreshTokens(refreshToken);
    return res.json(new ApiResponse('success', 'OK', token));
  } catch (error) {
    logger.error({ msg: 'Error refresh token.', error });
    next(error);
  }
}