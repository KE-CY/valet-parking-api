import { In } from "typeorm";
import { SettingType } from "../../enums/systemSettingEnum";
import { systemSettingRepository } from "../../repositories/systemSettingRepository";
import { BasicMethod } from "../../utils/basicMethod";
import logger from "../../utils/logger";

export class SystemSettingService extends BasicMethod {
  static entity = 'systemSetting';

  static buildCondition(query: any) {
    let { condition, querySQL } = super.buildCondition(query);

    const { id, type, key } = query;

    if (id) {
      querySQL += ` AND ${this.entity}.id = :id`;
      condition['id'] = id;
    }

    if (type) {
      querySQL += ` AND ${this.entity}.type = :type`;
      condition['type'] = type;
    }

    if (key) {
      querySQL += ` AND ${this.entity}.key ILIKE :key`;
      condition['key'] = `%${key}%`;
    }

    return { condition, querySQL };
  }

  static override buildTransformedFilters(
    query: any
  ): Record<string, string | number | object> {
    const { querySQL, condition } = SystemSettingService.buildCondition(query);

    const transformedFilters: Record<string, string | number | object> = {
      [querySQL]: condition,
    };

    return transformedFilters;
  }

  static async getValue<T = any>(key: string, expectedType?: SettingType): Promise<T> {
    const setting = await systemSettingRepository.findOneBy({ key });

    if (!setting) {
      throw new Error(`SystemSetting "${key}" not found`);
    }

    if (expectedType && setting.type !== expectedType) {
      throw new Error(`SystemSetting "${key}" type mismatch (expected ${expectedType})`);
    }

    return setting.value as T;
  }

  /**
  * 取得數字類型的設定值
  */
  static async getNumber(key: string): Promise<number> {
    const value = await SystemSettingService.getValue<any>(key, SettingType.SYSTEM_PARAM);
    const num = Number(value);
    if (isNaN(num)) {
      throw new Error(`SystemSetting "${key}" is not a valid number`);
    }
    return num;
  }

  /**
   * 取得布林值
   */
  static async getBoolean(key: string): Promise<boolean> {
    const value = await SystemSettingService.getValue<any>(key, SettingType.SYSTEM_PARAM);
    return value === true || value === 'true' || value === 1;
  }

  /**
   * 取得 API 設定值
   */
  static async getApiConfig<T = any>(key: string): Promise<T> {
    return SystemSettingService.getValue<T>(key, SettingType.API_CONFIG);
  }

  /**
   * 取得 JSON 結構
   */
  static async getJson<T = any>(key: string): Promise<T> {
    return SystemSettingService.getValue<T>(key, SettingType.SYSTEM_PARAM);
  }

  static async getMultiple(keys: string[]): Promise<Record<string, any>> {
    const settings = await systemSettingRepository.findBy({ key: In(keys) });

    const result: Record<string, any> = {};
    for (const key of keys) {
      const found = settings.find(s => s.key === key);
      if (found) {
        result[key] = found.value;
      } else {
        logger.error({ msg: `SystemSetting "${key}" not found` });
        throw new Error(`SystemSetting "${key}" not found`);
      }
    }

    return result;
  }
}