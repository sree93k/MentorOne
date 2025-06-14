import Joi from "joi";

const userEmailSchema = Joi.string()
  .trim()
  .email({ tlds: { allow: false } })
  .required()
  .messages({
    "string.email": "Please enter a valid email.",
    "string.empty": "Email is required",
  });

const userPasswordSchema = Joi.string()
  .pattern(
    new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
    )
  )
  .required()
  .messages({
    "string.min": "Password should be at least 8 characters long",
    "string.pattern.base":
      "Password should include uppercase, lowercase, number, and special character",
    "string.empty": "Password is required",
  });

const fullName = Joi.string()
  .trim()
  .pattern(/^[A-Za-z]+(?:\s[A-Za-z]+)+$/) // Ensures at least two words
  .min(3)
  .max(100)
  .required()
  .messages({
    "string.base": "Full name must be a text.",
    "string.pattern.base":
      "Full name must consist of at least two words (first name and last name).",
    "string.empty": "Full name is required.",
    "string.min": "Full name must be at least 3 characters long.",
    "string.max": "Full name must be less than 100 characters long.",
    "any.required": "Full name is required.",
  });

const phone = Joi.string()
  .trim()
  .pattern(/^\d{10}$/)
  .messages({
    "string.pattern.base": "Phone must be a 10-digit number.",
    "string.empty": "Phone number is required.",
  });

export const validateEmail = (email: string) => {
  const { error } = userEmailSchema.validate(email);
  if (error) {
    return error.details[0].message;
  }
  return null;
};

export const validatePassword = (password: string) => {
  const { error } = userPasswordSchema.validate(password);
  if (error) {
    console.log("password error", error);

    return error.details[0].message;
  }
  return null;
};

export const validateFullName = (name: string) => {
  console.log("name is..", name);
  const { error } = fullName.validate(name);
  if (error) {
    console.log("name is", name);

    console.log("full anem error", error);

    return error.details[0].message;
  }
  return null;
};

export const validatePhoneNumber = (phoneNumber: string) => {
  const { error } = phone.validate(phoneNumber);
  if (error) {
    return error.details[0].message;
  }
  return null;
};
