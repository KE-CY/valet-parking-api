import BasicRoute from "./basicRoute";
import { requireJWTAuth } from '../middlewares/authMiddleware';
import { asyncWrapper } from "../middlewares/errorHandlerMiddleware";
import { uploadMemory } from "../config/multer-config";
import { FileController } from "../controllers/fileController";
import { FileServiceFactory } from "../services/fileService";
import { config } from "../config/config";
import { StorageFactory } from "../services/storage/storageFactory";

export default class FileRoutes extends BasicRoute {

  private fileController: FileController | null = null;
  private isInitialized: boolean = false;


  constructor() {
    super();
    this.setPrefix('api/v1/files');
    this.setRoutes();
  }

  private async initializeController(): Promise<FileController> {
    if (!this.fileController || !this.isInitialized) {
      const storage = StorageFactory.createMinioStorage(config.minio);
      const fileService = await FileServiceFactory.create(storage, config.minio.defaultBucket);
      this.fileController = new FileController(fileService);
      this.isInitialized = true;
    }
    return this.fileController;
  }

  private createHandler(method: keyof FileController) {
    return asyncWrapper(async (req, res, next) => {
      const controller = await this.initializeController();
      const handler = controller[method] as Function;
      await handler.call(controller, req, res, next);
    });
  }

  protected setRoutes(): void {
    this.post('/', requireJWTAuth, uploadMemory.fields([{ name: 'file' }]), this.createHandler('uploadMultiple'));
  }
}