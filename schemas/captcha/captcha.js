const Joi = require("joi");

const captchaSchema = Joi.object({
  secret: Joi.string().required(),
  response: Joi.string().required(),
});

module.exports = captchaSchema;
