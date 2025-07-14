import bcrypt from 'bcrypt';
import { QueryRunner } from "typeorm";
import { BasicMethod } from "../../utils/basicMethod";
import { User } from "../../entities/User";
import logger from "../../utils/logger";
import { NotFoundError, ValidationError } from "../../utils/customError";
import _ from 'lodash';
import { ErrorCodes } from "../../utils/errorCodes";
import { UserRepository, userRepository } from "../../repositories/userRepository";

export class UserService extends BasicMethod {
   static async getReqUser(id: number): Promise<User> {
    logger.info('In UserService.getReqUser', { id });
    const user = await userRepository.findOne({
      where: { id },
      select: ['id', 'name'],
    });

    if (_.isEmpty(user)) {
      logger.error('In UserService.getReqUser', {
        message: `User with id ${id} does not exist or is inactive.`,
      });
      throw new NotFoundError(ErrorCodes.USER_NOT_FOUND.message);
    }

    return user;
  }

  static async loginLocalStrategy(username: string, password: string): Promise<User> {
    logger.debug('In UserService.loginLocalStrategy', { username });

    const user = await userRepository.findOne({ where: { username, isActive: true } });
    if (!user) {
      throw new Error(ErrorCodes.LOGIN_ERROR.message);
    }

    const isPasswordValid = bcrypt.compareSync(password, String(user.password));

    if (!isPasswordValid) {
      throw new Error(ErrorCodes.LOGIN_ERROR.message);
    }

    return user;
  }

  static async validateUserExistByUsername(username?: string): Promise<void> {
    logger.info('In UserService.validateUserExistByUsername', { username });

    if (!username) {
      logger.error('Username not provided');
      throw new ValidationError('Username is required');
    }

    const user = await userRepository.findOne({
      where: { username },
    });

    if (!_.isEmpty(user)) {
      logger.debug('username already exists', { username });
      throw new ValidationError(ErrorCodes.USER_NAME_ALREADY_EXISTS.message);
    }
  }

  static async createUser(
    { queryRunner, userData }: { queryRunner: QueryRunner, userData: Partial<User> }
  ) {
    logger.debug('In UserService.createUser', { userData });
    const { username, password } = userData;

    await UserService.validateUserExistByUsername(username);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password!, salt);

    const createData: Partial<User> = {
      ...userData,
      salt,
      password: hashedPassword,
    };
    await UserRepository.createUserWithTransaction({ queryRunner, createData });

  }
}