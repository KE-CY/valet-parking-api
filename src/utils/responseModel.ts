export class ApiResponse<T> {
  public status: string;
  public message: string;
  public data?: T;
  public errorCode?: string;

  constructor(status: string, message: string, data?: T, errorCode?: string) {
    this.status = status;
    this.message = message;
    this.data = data;
    this.errorCode = errorCode;
  }
}
