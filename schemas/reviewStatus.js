const Joi = require("joi");

const reviewStatusSchema = Joi.object({
  status: Joi.string()
    .valid("pending", "accepted", "not accepted")
    .default("pending"),
});

module.exports = reviewStatusSchema;
