import Joi from "joi";
import { TAdmin } from "@/types/admin";
import { TUsers } from "@/types/user";

//login schema
const loginSchema = Joi.object({
  adminEmail: Joi.string().required().messages({
    "string.base": "Please enter a valid user ID",
    "string.empty": "User ID is required",
  }),
  adminPassword: Joi.string()
    .pattern(new RegExp("^[^\\s].*[^\\s]$"))
    .min(6)
    .required()
    .messages({
      "string.pattern.base": "Password Should Not Contain Space.",
      "string.empty": "Password is required",
    }),
});

//useredit schema
const userEditSchema = Joi.object({
  fullName: Joi.string()
    .pattern(/^[A-Za-z]+(?:\s[A-Za-z]+)+$/)
    .min(3)
    .max(100)
    .required()
    .messages({
      "string.base": "Full name must be a text.",
      "string.pattern.base": "Full name must consist of at least two words.",
      "string.empty": "Full name is required.",
      "string.min": "Full name must be at least 3 characters long.",
      "string.max": "Full name must be less than 100 characters long.",
      "any.required": "Full name is required.",
    }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Please enter a valid email address",
      "string.empty": "Email is required",
    }),
});

//login validateschema
export const loginValidate = (data: Partial<TAdmin>) => {
  console.log("login validate step1 ");

  const { error } = loginSchema.validate(data, { abortEarly: false });
  console.log("login validate step2 ");

  if (error) {
    console.log("login validate step3 error", error);

    const formattedErrors: { [key: string]: string } = {};
    console.log("login validate step4 ");

    error.details.forEach((detail) => {
      formattedErrors[detail.path[0] as string] = detail.message;
    });
    console.log("login validate step5 final errro ");

    return formattedErrors;
  }
  console.log("login validate step 6 sucess");

  return null;
};

//login userEditschema
export const userEditValidate = (data: Partial<TUsers>) => {
  const { error } = userEditSchema.validate(data, { abortEarly: false });
  if (error) {
    if (error) {
      const formattedErrors: { [key: string]: string } = {};
      error.details.forEach((detail) => {
        formattedErrors[detail.path[0] as string] = detail.message;
      });
      return formattedErrors;
    }
  }
  return null;
};
