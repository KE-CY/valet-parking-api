export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    details?: any;
    field?: string;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class ResponseBuilder {
  static success<T>(data: T, message: string = 'Success'): ApiResponse<T> {
    return {
      success: true,
      message,
      data
    };
  }

  static error(
    message: string,
    code: string = 'INTERNAL_ERROR',
    details?: any,
    field?: string
  ): ApiResponse {
    return {
      success: false,
      message,
      error: {
        code,
        details,
        field
      }
    };
  }

  static validationError(
    message: string = 'Validation failed',
    details: any,
    field?: string
  ): ApiResponse {
    return {
      success: false,
      message,
      error: {
        code: 'VALIDATION_ERROR',
        details,
        field
      }
    };
  }

  static notFound(resource: string = 'Resource'): ApiResponse {
    return {
      success: false,
      message: `${resource} not found`,
      error: {
        code: 'NOT_FOUND'
      }
    };
  }

  static unauthorized(message: string = 'Unauthorized access'): ApiResponse {
    return {
      success: false,
      message,
      error: {
        code: 'UNAUTHORIZED'
      }
    };
  }

  static forbidden(message: string = 'Access forbidden'): ApiResponse {
    return {
      success: false,
      message,
      error: {
        code: 'FORBIDDEN'
      }
    };
  }
}