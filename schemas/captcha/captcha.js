const Joi = require("joi");

const captchaSchema = Joi.object({
  response: Joi.string().required(),
});

module.exports = captchaSchema;
