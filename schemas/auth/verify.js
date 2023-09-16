const Joi = require("joi");

const verifySchema = Joi.object({
  verificationCode: Joi.number().required(),
});

module.exports = verifySchema;
