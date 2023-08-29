const Joi = require("joi");

const transactionStatusSchema = Joi.object({
  status: Joi.string()
    .valid("pending", "accepted", "rejected")
    .default("pending"),
});

module.exports = transactionStatusSchema;
