export interface ISystemSettingRepository {
  getMultiple(keys: string[]): Promise<Record<string, any>>;
}