import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";
import AppError from "../errors/appError";
import { HttpStatus } from "../constants/HttpStatus";

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
  logger.info("Validating admin login request", { body: req.body });
  const { error } = adminLoginSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(", ");
    logger.warn("Validation failed", { error: errorMessage });
    throw new AppError(errorMessage, HttpStatus.BAD_REQUEST, "warn");
  }

  logger.info("Validation successful");
  next();
}
