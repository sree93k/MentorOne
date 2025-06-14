// validator/MentorValidator.ts
import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../middlewares/errorHandler";

const MentorFormSchema = Joi.object({
  userType: Joi.string()
    .valid("school", "college", "fresher", "professional")
    .required()
    .messages({
      "string.valid":
        "User type must be one of: school, college, fresher, professional",
      "any.required": "User type is required",
    }),

  // School-specific fields
  schoolName: Joi.string().when("userType", {
    is: "school",
    then: Joi.string().trim().required().min(0).messages({
      "any.required": "School name is required for school mentors",
      "string.empty": "School name cannot be empty",
    }),
    otherwise: Joi.optional().allow(""),
  }),
  class: Joi.string().when("userType", {
    is: "school",
    then: Joi.string()
      .valid("8", "9", "10", "11", "12") // Match AboutStep options
      .required()
      .messages({
        "string.valid": "Current class must be one of: 8, 9, 10, 11, 12",
        "any.required": "Current class is required for school mentors",
      }),
    otherwise: Joi.optional().allow(""),
  }),

  // College/fresher-specific fields
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

  // Professional-specific fields
  company: Joi.string().when("userType", {
    is: "professional",
    then: Joi.string().trim().required().messages({
      "any.required": "Company is required for professional mentors",
      "string.empty": "Company cannot be empty",
    }),
    otherwise: Joi.optional().allow(""),
  }),
  jobRole: Joi.string().when("userType", {
    is: "professional",
    then: Joi.string().trim().required().messages({
      "any.required": "Job role is required for professional mentors",
      "string.empty": "Job role cannot be empty",
    }),
    otherwise: Joi.optional().allow(""),
  }),
  experience: Joi.string().when("userType", {
    is: "professional",
    then: Joi.string().valid("0-2", "2-5", "5-10", "10+").required().messages({
      "string.valid": "Experience must be one of: 0-2, 2-5, 5-10, 10+",
      "any.required": "Experience is required for professional mentors",
    }),
    otherwise: Joi.optional().allow(""),
  }),
  startDate: Joi.string().when("userType", {
    is: "professional",
    then: Joi.string()
      .regex(/^\d{4}$/)
      .required()
      .messages({
        "string.pattern.base": "Start date must be a valid 4-digit year",
        "any.required": "Start date is required for professional mentors",
      }),
    otherwise: Joi.optional().allow(""),
  }),
  endDate: Joi.string().when("userType", {
    is: "professional",
    then: Joi.string()
      .regex(/^\d{4}$/)
      .optional()
      .allow("")
      .messages({
        "string.pattern.base": "End date must be a valid 4-digit year",
      }),
    otherwise: Joi.optional().allow(""),
  }),
  currentlyWorking: Joi.boolean().optional(),

  // Common fields
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
  skills: Joi.array().items(Joi.string().trim()).min(1).required().messages({
    "array.min": "At least one skill is required",
    "any.required": "Skills are required",
  }),
  bio: Joi.string().trim().required().messages({
    "any.required": "Bio is required",
    "string.empty": "Bio cannot be empty",
  }),
  mentorMotivation: Joi.string().trim().required().messages({
    "any.required": "Mentor motivation is required",
    "string.empty": "Mentor motivation cannot be empty",
  }),
  careerGoals: Joi.string()
    .valid("Grow in my current career", "Transition into a new career")
    .allow("")
    .required() // Always required
    .messages({
      "string.valid":
        "Career goal must be one of: Grow in my current career, Transition into a new career",
      "any.required": "Career goal is required",
    }),
  interestedNewcareer: Joi.array()
    .items(Joi.string().trim())
    .min(1)
    .required()
    .messages({
      "array.min": "At least one mentoring goal must be selected",
      "any.required": "Mentoring goals are required",
    }),
  id: Joi.string().trim().required().messages({
    "any.required": "Id is required",
    "string.empty": "Id cannot be empty",
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
    .allow("")
    .min(0)
    .required() // Always required
    .messages({
      "array.min": "At least one option must be selected",
      "string.valid":
        "Selected options must be one of: To find a Job, Compete & Upskill, To Host an Event, To be a Mentor",
      "any.required": "Selected options are required",
    }),
  // Optional fields
  linkedinUrl: Joi.string().trim().uri().optional().allow("").messages({
    "string.uri": "LinkedIn URL must be a valid URI",
  }),
  youtubeLink: Joi.string().trim().uri().optional().allow("").messages({
    "string.uri": "YouTube link must be a valid URI",
  }),
  portfolio: Joi.string().trim().uri().optional().allow("").messages({
    "string.uri": "Portfolio must be a valid URI",
  }),
  selfIntro: Joi.string().trim().optional().allow(""),
  featuredArticle: Joi.string().trim().optional().allow(""),
  achievements: Joi.string().trim().optional().allow(""),
  imageUrl: Joi.string().trim().uri().optional().allow("").messages({
    "string.uri": "Image URL must be a valid URI",
  }),
  imageFile: Joi.object().allow(""),
}).unknown(false); // Keep this to enforce strict validation

export function welcomeFormValidator(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.log("Mentor Form Validation - Request body:", req.body);
  const { error } = MentorFormSchema.validate(req.body, { abortEarly: false });

  if (error) {
    console.log("Mentor Form Validation - Error:", error.details);
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(", ");
    res.status(400).json(new ApiError(400, "Validation Error", errorMessage));
    return;
  }

  console.log("Mentor Form Validation - Success");
  next();
}
