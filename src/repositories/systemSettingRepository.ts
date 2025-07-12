import { Repository } from "typeorm";
import { SystemSetting } from "../entities/SystemSetting";
import { AppDataSource } from "../config/typeorm-config";

export class SystemSettingRepository extends Repository<SystemSetting> {
  constructor() {
    super(SystemSetting, AppDataSource.manager);
  }
}

export const systemSettingRepository =
  AppDataSource.getRepository(SystemSetting).extend(SystemSettingRepository);