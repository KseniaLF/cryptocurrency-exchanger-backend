const Joi = require("joi");

const newsSchema = Joi.object({
  title: Joi.string().required(),
});

module.exports = newsSchema;
