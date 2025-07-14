import { idValidationSchema, valetParkingMembershipSchema, valetParkingRegisterSchema, valetParkingReservedSchema, valetParkingSpotSchema } from "../validations/valetParkingValidation";
import { validateBodyRequest, validateRequestParams, validateRequestQuery } from "./validateRequest";

export const valetParkingMembershipValidation = validateRequestQuery(valetParkingMembershipSchema);

export const valetParkingRegisterValidation = validateBodyRequest(valetParkingRegisterSchema);

export const pathParamByIdValidation = validateRequestParams(idValidationSchema);

export const valetParkingSpotValidation = validateBodyRequest(valetParkingSpotSchema);

export const valetParkingReservedValidation = validateBodyRequest(valetParkingReservedSchema);