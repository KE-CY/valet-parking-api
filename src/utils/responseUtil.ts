import { Response } from 'express';
import { ApiResponse, ErrorDetail, PaginationInfo } from '../types/response';
import { v4 as uuidv4 } from 'uuid';

/**
 * Response 工具類，提供統一的回應格式
 */
export class ResponseUtil {
  /**
   * 發送成功回應
   * @param res Express Response 物件
   * @param data 回應資料
   * @param message 成功訊息
   * @param statusCode HTTP 狀態碼
   * @param pagination 分頁資訊
   */
  static success<T>(
    res: Response,
    data?: T,
    message?: string,
    statusCode: number = 200,
    pagination?: PaginationInfo
  ): void {
    const response: ApiResponse<T> = {
      status: 'success',
      message: message || 'Request processed successfully',
      data,
      pagination,
      timestamp: new Date().toISOString(),
      requestId: ResponseUtil.generateRequestId(res)
    };

    res.status(statusCode).json(response);
  }

  /**
   * 發送錯誤回應
   * @param res Express Response 物件
   * @param message 錯誤訊息
   * @param statusCode HTTP 狀態碼
   * @param error 錯誤詳細資訊
   */
  static error(
    res: Response,
    message: string = 'An error occurred',
    statusCode: number = 500,
    error?: ErrorDetail
  ): void {
    const response: ApiResponse = {
      status: 'error',
      message,
      error,
      timestamp: new Date().toISOString(),
      requestId: ResponseUtil.generateRequestId(res)
    };

    res.status(statusCode).json(response);
  }

  /**
   * 發送失敗回應（通常用於業務邏輯失敗，如驗證失敗）
   * @param res Express Response 物件
   * @param message 失敗訊息
   * @param data 相關資料
   * @param statusCode HTTP 狀態碼
   */
  static fail<T>(
    res: Response,
    message: string = 'Request failed',
    data?: T,
    statusCode: number = 400
  ): void {
    const response: ApiResponse<T> = {
      status: 'fail',
      message,
      data,
      timestamp: new Date().toISOString(),
      requestId: ResponseUtil.generateRequestId(res)
    };

    res.status(statusCode).json(response);
  }

  /**
   * 發送驗證錯誤回應
   * @param res Express Response 物件
   * @param validationErrors 驗證錯誤陣列
   * @param message 錯誤訊息
   */
  static validationError(
    res: Response,
    validationErrors: Array<{ field: string; message: string; value?: any }>,
    message: string = 'Validation failed'
  ): void {
    const error: ErrorDetail = {
      code: 'VALIDATION_ERROR',
      details: 'Input validation failed',
      validation: validationErrors
    };

    ResponseUtil.error(res, message, 422, error);
  }

  /**
   * 發送未找到資源回應
   * @param res Express Response 物件
   * @param resource 資源名稱
   */
  static notFound(
    res: Response,
    resource: string = 'Resource'
  ): void {
    const error: ErrorDetail = {
      code: 'NOT_FOUND',
      details: `${resource} not found`
    };

    ResponseUtil.error(res, `${resource} not found`, 404, error);
  }

  /**
   * 發送未授權回應
   * @param res Express Response 物件
   * @param message 未授權訊息
   */
  static unauthorized(
    res: Response,
    message: string = 'Unauthorized access'
  ): void {
    const error: ErrorDetail = {
      code: 'UNAUTHORIZED',
      details: 'Authentication required'
    };

    ResponseUtil.error(res, message, 401, error);
  }

  /**
   * 發送禁止訪問回應
   * @param res Express Response 物件
   * @param message 禁止訪問訊息
   */
  static forbidden(
    res: Response,
    message: string = 'Forbidden access'
  ): void {
    const error: ErrorDetail = {
      code: 'FORBIDDEN',
      details: 'Insufficient permissions'
    };

    ResponseUtil.error(res, message, 403, error);
  }

  /**
   * 發送分頁資料回應
   * @param res Express Response 物件
   * @param data 資料陣列
   * @param pagination 分頁資訊
   * @param message 成功訊息
   */
  static paginated<T>(
    res: Response,
    data: T[],
    pagination: PaginationInfo,
    message?: string
  ): void {
    ResponseUtil.success(res, data, message, 200, pagination);
  }

  /**
   * 生成或獲取請求 ID
   * @param res Express Response 物件
   * @returns 請求 ID
   */
  private static generateRequestId(res: Response): string {
    // 嘗試從 res.locals 獲取請求 ID，如果沒有則生成新的
    return res.locals.requestId || uuidv4();
  }

  /**
   * 計算分頁資訊
   * @param currentPage 當前頁數
   * @param pageSize 每頁筆數
   * @param totalItems 總筆數
   * @returns 分頁資訊
   */
  static calculatePagination(
    currentPage: number,
    pageSize: number,
    totalItems: number
  ): PaginationInfo {
    const totalPages = Math.ceil(totalItems / pageSize);

    return {
      currentPage,
      pageSize,
      totalItems,
      totalPages,
      hasNext: currentPage < totalPages,
      hasPrev: currentPage > 1
    };
  }
}