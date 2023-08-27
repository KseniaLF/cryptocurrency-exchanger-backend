const Joi = require("joi");

const authSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().required(),
  password: Joi.string().required(),
});

module.exports = authSchema;
