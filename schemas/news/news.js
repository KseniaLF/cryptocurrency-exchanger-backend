const Joi = require("joi");

const newsSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  content: Joi.string(),
  tag: Joi.string(),
  image: Joi.string(),
});

module.exports = newsSchema;
