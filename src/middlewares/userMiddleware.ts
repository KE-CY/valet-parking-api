import { registerUserSchema } from "../validations/userValidation";
import { validateBodyRequest } from "./validateRequest";

export const registerValidation = validateBodyRequest(registerUserSchema);