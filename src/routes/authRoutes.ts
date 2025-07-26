import BasicRoute from "./basicRoute";
import { validateBody } from '../middlewares/validationMiddleware';
import { loginSchema, refreshTokenSchema } from "../validations/authValidationSchema";
import { AuthController } from "../controllers/authController";

export default class AuthRoutes extends BasicRoute {
  private authController: AuthController;

  constructor() {
    super();
    this.authController = new AuthController();
    this.setPrefix('api/v1/auth');
    this.setRoutes();
  }

  protected setRoutes(): void {
    this.post('/login', validateBody(loginSchema), this.authController.login);
    this.post('/refresh-token', validateBody(refreshTokenSchema), this.authController.refreshToken);
  }
}