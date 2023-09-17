const Joi = require("joi");

const verifySchema = Joi.object({
  email: Joi.string().required(),
  verificationCode: Joi.number().required(),
});

const resendVerifySchema = Joi.object({
  email: Joi.string().required(),
});

const passwordResetSchema = Joi.object({
  email: Joi.string().required(),
  verificationCode: Joi.number().required(),
  password: Joi.string().required(),
});

module.exports = { resendVerifySchema, verifySchema, passwordResetSchema };
