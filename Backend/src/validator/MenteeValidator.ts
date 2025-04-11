import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../middlewares/errorHandler";

const WelcomeFormSchema = Joi.object({
  id: Joi.string().required().messages({
    "any.required": "User ID is required",
  }),
  isUpdate: Joi.boolean().default(false), // Defaults to false if not provided
  userType: Joi.string()
    .valid("school", "college", "fresher", "professional")
    .required() // Always required, even during updates
    .messages({
      "any.required": "User type is required",
      "string.valid":
        "User type must be one of: school, college, fresher, professional",
    }),

  // **School-specific fields**
  schoolName: Joi.string().when("isUpdate", {
    is: false,
    then: Joi.when("userType", {
      is: "school",
      then: Joi.string().trim().required().min(1).messages({
        "any.required": "School name is required for school students",
        "string.empty": "School name cannot be empty",
        "string.min": "School name cannot be empty",
      }),
      otherwise: Joi.forbidden().messages({
        "any.unknown": "School name is not allowed for non-school students",
      }),
    }),
    otherwise: Joi.string().optional().allow(""), // Allow empty strings during update
  }),
  class: Joi.string().when("isUpdate", {
    is: false,
    then: Joi.when("userType", {
      is: "school",
      then: Joi.string()
        .valid("1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12")
        .required()
        .messages({
          "string.valid": "Current class must be between 1 and 12",
          "any.required": "Current class is required for school students",
        }),
      otherwise: Joi.forbidden().messages({
        "any.unknown": "Current class is not allowed for non-school students",
      }),
    }),
    otherwise: Joi.string().optional().allow(""), // Allow empty strings during update
  }),

  // **College/Fresher-specific fields**
  course: Joi.string().when("isUpdate", {
    is: false,
    then: Joi.when("userType", {
      is: Joi.any().valid("college", "fresher"),
      then: Joi.string().trim().required().min(0).messages({
        "any.required": "Course is required for college students or freshers",
        "string.empty": "Course cannot be empty",
        "string.min": "Course cannot be empty",
      }),
      otherwise: Joi.forbidden().messages({
        "any.unknown": "Course is not allowed for non-college/fresher students",
      }),
    }),
    otherwise: Joi.string().optional().allow(""), // Allow empty strings during update
  }),
  specializedIn: Joi.string().when("isUpdate", {
    is: false,
    then: Joi.when("userType", {
      is: Joi.any().valid("college", "fresher"),
      then: Joi.string().trim().required().min(0).messages({
        "any.required":
          "Specialization is required for college students or freshers",
        "string.empty": "Specialization cannot be empty",
        "string.min": "Specialization cannot be empty",
      }),
      otherwise: Joi.forbidden().messages({
        "any.unknown":
          "Specialization is not allowed for non-college/fresher students",
      }),
    }),
    otherwise: Joi.string().optional().allow(""), // Allow empty strings during update
  }),
  collegeName: Joi.string().when("isUpdate", {
    is: false,
    then: Joi.when("userType", {
      is: Joi.any().valid("college", "fresher"),
      then: Joi.string().trim().required().min(0).messages({
        "any.required":
          "College name is required for college students or freshers",
        "string.empty": "College name cannot be empty",
        "string.min": "College name cannot be empty",
      }),
      otherwise: Joi.forbidden().messages({
        "any.unknown":
          "College name is not allowed for non-college/fresher students",
      }),
    }),
    otherwise: Joi.string().optional().allow(""), // Allow empty strings during update
  }),
  startDate: Joi.string().when("isUpdate", {
    is: false,
    then: Joi.when("userType", {
      is: Joi.any().valid("college", "fresher"),
      then: Joi.string()
        .allow("")
        .regex(/^\d{4}$/)
        .messages({
          "string.pattern.base": "Start year must be a valid 4-digit year",
          "any.required":
            "Start year is required for college students or freshers",
          "string.empty": "Start year cannot be empty",
        }),
      otherwise: Joi.forbidden().messages({
        "any.unknown":
          "Start year is not allowed for non-college/fresher students",
      }),
    }),
    otherwise: Joi.string().optional().allow(""), // Allow empty strings during update
  }),
  endDate: Joi.string().when("isUpdate", {
    is: false,
    then: Joi.when("userType", {
      is: Joi.any().valid("college", "fresher"),
      then: Joi.string()
        .allow("")
        .regex(/^\d{4}$/)
        .messages({
          "string.pattern.base": "End year must be a valid 4-digit year",
          "any.required":
            "End year is required for college students or freshers",
          "string.empty": "End year cannot be empty",
        }),
      otherwise: Joi.forbidden().messages({
        "any.unknown":
          "End year is not allowed for non-college/fresher students",
      }),
    }),
    otherwise: Joi.string().optional().allow(""), // Allow empty strings during update
  }),

  // **Professional-specific fields**
  experience: Joi.string().when("isUpdate", {
    is: false,
    then: Joi.when("userType", {
      is: "professional",
      then: Joi.string().valid("0-1", "1-3", "3-5", "5+").required().messages({
        "string.valid": "Experience must be one of: 0-1, 1-3, 3-5, 5+",
        "any.required": "Experience is required for professionals",
      }),
      otherwise: Joi.forbidden().messages({
        "any.unknown": "Experience is not allowed for non-professionals",
      }),
    }),
    otherwise: Joi.string().optional().allow(""), // Allow empty strings during update
  }),
  jobRole: Joi.string().when("isUpdate", {
    is: false,
    then: Joi.when("userType", {
      is: "professional",
      then: Joi.string().trim().required().min(1).messages({
        "any.required": "Job role is required for professionals",
        "string.empty": "Job role cannot be empty",
        "string.min": "Job role cannot be empty",
      }),
      otherwise: Joi.forbidden().messages({
        "any.unknown": "Job role is not allowed for non-professionals",
      }),
    }),
    otherwise: Joi.string().optional().allow(""), // Allow empty strings during update
  }),
  company: Joi.string().when("isUpdate", {
    is: false,
    then: Joi.when("userType", {
      is: "professional",
      then: Joi.string().trim().required().min(1).messages({
        "any.required": "Company is required for professionals",
        "string.empty": "Company cannot be empty",
        "string.min": "Company cannot be empty",
      }),
      otherwise: Joi.forbidden().messages({
        "any.unknown": "Company is not allowed for non-professionals",
      }),
    }),
    otherwise: Joi.string().optional().allow(""), // Allow empty strings during update
  }),
  currentlyWorking: Joi.boolean().when("isUpdate", {
    is: false,
    then: Joi.when("userType", {
      is: "professional",
      then: Joi.boolean().required().messages({
        "any.required":
          "Currently working status is required for professionals",
      }),
      otherwise: Joi.forbidden().messages({
        "any.unknown": "Currently working is not allowed for non-professionals",
      }),
    }),
    otherwise: Joi.boolean().optional(), // Optional during update
  }),

  // **Common fields**
  city: Joi.string()
    .trim()
    .when("isUpdate", {
      is: false,
      then: Joi.string().required().min(0).messages({
        "any.required": "City is required",
        "string.empty": "City cannot be empty",
        "string.min": "City cannot be empty",
      }),
      otherwise: Joi.string().optional().allow(""), // Allow empty strings during update
    }),
  careerGoals: Joi.string()
    .valid("Grow in my current career", "Transition into a new career")
    .required() // Always required
    .messages({
      "string.valid":
        "Career goal must be one of: Grow in my current career, Transition into a new career",
      "any.required": "Career goal is required",
    }),
  interestedNewcareer: Joi.array()
    .items(Joi.string().trim())
    .min(1)
    .required() // Always required
    .messages({
      "array.min": "At least one career interest is required",
      "any.required": "Career interests are required",
    }),
  goals: Joi.array()
    .items(
      Joi.string().valid(
        "To find a Job",
        "Compete & Upskill",
        "To Host an Event",
        "To be a Mentor"
      )
    )
    .min(1)
    .required() // Always required
    .messages({
      "array.min": "At least one option must be selected",
      "string.valid":
        "Selected options must be one of: To find a Job, Compete & Upskill, To Host an Event, To be a Mentor",
      "any.required": "Selected options are required",
    }),
  activated: Joi.boolean().default(true), // Always present, defaults to true
}).unknown(false); // Disallow unknown fields

export function welcomeFormValidator(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.log("Form Validation - Request body:", req.body);
  console.log("isUpdate:", req.body.isUpdate); // Log to verify isUpdate value
  const { error } = WelcomeFormSchema.validate(req.body, { abortEarly: false });

  if (error) {
    console.log("Form Validation - Error:", error.details);
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(", ");
    res.status(400).json(new ApiError(400, "Validation Error", errorMessage));
    return;
  }

  console.log("Form Validation - Success");
  next();
}

// // validator/MenteeValidator.ts
// import Joi from "joi";
// import { Request, Response, NextFunction } from "express";
// import { ApiError } from "../middlewares/errorHandler";

// const WelcomeFormSchema = Joi.object({
//   id: Joi.string().required().messages({
//     "any.required": "User ID is required",
//   }),
//   userType: Joi.string()
//     .valid("school", "college", "fresher", "professional")
//     .required()
//     .messages({
//       "string.valid":
//         "User type must be one of: school, college, fresher, professional",
//       "any.required": "User type is required",
//     }),
//   // School-specific fields
//   schoolName: Joi.string().when("userType", {
//     is: "school",
//     then: Joi.string().trim().required().messages({
//       "any.required": "School name is required for school students",
//       "string.empty": "School name cannot be empty",
//     }),
//     otherwise: Joi.forbidden().messages({
//       "any.unknown": "School name is not allowed for non-school students",
//     }),
//   }),
//   class: Joi.string().when("userType", {
//     is: "school",
//     then: Joi.string()
//       .valid("1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12")
//       .required()
//       .messages({
//         "string.valid": "Current class must be between 1 and 12",
//         "any.required": "Current class is required for school students",
//       }),
//     otherwise: Joi.forbidden().messages({
//       "any.unknown": "Current class is not allowed for non-school students",
//     }),
//   }),
//   // College/Fresher-specific fields
//   course: Joi.string().when("userType", {
//     is: Joi.any().valid("college", "fresher"),
//     then: Joi.string().trim().required().messages({
//       "any.required": "Course is required for college students or freshers",
//       "string.empty": "Course cannot be empty",
//     }),
//     otherwise: Joi.forbidden().messages({
//       "any.unknown": "Course is not allowed for non-college/fresher students",
//     }),
//   }),
//   specializedIn: Joi.string().when("userType", {
//     is: Joi.any().valid("college", "fresher"),
//     then: Joi.string().trim().required().messages({
//       "any.required":
//         "Specialization is required for college students or freshers",
//       "string.empty": "Specialization cannot be empty",
//     }),
//     otherwise: Joi.forbidden().messages({
//       "any.unknown":
//         "Specialization is not allowed for non-college/fresher students",
//     }),
//   }),
//   collegeName: Joi.string().when("userType", {
//     is: Joi.any().valid("college", "fresher"),
//     then: Joi.string().trim().required().messages({
//       "any.required":
//         "College name is required for college students or freshers",
//       "string.empty": "College name cannot be empty",
//     }),
//     otherwise: Joi.forbidden().messages({
//       "any.unknown":
//         "College name is not allowed for non-college/fresher students",
//     }),
//   }),
//   startDate: Joi.string().when("userType", {
//     is: Joi.any().valid("college", "fresher"),
//     then: Joi.string()
//       .regex(/^\d{4}$/)
//       .required()
//       .messages({
//         "string.pattern.base": "Start year must be a valid 4-digit year",
//         "any.required":
//           "Start year is required for college students or freshers",
//       }),
//     otherwise: Joi.forbidden().messages({
//       "any.unknown":
//         "Start year is not allowed for non-college/fresher students",
//     }),
//   }),
//   endDate: Joi.string().when("userType", {
//     is: Joi.any().valid("college", "fresher"),
//     then: Joi.string()
//       .regex(/^\d{4}$/)
//       .required()
//       .messages({
//         "string.pattern.base": "End year must be a valid 4-digit year",
//         "any.required": "End year is required for college students or freshers",
//       }),
//     otherwise: Joi.forbidden().messages({
//       "any.unknown": "End year is not allowed for non-college/fresher students",
//     }),
//   }),
//   // Professional-specific fields
//   experience: Joi.string().when("userType", {
//     is: "professional",
//     then: Joi.string().valid("0-1", "1-3", "3-5", "5+").required().messages({
//       "string.valid": "Experience must be one of: 0-1, 1-3, 3-5, 5+",
//       "any.required": "Experience is required for professionals",
//     }),
//     otherwise: Joi.forbidden().messages({
//       "any.unknown": "Experience is not allowed for non-professionals",
//     }),
//   }),
//   jobRole: Joi.string().when("userType", {
//     is: "professional",
//     then: Joi.string().trim().required().messages({
//       "any.required": "Job role is required for professionals",
//       "string.empty": "Job role cannot be empty",
//     }),
//     otherwise: Joi.forbidden().messages({
//       "any.unknown": "Job role is not allowed for non-professionals",
//     }),
//   }),
//   company: Joi.string().when("userType", {
//     is: "professional",
//     then: Joi.string().trim().required().messages({
//       "any.required": "Company is required for professionals",
//       "string.empty": "Company cannot be empty",
//     }),
//     otherwise: Joi.forbidden().messages({
//       "any.unknown": "Company is not allowed for non-professionals",
//     }),
//   }),
//   currentlyWorking: Joi.boolean().when("userType", {
//     is: "professional",
//     then: Joi.boolean().required().messages({
//       "any.required": "Currently working status is required for professionals",
//     }),
//     otherwise: Joi.forbidden().messages({
//       "any.unknown": "Currently working is not allowed for non-professionals",
//     }),
//   }),
//   // Common fields
//   city: Joi.string().trim().required().messages({
//     "any.required": "City is required",
//     "string.empty": "City cannot be empty",
//   }),
//   careerGoals: Joi.string()
//     .valid("Grow in my current career", "Transition into a new career")
//     .required()
//     .messages({
//       "string.valid":
//         "Career goal must be one of: Grow in my current career, Transition into a new career",
//       "any.required": "Career goal is required",
//     }),
//   interestedNewcareer: Joi.array()
//     .items(Joi.string().trim())
//     .min(1)
//     .required()
//     .messages({
//       "array.min": "At least one career interest is required",
//       "any.required": "Career interests are required",
//     }),
//   goals: Joi.array()
//     .items(
//       Joi.string().valid(
//         "To find a Job",
//         "Compete & Upskill",
//         "To Host an Event",
//         "To be a Mentor"
//       )
//     )
//     .min(1)
//     .required()
//     .messages({
//       "array.min": "At least one option must be selected",
//       "string.valid":
//         "Selected options must be one of: To find a Job, Compete & Upskill, To Host an Event, To be a Mentor",
//       "any.required": "Selected options are required",
//     }),
//   activated: Joi.boolean().default(true),
// }).unknown(false); // Disallow unknown fields

// export function welcomeFormValidator(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): void {
//   console.log("Form Validation - Request body:", req.body);
//   const { error } = WelcomeFormSchema.validate(req.body, { abortEarly: false });

//   if (error) {
//     console.log("Form Validation - Error:", error.details);
//     const errorMessage = error.details
//       .map((detail) => detail.message)
//       .join(", ");
//     res.status(400).json(new ApiError(400, "Validation Error", errorMessage));
//     return;
//   }

//   console.log("Form Validation - Success");
//   next();
// }
