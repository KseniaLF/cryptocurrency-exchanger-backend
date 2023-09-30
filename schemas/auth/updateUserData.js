const Joi = require("joi");

const updateUserData = Joi.object({
  name: Joi.string(),
  firstName: Joi.string(),
  lastName: Joi.string(),
  middleName: Joi.string(),
  additionalContact: Joi.string(),
  wallet: Joi.string(),
  creditCard: Joi.string(),
});

module.exports = updateUserData;
