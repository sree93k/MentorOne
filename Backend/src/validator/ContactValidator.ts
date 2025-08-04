import Joi from "joi";
import { Request, Response, NextFunction } from "express";

// =================== JOI VALIDATION SCHEMAS ===================

export const contactFormSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .pattern(/^[a-zA-Z\s\-\.\']+$/)
    .required()
    .messages({
      "string.min": "Name must be at least 2 characters long",
      "string.max": "Name cannot exceed 100 characters",
      "string.pattern.base":
        "Name can only contain letters, spaces, hyphens, dots, and apostrophes",
      "any.required": "Name is required",
    }),

  email: Joi.string().email().max(254).required().messages({
    "string.email": "Please provide a valid email address",
    "string.max": "Email address is too long",
    "any.required": "Email address is required",
  }),

  phone: Joi.string()
    .trim()
    .min(10)
    .max(20)
    .pattern(/^[\+]?[1-9][\d]{0,15}$/)
    .optional()
    .allow("")
    .messages({
      "string.min": "Phone number must be at least 10 characters",
      "string.max": "Phone number cannot exceed 20 characters",
      "string.pattern.base": "Please enter a valid phone number",
    }),

  subject: Joi.string().trim().min(5).max(200).required().messages({
    "string.min": "Subject must be at least 5 characters long",
    "string.max": "Subject cannot exceed 200 characters",
    "any.required": "Subject is required",
  }),

  inquiryType: Joi.string()
    .valid(
      "general",
      "mentorship",
      "courses",
      "partnership",
      "support",
      "feedback",
      "media"
    )
    .required()
    .messages({
      "any.only": "Please select a valid inquiry type",
      "any.required": "Inquiry type is required",
    }),

  message: Joi.string().trim().min(10).max(5000).required().messages({
    "string.min": "Message must be at least 10 characters long",
    "string.max": "Message cannot exceed 5000 characters",
    "any.required": "Message is required",
  }),

  preferredContact: Joi.string()
    .valid("email", "phone", "whatsapp")
    .required()
    .messages({
      "any.only": "Please select a valid contact preference",
      "any.required": "Preferred contact method is required",
    }),

  agreeToPrivacy: Joi.boolean().valid(true).required().messages({
    "any.only": "You must agree to the privacy policy",
    "any.required": "Privacy policy agreement is required",
  }),

  attachments: Joi.array()
    .items(Joi.string().uri())
    .max(5)
    .optional()
    .messages({
      "array.max": "Maximum 5 attachments allowed",
      "string.uri": "Attachment must be a valid URL",
    }),
});

export const messageIdSchema = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid message ID format",
      "any.required": "Message ID is required",
    }),
});

export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).max(1000).default(1).messages({
    "number.min": "Page must be at least 1",
    "number.max": "Page cannot exceed 1000",
  }),

  limit: Joi.number().integer().min(1).max(100).default(20).messages({
    "number.min": "Limit must be at least 1",
    "number.max": "Limit cannot exceed 100",
  }),

  sortBy: Joi.string()
    .valid(
      "createdAt",
      "updatedAt",
      "priority",
      "status",
      "name",
      "subject",
      "inquiryType"
    )
    .default("createdAt")
    .messages({
      "any.only": "Invalid sort field",
    }),

  sortOrder: Joi.string().valid("asc", "desc").default("desc").messages({
    "any.only": "Sort order must be asc or desc",
  }),

  search: Joi.string().trim().min(2).max(100).optional().messages({
    "string.min": "Search query must be at least 2 characters",
    "string.max": "Search query cannot exceed 100 characters",
  }),

  status: Joi.string()
    .valid("new", "in_progress", "resolved", "archived")
    .optional()
    .messages({
      "any.only": "Invalid status value",
    }),

  inquiryType: Joi.string()
    .valid(
      "general",
      "mentorship",
      "courses",
      "partnership",
      "support",
      "feedback",
      "media"
    )
    .optional()
    .messages({
      "any.only": "Invalid inquiry type",
    }),

  priority: Joi.string().valid("low", "medium", "high").optional().messages({
    "any.only": "Invalid priority value",
  }),

  isRegisteredUser: Joi.boolean().optional().messages({
    "boolean.base": "isRegisteredUser must be true or false",
  }),

  startDate: Joi.date().iso().optional().messages({
    "date.format": "Invalid start date format, use ISO 8601",
  }),

  endDate: Joi.date().iso().min(Joi.ref("startDate")).optional().messages({
    "date.format": "Invalid end date format, use ISO 8601",
    "date.min": "End date must be after start date",
  }),
});

export const updateMessageSchema = Joi.object({
  status: Joi.string()
    .valid("new", "in_progress", "resolved", "archived")
    .optional()
    .messages({
      "any.only": "Invalid status value",
    }),

  priority: Joi.string().valid("low", "medium", "high").optional().messages({
    "any.only": "Invalid priority value",
  }),

  assignedTo: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      "string.pattern.base": "Invalid admin ID format",
    }),

  isRead: Joi.boolean().optional().messages({
    "boolean.base": "isRead must be true or false",
  }),

  isSeen: Joi.boolean().optional().messages({
    "boolean.base": "isSeen must be true or false",
  }),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update",
  });

export const responseSchema = Joi.object({
  message: Joi.string().trim().min(1).max(2000).required().messages({
    "string.min": "Response message cannot be empty",
    "string.max": "Response message cannot exceed 2000 characters",
    "any.required": "Response message is required",
  }),
});

export const internalNoteSchema = Joi.object({
  note: Joi.string().trim().min(1).max(1000).required().messages({
    "string.min": "Internal note cannot be empty",
    "string.max": "Internal note cannot exceed 1000 characters",
    "any.required": "Internal note is required",
  }),
});

export const bulkOperationSchema = Joi.object({
  ids: Joi.array()
    .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
    .min(1)
    .max(100)
    .required()
    .messages({
      "array.min": "At least one message ID is required",
      "array.max": "Maximum 100 message IDs allowed",
      "string.pattern.base": "Invalid message ID format",
      "any.required": "Message IDs are required",
    }),

  status: Joi.string()
    .valid("new", "in_progress", "resolved", "archived")
    .optional()
    .messages({
      "any.only": "Invalid status value",
    }),
});

// =================== FIXED VALIDATION MIDDLEWARE FUNCTIONS ===================

const createValidationMiddleware = (
  schema: Joi.ObjectSchema,
  target: "body" | "params" | "query" = "body"
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const dataToValidate =
      target === "body"
        ? req.body
        : target === "params"
        ? req.params
        : req.query;

    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    });

    if (error) {
      const errorMessages = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
        value: detail.context?.value,
      }));

      res.status(400).json({
        success: false,
        message: "Validation errors occurred",
        errors: errorMessages,
        errorCount: errorMessages.length,
      });
      return; // ✅ Fixed: Return void instead of response
    }

    // Update the request object with validated and sanitized data
    if (target === "body") {
      req.body = value;
    } else if (target === "params") {
      req.params = value;
    } else if (target === "query") {
      req.query = value;
    }

    next(); // ✅ Fixed: Call next() properly
  };
};

// =================== EXPORTED VALIDATION MIDDLEWARES ===================

export const validateContactForm = createValidationMiddleware(
  contactFormSchema,
  "body"
);
export const validateMessageId = createValidationMiddleware(
  messageIdSchema,
  "params"
);
export const validatePagination = createValidationMiddleware(
  paginationSchema,
  "query"
);

export const validateUpdateMessage = [
  createValidationMiddleware(messageIdSchema, "params"),
  createValidationMiddleware(updateMessageSchema, "body"),
];

export const validateResponse = [
  createValidationMiddleware(messageIdSchema, "params"),
  createValidationMiddleware(responseSchema, "body"),
];

export const validateInternalNote = [
  createValidationMiddleware(messageIdSchema, "params"),
  createValidationMiddleware(internalNoteSchema, "body"),
];

export const validateBulkOperation = createValidationMiddleware(
  bulkOperationSchema,
  "body"
);
