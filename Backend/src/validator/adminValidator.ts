import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../middlewares/errorHandler";

const adminLoginSchema = Joi.object({
  adminEmail: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email",
    "any.required": "Email is required",
  }),
  adminPassword: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
});

export function validateAdminLogin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.log("Validation - Request body:", req.body);
  const { error } = adminLoginSchema.validate(req.body, { abortEarly: false });

  if (error) {
    console.log("Validation - Error:", error.details);
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(", ");
    res.status(400).json(new ApiError(400, "Validation Error", errorMessage));
    return;
  }

  console.log("Validation - Success");
  next();
}
