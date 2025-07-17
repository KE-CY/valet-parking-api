import { QueryRunner, Repository } from "typeorm";
import { User } from "../entities/User";
import { AppDataSource } from "../config/typeorm-config";
import logger from "../utils/logger";

export class UserRepository extends Repository<User> {
  constructor() {
    super(User, AppDataSource.manager);
  }

  static async createUserWithTransaction(
    { queryRunner, createData }: { queryRunner: QueryRunner, createData: Partial<User> }
  ): Promise<void> {
    logger.info({ msg: 'In UserRepository.createUserWithTransaction', createData });

    const userRepository = queryRunner.manager.getRepository(User);

    const user = userRepository.create(createData);

    await userRepository.insert(user);
  }
}

export const userRepository =
  AppDataSource.getRepository(User).extend(UserRepository);
