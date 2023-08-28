const Joi = require("joi");

const transactionSchema = Joi.object({
  transaction: Joi.string().required(),
});

module.exports = transactionSchema;
