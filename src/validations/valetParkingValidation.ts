import Joi from "joi";
import { DocumentType } from '../enums/valetParkingDocumentEnum';

export const idValidationSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

export const valetParkingMembershipSchema = Joi.object({
  memberId: Joi.string().required(),
}).options({ stripUnknown: true });

export const valetParkingRegisterSchema = Joi.object({
  carPlate: Joi.string().required(),
  carColor: Joi.string().required(),
  memberId: Joi.string(),
  name: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  country: Joi.object({
    id: Joi.number().required(),
  }),
  rfIdKey: Joi.string().required(),
  document: Joi.array().items(
    Joi.object({
      type: Joi.string()
        .valid(...Object.values(DocumentType))
        .required(),
      url: Joi.string().uri().required(),
    }).required()
  ),
}).options({ stripUnknown: true });

export const valetParkingSpotSchema = Joi.object({
  parkingSpot: Joi.string().required(),
}).options({ stripUnknown: true });

export const valetParkingReservedSchema = Joi.object({
  pickedAt: Joi.date().required(),
}).options({ stripUnknown: true });