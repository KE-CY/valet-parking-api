import BasicRoute from './basicRoute';
import { SystemController } from '../controllers/systemController';
import { requireJWTAuth } from '../middlewares/authMiddleware';
import { asyncWrapper } from '../middlewares/errorHandlerMiddleware';

export default class SystemRoutes extends BasicRoute {
  private systemController: SystemController;

  constructor() {
    super();
    this.systemController = new SystemController();
    this.setPrefix('api/v1/systems');
    this.setRoutes();
  }

  protected setRoutes(): void {
    this.get('/static-options', requireJWTAuth, asyncWrapper(this.systemController.getStaticOptions));
  }
}