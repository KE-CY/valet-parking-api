import Joi from 'joi';

export const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
}).options({ stripUnknown: true });

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required()
}).options({ stripUnknown: true });