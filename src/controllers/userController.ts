import { Request, Response, NextFunction } from 'express'
import { QueryRunner } from 'typeorm';
import { AppDataSource } from '../config/typeorm-config';
import logger from '../utils/logger';
import { UserService } from '../services/internal/userService';
import { ApiResponse } from '../utils/responseModel';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  const queryRunner: QueryRunner = AppDataSource.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();
  const body = req.body;

  try {
    await UserService.createUser({ queryRunner, userData: body });
    await queryRunner.commitTransaction();

    res.status(200).json(new ApiResponse('success', 'OK', { msg: 'Registered successfully!' }));

  } catch (error) {
    logger.error('Error in register:', error);
    await queryRunner.rollbackTransaction();
    next(error);
  } finally {
    await queryRunner.release();
  }
};