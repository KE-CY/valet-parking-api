import { Router } from 'express';
import { logger } from '../utils/logger';

export default abstract class BasicRoute {
  protected router: Router;
  protected prefix: string = '';

  constructor() {
    this.router = Router();
  }

  /**
   * 設置路由前綴
   * @param prefix 路由前綴，例如 'api/v1' 或 'users'
   */
  public setPrefix(prefix: string): this {
    // 移除前後的斜線，統一處理
    this.prefix = prefix.replace(/^\/+|\/+$/g, '');

    logger.debug({
      msg: `Route prefix set to: ${this.prefix}`,
      routeClass: this.constructor.name
    });
    return this;
  }

  /**
   * 獲取完整的路由路徑
   * @param path 相對路徑
   * @returns 完整路徑（包含前綴）
   */
  protected getFullPath(path: string): string {
    // 確保路徑以 / 開頭
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    // 如果沒有前綴，直接返回清理後的路徑
    if (!this.prefix) {
      return cleanPath;
    }

    // 組合前綴和路徑，避免雙重斜線
    const fullPath = `/${this.prefix}${cleanPath}`.replace(/\/+/g, '/');
    return fullPath;
  }

  /**
   * 註冊 GET 路由
   * @param path 路由路徑
   * @param handlers 處理函數
   */
  protected get(path: string, ...handlers: any[]): void {
    const fullPath = this.getFullPath(path);
    this.router.get(fullPath, ...handlers);
    logger.debug({
      msg: `GET route registered: ${fullPath}`,
      routeClass: this.constructor.name,
      originalPath: path,
      prefix: this.prefix
    });
  }

  /**
   * 註冊 POST 路由
   * @param path 路由路徑
   * @param handlers 處理函數
   */
  protected post(path: string, ...handlers: any[]): void {
    const fullPath = this.getFullPath(path);
    this.router.post(fullPath, ...handlers);
    logger.debug({
      msg: `POST route registered: ${fullPath}`,
      routeClass: this.constructor.name,
      originalPath: path,
      prefix: this.prefix
    });
  }

  /**
   * 註冊 PUT 路由
   * @param path 路由路徑
   * @param handlers 處理函數
   */
  protected put(path: string, ...handlers: any[]): void {
    const fullPath = this.getFullPath(path);
    this.router.put(fullPath, ...handlers);
    logger.debug({
      msg: `PUT route registered: ${fullPath}`,
      routeClass: this.constructor.name,
      originalPath: path,
      prefix: this.prefix
    });
  }

  /**
   * 註冊 DELETE 路由
   * @param path 路由路徑
   * @param handlers 處理函數
   */
  protected delete(path: string, ...handlers: any[]): void {
    const fullPath = this.getFullPath(path);
    this.router.delete(fullPath, ...handlers);
    logger.debug({
      msg: `DELETE route registered: ${fullPath}`,
      routeClass: this.constructor.name,
      originalPath: path,
      prefix: this.prefix
    });
  }

  /**
   * 註冊 PATCH 路由
   * @param path 路由路徑
   * @param handlers 處理函數
   */
  protected patch(path: string, ...handlers: any[]): void {
    const fullPath = this.getFullPath(path);
    this.router.patch(fullPath, ...handlers);
    logger.debug({
      msg: `PATCH route registered: ${fullPath}`,
      routeClass: this.constructor.name,
      originalPath: path,
      prefix: this.prefix
    });
  }

  /**
   * 子類別必須實作此方法來定義路由
   */
  protected abstract setRoutes(): void;

  /**
   * 獲取 Express Router 實例
   */
  public getRouter(): Router {
    return this.router;
  }

  /**
   * 獲取當前前綴
   */
  public getPrefix(): string {
    return this.prefix ? `/${this.prefix}` : '';
  }
}