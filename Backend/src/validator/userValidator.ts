import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../middlewares/errorHandler";

// Schema for user data in signup
const userDataSchema = Joi.object({
  firstName: Joi.string()
    .pattern(/^[a-zA-Z ]*$/)
    .min(2)
    .max(50)
    .required(),
  lastName: Joi.string()
    .pattern(/^[a-zA-Z ]*$/)
    .min(2)
    .max(50)
    .required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  ),
  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .optional(),
  dob: Joi.date().optional(),
  gender: Joi.string().valid("male", "female").required(),
  role: Joi.array()
    .items(Joi.string().valid("mentee", "mentor"))
    .default(["mentee"]),
});

// Schema for signup request body
const signupSchema = Joi.object({
  gender: Joi.string().valid("male", "female", "other").required(),
  role: Joi.array()
    .items(Joi.string().valid("mentee", "mentor").required())
    .min(1)
    .required(),
  firstName: Joi.string()
    .pattern(/^[A-Za-z]+$/)
    .min(2)
    .max(50)
    .required(),
  lastName: Joi.string()
    .pattern(/^[A-Za-z]+$/)
    .min(2)
    .max(50)
    .required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string()
    .min(8)
    .max(128)
    .required()
    .pattern(/^(?!\s)/, { name: "no leading whitespace" }) // No leading whitespace
    .pattern(/(?!\s$)/, { name: "no trailing whitespace" }) // No trailing whitespace
    .pattern(/(?=.*[A-Z])/, "uppercase") // At least one uppercase letter
    .pattern(/(?=.*[a-z])/, "lowercase") // At least one lowercase letter
    .pattern(/(?=.*\d)/, "number") // At least one number
    .pattern(/(?=.*[!@#$%^&*(),.?":{}|<>])/, "special character") // At least one special character
    .pattern(/(?!.*\s)/, "no whitespace") // No whitespace anywhere
    .pattern(/(?!.*(.)\1{3})/, "no repetitive characters") // No 4 or more repetitive characters (e.g., "aaaa")
    .pattern(
      /(?!.*(0123|1234|2345|3456|4567|5678|6789|abcd|bcde|cdef|defg|efgh|fghi|ghij|hijk|ijkl|jklm|klmn|lmno|mnop|nopq|opqr|pqrs|qrst|rstu|stuv|tuvw|uvwx|vwxy|wxyz))/i,
      "no sequential characters"
    ) // No sequential characters
    .custom((value, helpers) => {
      // List of common passwords to disallow
      const commonPasswords = [
        "password123",
        "qwerty123",
        "admin123",
        "letmein",
      ];
      if (commonPasswords.includes(value.toLowerCase())) {
        return helpers.error("password.common");
      }
    })
    .required(),
  phone: Joi.string()
    .pattern(/^\d{10}$/)
    .required(),
});

// Schema for login request body
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  role: Joi.array()
    .items(Joi.string().valid("mentee", "mentor"))
    .default(["mentee"]),
});

// Schema for send OTP request body
const signUpOTPSchema = Joi.object({
  otp: Joi.string()
    .length(5)
    .pattern(/^[0-9]+$/)
    .required(),
  email: Joi.string().email().required(),
});

const googleAuthSchema = Joi.object({
  firstName: Joi.string()
    .pattern(/^[A-Za-z]+$/)
    .min(2)
    .max(50)
    .required(),
  lastName: Joi.string()
    .pattern(/^[A-Za-z]+$/)
    .min(1)
    .max(50)
    .required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  profilePicture: Joi.string().uri().allow(null, "").optional(),
}).unknown(false);

const resetPasswordSchema = Joi.object({
  password: Joi.string().pattern(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  ),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
});

//==>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
export function validateOTP(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { error } = Joi.string()
    .length(5)
    .pattern(/^[0-9]+$/)
    .required()
    .validate(req.body.otp);

  if (error) {
    res.status(400).json(new ApiError(400, error.details[0].message));
    return;
  }

  next();
}

export function validateUserSignUp(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { error } = signUpOTPSchema.validate(req.body, { abortEarly: false });

  if (error) {
    console.log("validation error");

    res.status(400).json(new ApiError(400, JSON.stringify(error.details)));
    return;
  }
  console.log("validation success");
  next();
}

export function validateSignUpOTP(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { error } = signupSchema.validate(req.body, { abortEarly: false });

  if (error) {
    console.log("validation error");

    res.status(400).json(new ApiError(400, JSON.stringify(error.details)));
    return;
  }
  console.log("validation success");
  next();
}

export function validateUserLogin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.log("login validation/......", req.body);

  const { error } = loginSchema.validate(req.body);
  console.log("login validation error/......", error);
  if (error) {
    res.status(400).json(new ApiError(400, error.details[0].message));
    return;
  }

  next();
}

export function validateEmail(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { error } = Joi.string().email().required().validate(req.body.email);

  if (error) {
    res.status(400).json(new ApiError(400, error.details[0].message));
    return;
  }
  console.log("email validation success");

  next();
}

export function validateReceivedOTP(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { error } = Joi.string()
    .length(5)
    .pattern(/^[0-9]+$/)
    .required()
    .validate(req.body.otp);

  if (error) {
    res.status(400).json(new ApiError(400, error.details[0].message));
    return;
  }

  next();
}

export function validateGoogleData(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.log("validatio > 1");
  const { error } = googleAuthSchema.validate(req.body, { abortEarly: false });
  console.log("validatio > 2");

  if (error) {
    console.log("google validation error");

    res.status(400).json(new ApiError(400, JSON.stringify(error.details)));
    return;
  }
  console.log("google validation success");
  next();
}

export function validateResetPassword(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.log("reset validatio > 1");
  const { error } = resetPasswordSchema.validate(req.body, {
    abortEarly: false,
  });
  console.log("reset validatio > 2");

  if (error) {
    console.log("rest validate errro", error);

    res.status(400).json(new ApiError(400, error.details[0].message));
    return;
  }

  next();
}
