const Joi = require("joi");

const verifySchema = Joi.object({
  email: Joi.string().required(),
  verificationCode: Joi.number().required(),
});

const resendVerifySchema = Joi.object({
  email: Joi.string().required(),
});

module.exports = { resendVerifySchema, verifySchema };
