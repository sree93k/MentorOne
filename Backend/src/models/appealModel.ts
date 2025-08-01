import mongoose, { Schema } from "mongoose";
import { EAppeal } from "../entities/appealEntity";

const appealSchema = new Schema<EAppeal>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      index: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    appealMessage: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    category: {
      type: String,
      required: true,
      enum: ["wrongful_block", "account_hacked", "misunderstanding", "other"],
      default: "other",
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "under_review", "approved", "rejected"],
      default: "pending",
      index: true,
    },

    // Enhanced tracking fields
    blockEventId: {
      type: String,
      required: true,
      index: true,
    },
    appealCount: {
      type: Number,
      default: 1,
      min: 1,
      max: 2,
    },
    previousAppealId: {
      type: String,
      index: true,
    },
    canReappeal: {
      type: Boolean,
      default: true,
    },

    // Admin review fields
    reviewedBy: {
      type: String,
      index: true,
    },
    reviewedAt: {
      type: Date,
      index: true,
    },
    adminResponse: {
      type: String,
      maxlength: 2000,
    },
    adminNotes: {
      type: String,
      maxlength: 1000,
    },

    // Metadata
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient querying
appealSchema.index(
  { userId: 1, blockEventId: 1, appealCount: 1 },
  { unique: true }
);
appealSchema.index({ submittedAt: -1, status: 1 });
appealSchema.index({ email: 1, status: 1 });
appealSchema.index({ category: 1, status: 1 });

// Text search index
appealSchema.index({
  firstName: "text",
  lastName: "text",
  email: "text",
  appealMessage: "text",
});

// ✅ Create the model
const AppealModel = mongoose.model<EAppeal>("Appeal", appealSchema);

// ✅ Debug log
console.log("✅ AppealModel created successfully:", {
  modelName: AppealModel.modelName,
  collection: AppealModel.collection.name,
});

// ✅ Export as default
export default AppealModel;
