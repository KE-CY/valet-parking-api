import { In, Repository } from "typeorm";
import { SystemSetting } from "../entities/SystemSetting";
import { ISystemSettingRepository } from "../interfaces/repositories/systemSettingRepositoryInterface";
import { AppDataSource } from "../config/typeorm-config";
import logger from "../utils/logger";
import { DatabaseError, NotFoundError } from "../utils/customErrors";

export class SystemSettingRepository extends Repository<SystemSetting> implements ISystemSettingRepository {
  constructor() {
    super(SystemSetting, AppDataSource.manager);
  }

  static getInstance(): SystemSettingRepository {
    return new SystemSettingRepository();
  }

  async getMultiple(keys: string[]): Promise<Record<string, any>> {
    try {
      logger.debug({ msg: 'SystemSettingRepository: Start get multiple.', keys });
      const settings = await this.findBy({ key: In(keys) });

      const result: Record<string, any> = {};
      for (const key of keys) {
        const found = settings.find(s => s.key === key);
        if (found) {
          result[key] = found.value;
        } else {
          logger.error({ msg: `SystemSetting "${key}" not found` });
          throw new NotFoundError(`SystemSetting "${key}" not found`);
        }
      }
      return result;
    } catch (error) {
      logger.error({ msg: 'SystemSettingRepository: Get multiple error.', keys });
      throw new DatabaseError(
        'Failed get multiple.',
        error instanceof Error ? error.message : 'Unknown database error'
      );

    }

  }
}