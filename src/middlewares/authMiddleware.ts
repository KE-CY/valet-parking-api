import { refreshTokenSchema } from "../validations/authValidation";
import { validateBodyRequest } from "./validateRequest";

export const refreshTokenValidation = validateBodyRequest(refreshTokenSchema);