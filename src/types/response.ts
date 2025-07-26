/**
 * 統一的 API 回應格式介面
 */
export interface ApiResponse<T = any> {
  /** 回應狀態 */
  status: 'success' | 'error' | 'fail';
  /** 回應訊息 */
  message?: string;
  /** 回應資料 */
  data?: T;
  /** 錯誤詳細資訊（僅在錯誤時提供） */
  error?: ErrorDetail;
  /** 分頁資訊（當資料為陣列時） */
  pagination?: PaginationInfo;
  /** 回應時間戳 */
  timestamp: string;
  /** 請求 ID（用於追蹤） */
  requestId?: string;
}

/**
 * 錯誤詳細資訊
 */
export interface ErrorDetail {
  /** 錯誤代碼 */
  code?: string;
  /** 錯誤詳細訊息 */
  details?: string;
  /** 驗證錯誤（當有表單驗證錯誤時） */
  validation?: ValidationError[];
}

/**
 * 驗證錯誤
 */
export interface ValidationError {
  /** 欄位名稱 */
  field: string;
  /** 錯誤訊息 */
  message: string;
  /** 接收到的值 */
  value?: any;
}

/**
 * 分頁資訊
 */
export interface PaginationInfo {
  /** 當前頁數 */
  currentPage: number;
  /** 每頁筆數 */
  pageSize: number;
  /** 總筆數 */
  totalItems: number;
  /** 總頁數 */
  totalPages: number;
  /** 是否有下一頁 */
  hasNext: boolean;
  /** 是否有上一頁 */
  hasPrev: boolean;
}