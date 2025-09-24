const Joi = require("joi");

const assessmentValidation = Joi.object({
  assessmentNo: Joi.string()
    .alphanum()
    .min(3)
    .max(20)
    .required(),

  division: Joi.string()
    .pattern(/^[A-Za-z\s]+$/) // only letters + spaces
    .min(2)
    .max(50)
    .required(),

  street: Joi.string()
    .pattern(/^[A-Za-z0-9\s]+$/) // allow letters, numbers, spaces
    .min(2)
    .max(100)
    .required(),

  propertyNo: Joi.string()
    .alphanum()
    .min(1)
    .max(20)
    .required(),

  ownerName: Joi.string()
    .pattern(/^[A-Za-z\s]+$/) // only letters and spaces
    .min(3)
    .max(100)
    .required()
    .messages({
      "string.pattern.base": "Owner name can only contain letters and spaces",
    }),

  ownerNIC: Joi.string()
    // Sri Lankan NIC: either 9 digits + V/v, OR 12 digits only
    .pattern(/^(?:[0-9]{9}[Vv]|[0-9]{12})$/)
    .required()
    .messages({
      "string.pattern.base":
        "NIC must be either 9 digits followed by V/v OR exactly 12 digits",
    }),

  contactNo: Joi.string()
    .pattern(/^[0-9]{10}$/) // exactly 10 digits
    .required()
    .messages({
      "string.pattern.base": "Contact number must be exactly 10 digits",
    }),

  description: Joi.string().min(5).max(500).required(),

  propertyType: Joi.string().valid("Bussiness", "House").required(),

  appraisedValue: Joi.number().positive().required(),

  taxRate: Joi.number().min(0).max(100).required(), // assuming percentage

  status: Joi.string().valid("Active", "Inactive").default("Active"),
});

module.exports = { assessmentValidation };
