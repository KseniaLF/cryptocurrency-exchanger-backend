const Joi = require("joi");

const reviewStatusSchema = Joi.object({
  status: Joi.string()
    .valid("pending", "accepted", "rejected")
    .default("pending"),
});

module.exports = reviewStatusSchema;
