// import mongoose, { model,Schema,Document } from "mongoose";
// import { IFAQ } from "../entities/FAQEntity";

// const FaqSchema:Schema = new Schema({
//     studentId:{type:mongoose.Types.ObjectId,required:true},
//     question:{type:String,required:true},
//     answer:{type:String}

// })

// export const FAQ= model<IFAQ & Document>('FAQ',FaqSchema)

// Backend: models/FAQ.ts
import { Schema, model } from "mongoose";
import { EFAQ } from "../entities/EFAQEntity";
const FAQSchema: Schema<EFAQ> = new Schema(
  {
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "FAQCategory",
      required: true,
    },
    question: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      required: true,
    },
    keywords: {
      type: [String],
      default: [],
      index: true, // For faster searching
    },
    priority: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
    targetUsers: {
      type: [String],
      enum: ["anonymous", "mentee", "mentor"],
      default: ["anonymous", "mentee", "mentor"],
    },
    analytics: {
      views: { type: Number, default: 0 },
      helpful: { type: Number, default: 0 },
      notHelpful: { type: Number, default: 0 },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    collection: "FAQs",
    timestamps: true,
  }
);

// Add text index for search
FAQSchema.index({ question: "text", keywords: "text", answer: "text" });

export const FAQ = model<EFAQ>("FAQ", FAQSchema);
