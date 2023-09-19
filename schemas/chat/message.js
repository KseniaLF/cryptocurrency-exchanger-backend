const Joi = require("joi");

const messageSchema = Joi.object({
  message: Joi.string().required(),
});

module.exports = messageSchema;