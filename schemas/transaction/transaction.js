const Joi = require("joi");

const transactionSchema = Joi.object({
  amountToExchange: Joi.number().required(),
  amountToReceive: Joi.number().required(),
  currencyToExchange: Joi.string().required(),
  currencyToReceive: Joi.string().required(),
  paymentMethod: Joi.string().valid("creditCard", "wallet", "cash").required(),
  creditCard: Joi.when("paymentMethod", {
    is: "creditCard",
    then: Joi.string().required(),
  }),
  wallet: Joi.when("paymentMethod", {
    is: "wallet",
    then: Joi.string().required(),
  }),
  cash: Joi.when("paymentMethod", {
    is: "cash",
    then: Joi.forbidden(),
  }),
});

module.exports = transactionSchema;
