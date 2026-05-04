const Joi = require("joi");

const bannerValidation = Joi.object({
  name: Joi.string().min(3).required(),
  link: Joi.string().uri().required(),
  status: Joi.string().valid("active", "inactive").required(),
});

module.exports = bannerValidation;
