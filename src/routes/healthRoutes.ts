import { HealthController } from '../controllers/healthController';
import BasicRoute from './basicRoute';

export default class HealthRoutes extends BasicRoute {
  private healthController: HealthController;

  constructor() {
    super();
    this.healthController = new HealthController();
    this.setPrefix('health');
    this.setRoutes();
  }

  protected setRoutes(): void {
    this.get('/', this.healthController.checkHealth);
    this.get('/status', this.healthController.checkHealth);
  }
}