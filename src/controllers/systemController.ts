import { NextFunction, Request, Response } from 'express';
import logger from '../utils/logger';
import { InternalServerError } from '../utils/customErrors';
import { ResponseUtil } from '../utils/responseUtil';
import { ISystemService } from '../interfaces/services/systemServiceInterface';
import { SystemService } from '../services/systemService';

export class SystemController {
  constructor(private systemService: ISystemService = new SystemService()) { }
  getStaticOptions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const requestId = res.locals.requestId;
    try {
      logger.debug({ msg: 'SystemController: Start get static options', requestId });
      let staticOptionsResponse = await this.systemService.getStaticOptions(requestId);

      logger.info({ msg: 'Get static options success.', requestId });

      ResponseUtil.success(res, staticOptionsResponse, 'Get static options successful', 200);
    } catch (error) {
      logger.error({ msg: 'Get static options error.', error: error instanceof Error ? error.message : error });

      const getStaticOptionsError = new InternalServerError(
        'Get Static Options Failed',
        error instanceof Error ? error.message : 'Unknown error occurred during get static options'
      );

      next(getStaticOptionsError);
    }
  }
}