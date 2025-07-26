
import { NextFunction, Request, Response } from 'express';
import { LoginDto, RefreshTokenDto } from '../interfaces/dto/authDto';
import logger from '../utils/logger';
import passport from 'passport';
import { InternalServerError, UnauthorizedError } from '../utils/customErrors';
import { ResponseUtil } from '../utils/responseUtil';
import { AuthService } from '../services/authService';
import { IAuthService } from '../interfaces/services/authServiceInterface';

export class AuthController {
  constructor(private authService: IAuthService = new AuthService()) { }

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const loginData: LoginDto = req.body;
      const requestId = res.locals.requestId;

      logger.info({
        msg: 'AuthController: Login request received',
        username: loginData.username,
        requestId
      });

      // 使用 Passport Local Strategy 進行認證
      passport.authenticate('local', { session: false }, async (err: any, user: any, info: any) => {
        try {
          if (err) {
            logger.error({
              msg: 'AuthController: Passport authentication error',
              error: err.message,
              requestId
            });
            return next(err);
          }

          if (!user) {
            logger.warn({
              msg: 'AuthController: Authentication failed',
              username: loginData.username,
              reason: info?.message || 'Unknown reason',
              requestId
            });

            return next(new UnauthorizedError(
              info?.message || 'Invalid username or password',
              'Authentication failed with provided credentials'
            ));
          }

          const loginResponse = await this.authService.login(loginData, requestId);

          logger.info({
            msg: 'AuthController: Login successful',
            userId: user.id,
            hasToken: !!loginResponse.token,
            requestId
          });

          ResponseUtil.success(res, loginResponse, 'Login successful', 200);
        } catch (serviceError) {
          next(serviceError);
        }
      })(req, res, next);
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const requestId = res.locals.requestId;
      const refreshTokenDto: RefreshTokenDto = req.body;

      const { refreshToken } = refreshTokenDto;

      const refreshTokenResponse = await this.authService.refreshToken(refreshToken, requestId);

      logger.info({
        msg: 'AuthController: Refresh Token Success',
        requestId
      });

      ResponseUtil.success(res, refreshTokenResponse, 'Refresh token successful', 200);

    } catch (error) {
      logger.error({ msg: 'Refresh Token Error', error: error instanceof Error ? error.message : error })

      const refreshTokenError = new InternalServerError(
        'Refresh Toke failed',
        error instanceof Error ? error.message : 'Unknown error occurred during refresh token'
      );

      next(refreshTokenError);
    }
  }
}