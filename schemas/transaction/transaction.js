const Joi = require("joi");

const transactionSchema = Joi.object({
  amountToExchange: Joi.number().required(),
  amountToReceive: Joi.number().required(),
  currencyToExchange: Joi.string().required(),
  currencyToReceive: Joi.string().required(),
  // acceptTerms: Joi.boolean().valid(true).required(),
  paymentMethod: Joi.string().valid("creditCard", "wallet").required(),
  creditCard: Joi.string() /* .creditCard() */,
  wallet: Joi.string(),
}).xor("creditCard", "wallet");

module.exports = transactionSchema;
