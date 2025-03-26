import Joi from 'joi';

export const schemaValidation = Joi.object({
  title: Joi.string().required(),
  description: Joi.string(),
  type: Joi.string().required(),
  properties: Joi.object().required()
});

export const datasetValidation = Joi.object({
  name: Joi.string().required(),
  description: Joi.string(),
  schemaRef: Joi.object({
    id: Joi.string().required(),
    contentType: Joi.string().required()
  }).required()
});

export const segmentValidation = Joi.object({
  name: Joi.string().required(),
  description: Joi.string(),
  expression: Joi.object({
    type: Joi.string().required(),
    value: Joi.object().required()
  }).required(),
  schema: Joi.object({
    name: Joi.string().required()
  }).required()
});