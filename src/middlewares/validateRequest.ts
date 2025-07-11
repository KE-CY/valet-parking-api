import Joi from "joi";
import { Request, Response, NextFunction } from "express"
import { ApiResponse } from "../utils/responseModel";
import { ErrorCodes } from "../utils/errorCodes";

export const validateBodyRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body);

    if (error) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            'error',
            error.details[0].message,
            undefined,
            ErrorCodes.BODY_REQUEST_VALIDATION_FAILED.code
          )
        );
    }

    req.body = value;

    next();
  };
};

export const validateRequestParams = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.params);

    if (error) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            'error',
            error.details[0].message,
            undefined,
            ErrorCodes.PATH_PARAM_REQUEST_VALIDATION_FAILED.code
          )
        );
    }
    req.params = value;
    next();
  };
};

export const validateRequestQuery = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.query);

    if (error) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            'error',
            error.details[0].message,
            undefined,
            ErrorCodes.QUERY_REQUEST_VALIDATION_FAILED.code
          )
        );
    }
    req.params = value;
    next();
  };
};