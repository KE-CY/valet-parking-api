import axios, { AxiosRequestConfig } from 'axios';
import _ from 'lodash';
import { SystemSettingApiConfigKey } from '../constants/systemSettingKey';
import { ApiConfig } from '../types/systemSetting';
import logger from '../utils/logger';
import { SystemSettingService } from './internal/systemSettingService';

export class ThirdPartyApiService {
  static getSafeJsonReplacer() {
    const seen = new WeakSet();
    return function (_key: string, value: any) {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) return '[Circular]';
        seen.add(value);
      }
      return value;
    };
  }

  static async call(config: ApiConfig, input: Record<string, any>): Promise<Record<string, any>> {
    logger.info({
      msg: 'In ThirdPartyApiService.call',
      apiUrl: config.apiUrl,
      method: config.method,
      requestFields: config.request.fields,
      input
    });

    const headers: Record<string, string> = {};
    for (const [key, value] of Object.entries(config.headers || {})) {
      headers[key] = value.replace(/\{\{(\w+)\}\}/g, (_, varName) => input[varName] ?? '');
    }

    const requestData: Record<string, any> = {};
    for (const field of config.request.fields) {
      requestData[field] = input[field];
    }

    let apiUrl = config.apiUrl;
    if (config.pathParams) {
      for (const [paramName, inputKey] of Object.entries(config.pathParams)) {
        const value = input[inputKey];
        apiUrl = apiUrl.replace(`:${paramName}`, encodeURIComponent(value ?? ''));
      }
    }

    let raw: any;
    try {
      const axiosConfig: AxiosRequestConfig = {
        method: config.method,
        url: apiUrl,
        headers,
        ...(config.method === 'GET'
          ? { params: requestData }
          : { data: requestData }),
      };

      logger.info({ msg: 'Third-party API config', axiosConfig });

      const response = await axios(axiosConfig);

      if (response.status !== 200) {
        throw new Error(`Third-party API returned ${response.status}: ${JSON.stringify(response.data)}`);
      }
      raw = response.data;
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        logger.error({
          msg: 'Third-party API call failed',
          message: err.message,
          status: err.response?.status,
          url: err.config?.url,
          data:
            typeof err.response?.data === 'object'
              ? JSON.stringify(err.response?.data, ThirdPartyApiService.getSafeJsonReplacer())
              : err.response?.data
        });
      } else {
        logger.error({ msg: 'Unexpected error in third-party API call', error: String(err) });
      }
      throw err;
    }

    const result: Record<string, any> = {};

    logger.debug({ msg: 'Raw response from third-party API', raw });
    // 3. 回傳欄位 mapping
    if (config.response.map) {
      for (const [targetField, sourcePath] of Object.entries(config.response.map)) {
        result[targetField] = _.get(raw, sourcePath);
      }
    }

    // 4. 回傳欄位合併 combine
    if (config.response.combine) {
      for (const [targetField, rule] of Object.entries(config.response.combine)) {
        const values = rule.fields
          .map(f => _.get(raw, f)?.toString().trim() ?? '')
          .filter(v => (rule.skipEmpty ? Boolean(v) : true));

        let combined = values.join(rule.joinWith || '');
        if (rule.trim) combined = combined.trim();
        result[targetField] = combined;
      }
    }

    logger.debug('Processed response from third-party API', result);
    return result;
  }

  static async loginToVendor(): Promise<{ token: string; refreshToken?: string }> {
    logger.debug({ msg: 'In ThirdPartyApiService.loginToVendor' })
    const config = await SystemSettingService.getApiConfig(SystemSettingApiConfigKey.LOGIN_AND_GET_TOKEN);

    if (!config.credentials) {
      throw new Error('Login config missing credentials');
    }

    const result = await ThirdPartyApiService.call(config, config.credentials);

    if (!result.token) {
      throw new Error('Token not found in third-party response');
    }

    return result as { token: string; refreshToken?: string };
  }
}