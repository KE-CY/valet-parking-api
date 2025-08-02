
import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger';
import { InternalServerError } from '../utils/customErrors';
import { ResponseUtil } from '../utils/responseUtil';
import { UserService } from '../services/userService';
import { IUserService } from '../interfaces/services/userServiceInterface';

export class UserController {
  constructor(private userService: IUserService = new UserService()) { }

  public register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const requestId = res.locals.requestId;
    try {
      const registerData = req.body;
      const userResponse = await this.userService.register(registerData, requestId);
      ResponseUtil.success(res, userResponse, 'User register completed successfully');
    } catch (error) {
      logger.error({ msg: 'User register failed', error: error instanceof Error ? error.message : error })


      const userError = error instanceof Error ? error : new InternalServerError(
        'User register failed',
        error instanceof Error ? error.message : 'Unknown error occurred during user register'
      );

      next(userError);
    }
  }
}