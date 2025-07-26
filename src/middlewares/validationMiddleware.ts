import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ValidationError } from '../utils/customErrors';
import { logger } from '../utils/logger';

/**
 * 驗證目標類型
 */
export type ValidationType = 'body' | 'params' | 'query';

/**
 * 驗證中間件選項
 */
interface ValidationOptions {
  /** 是否允許未知欄位 */
  allowUnknown?: boolean;
  /** 是否移除未知欄位 */
  stripUnknown?: boolean;
  /** 是否在第一個錯誤時停止驗證 */
  abortEarly?: boolean;
}

/**
 * 創建驗證中間件
 * @param schema Joi 驗證 schema
 * @param target 驗證目標 (body, params, query)
 * @param options 驗證選項
 */
export const validate = (
  schema: Joi.ObjectSchema,
  target: ValidationType = 'body',
  options: ValidationOptions = {}
) => {
  const defaultOptions: ValidationOptions = {
    allowUnknown: false,
    stripUnknown: true,
    abortEarly: false,
    ...options
  };

  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // 獲取要驗證的資料
      let dataToValidate: any;
      switch (target) {
        case 'body':
          dataToValidate = req.body;
          break;
        case 'params':
          dataToValidate = req.params;
          break;
        case 'query':
          dataToValidate = req.query;
          break;
        default:
          dataToValidate = req.body;
      }

      // 執行驗證
      const { error, value } = schema.validate(dataToValidate, {
        allowUnknown: defaultOptions.allowUnknown,
        stripUnknown: defaultOptions.stripUnknown,
        abortEarly: defaultOptions.abortEarly,
        convert: true, // 自動類型轉換
        errors: {
          wrap: {
            label: false // 不在錯誤訊息中包裝欄位名稱
          }
        }
      });

      if (error) {
        // 轉換 Joi 驗證錯誤為自定義驗證錯誤
        const validationErrors = error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message,
          value: detail.context?.value
        }));

        logger.warn('Validation failed', {
          target,
          errors: validationErrors,
          requestId: res.locals.requestId
        });

        return next(new ValidationError(
          `${target.charAt(0).toUpperCase() + target.slice(1)} validation failed`,
          validationErrors
        ));
      }

      // 將驗證後的值替換原始值
      switch (target) {
        case 'body':
          req.body = value;
          break;
        case 'params':
          req.params = value;
          break;
        case 'query':
          req.query = value;
          break;
      }

      logger.debug('Validation passed', {
        target,
        requestId: res.locals.requestId
      });

      next();
    } catch (err) {
      logger.error('Validation middleware error', {
        target,
        error: err instanceof Error ? err.message : err,
        requestId: res.locals.requestId
      });

      next(new ValidationError('Validation process failed'));
    }
  };
};

/**
 * 驗證請求體的便利方法
 */
export const validateBody = (schema: Joi.ObjectSchema, options?: ValidationOptions) =>
  validate(schema, 'body', options);

/**
 * 驗證路徑參數的便利方法
 */
export const validateParams = (schema: Joi.ObjectSchema, options?: ValidationOptions) =>
  validate(schema, 'params', options);

/**
 * 驗證查詢參數的便利方法
 */
export const validateQuery = (schema: Joi.ObjectSchema, options?: ValidationOptions) =>
  validate(schema, 'query', options);

/**
 * 組合驗證中間件
 * 可以同時驗證多個目標
 */
export const validateMultiple = (validations: Array<{
  schema: Joi.ObjectSchema;
  target: ValidationType;
  options?: ValidationOptions;
}>) => {
  return validations.map(({ schema, target, options }) => 
    validate(schema, target, options)
  );
};