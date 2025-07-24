import { SystemSetting } from '../../entities/SystemSetting';
import { SettingType } from '../../enums/systemSettingEnum';

export interface ISystemSettingRepository {
  findAll(): Promise<SystemSetting[]>;
  findById(id: number): Promise<SystemSetting | null>;
  findByKey(key: string): Promise<SystemSetting | null>;
  findByType(type: SettingType): Promise<SystemSetting[]>;
  create(settingData: Partial<SystemSetting>): Promise<SystemSetting>;
  update(id: number, settingData: Partial<SystemSetting>): Promise<SystemSetting | null>;
  updateByKey(key: string, value: any): Promise<SystemSetting | null>;
  delete(id: number): Promise<boolean>;
}