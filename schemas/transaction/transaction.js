const Joi = require("joi");

const transactionSchema = Joi.object({
  amountToExchange: Joi.number().required(),
  amountToReceive: Joi.number().required(),
  currencyToExchange: Joi.string().required(),
  currencyToReceive: Joi.string().required(),
  name: Joi.string().required(),
  additionalContact: Joi.string().required(),
  acceptTerms: Joi.boolean().required(),
});

module.exports = transactionSchema;
