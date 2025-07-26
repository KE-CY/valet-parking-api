import { UserController } from "../controllers/userController";
import BasicRoute from "./basicRoute";
import { asyncWrapper } from '../middlewares/errorHandlerMiddleware';
import { validateBody } from '../middlewares/validationMiddleware';
import { registerUserSchema } from '../validations/userValidationSchemas';

export default class UserRoutes extends BasicRoute {
  private userController: UserController

  constructor() {
    super();
    this.userController = new UserController();
    this.setPrefix('api/v1/users');
    this.setRoutes();
  }

  protected setRoutes(): void {
    this.post('/register', validateBody(registerUserSchema), asyncWrapper(this.userController.register));
  }
}