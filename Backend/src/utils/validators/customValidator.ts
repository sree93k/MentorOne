import { Request, Response, NextFunction } from "express";

export interface ValidationRule {
  field: string;
  rules: {
    required?: boolean;
    type?: "string" | "email" | "number" | "boolean";
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    enum?: string[];
    custom?: (value: any) => boolean | string;
  };
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export class CustomValidator {
  static validate(rules: ValidationRule[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      const errors: ValidationError[] = [];

      for (const rule of rules) {
        const value = req.body[rule.field];
        const fieldErrors = this.validateField(rule.field, value, rule.rules);
        errors.push(...fieldErrors);
      }

      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Validation errors",
          errors,
        });
      }

      next();
    };
  }

  private static validateField(
    field: string,
    value: any,
    rules: ValidationRule["rules"]
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    // Required check
    if (
      rules.required &&
      (value === undefined || value === null || value === "")
    ) {
      errors.push({
        field,
        message: `${field} is required`,
        value,
      });
      return errors; // If required and missing, skip other validations
    }

    // Skip further validation if field is not provided and not required
    if (
      !rules.required &&
      (value === undefined || value === null || value === "")
    ) {
      return errors;
    }

    // Type validation
    if (rules.type) {
      switch (rules.type) {
        case "string":
          if (typeof value !== "string") {
            errors.push({
              field,
              message: `${field} must be a string`,
              value,
            });
          }
          break;
        case "email":
          if (typeof value !== "string" || !this.isValidEmail(value)) {
            errors.push({
              field,
              message: `${field} must be a valid email`,
              value,
            });
          }
          break;
        case "number":
          if (typeof value !== "number" && !Number.isFinite(Number(value))) {
            errors.push({
              field,
              message: `${field} must be a number`,
              value,
            });
          }
          break;
        case "boolean":
          if (typeof value !== "boolean") {
            errors.push({
              field,
              message: `${field} must be a boolean`,
              value,
            });
          }
          break;
      }
    }

    // String-specific validations
    if (typeof value === "string") {
      if (rules.minLength && value.trim().length < rules.minLength) {
        errors.push({
          field,
          message: `${field} must be at least ${rules.minLength} characters`,
          value,
        });
      }

      if (rules.maxLength && value.trim().length > rules.maxLength) {
        errors.push({
          field,
          message: `${field} must be no more than ${rules.maxLength} characters`,
          value,
        });
      }

      if (rules.pattern && !rules.pattern.test(value)) {
        errors.push({
          field,
          message: `${field} format is invalid`,
          value,
        });
      }
    }

    // Enum validation
    if (rules.enum && !rules.enum.includes(value)) {
      errors.push({
        field,
        message: `${field} must be one of: ${rules.enum.join(", ")}`,
        value,
      });
    }

    // Custom validation
    if (rules.custom) {
      const customResult = rules.custom(value);
      if (typeof customResult === "string") {
        errors.push({
          field,
          message: customResult,
          value,
        });
      } else if (customResult === false) {
        errors.push({
          field,
          message: `${field} validation failed`,
          value,
        });
      }
    }

    return errors;
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

// Helper function for common validation rules
export const ValidationRules = {
  email: (required: boolean = true): ValidationRule => ({
    field: "email",
    rules: {
      required,
      type: "email",
    },
  }),

  string: (
    field: string,
    required: boolean = true,
    minLength?: number,
    maxLength?: number
  ): ValidationRule => ({
    field,
    rules: {
      required,
      type: "string",
      minLength,
      maxLength,
    },
  }),

  enum: (
    field: string,
    values: string[],
    required: boolean = true
  ): ValidationRule => ({
    field,
    rules: {
      required,
      enum: values,
    },
  }),
};
