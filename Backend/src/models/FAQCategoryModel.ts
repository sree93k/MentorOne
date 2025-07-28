// Backend: models/FAQ.ts
import mongoose, { Schema, model, Document } from "mongoose";
import { EFAQCategory } from "../entities/EFAQCategoryEntity";

const FAQCategorySchema: Schema<EFAQCategory> = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: false,
    },
    priority: {
      type: Number,
      default: 0,
    },
    targetUsers: {
      type: [String],
      enum: ["anonymous", "mentee", "mentor"],
      default: ["anonymous", "mentee", "mentor"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    collection: "FAQCategories",
    timestamps: true,
  }
);

export const FAQCategory = model<EFAQCategory>(
  "FAQCategory",
  FAQCategorySchema
);
