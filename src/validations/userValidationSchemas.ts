import Joi from 'joi';

export const registerUserSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  employeeNo: Joi.string().required(),
  name: Joi.string().required(),
  avatarUrl: Joi.string().uri().required(),
});