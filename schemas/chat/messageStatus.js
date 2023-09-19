const Joi = require("joi");

const messageStatusSchema = Joi.object({
  status: Joi.string()
    .valid("read", "unread")
    .default("unread"),
});

module.exports = messageStatusSchema;