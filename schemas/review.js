const Joi = require("joi");

const reviewSchema = Joi.object({
  review: Joi.string().required(),
});

module.exports = reviewSchema;
