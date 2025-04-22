import mongoose, { Schema } from "mongoose";
import { IPriorityDM } from "../entities/priorityDMEntity";

const PriorityDMSchema: Schema = new Schema(
  {
    mentorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    menteeId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    mentorFeedback: {
      type: String,
      trim: true,
    },
    menteeTestimonial: {
      comment: { type: String, trim: true },
      rating: { type: Number, min: 1, max: 5 },
    },
    status: {
      type: String,
      enum: ["pending", "replied"],
      default: "pending",
    },
    timestamp: { type: Date, default: Date.now },
  },
  {
    collection: "PriorityDM",
    timestamps: true,
  }
);

const PriorityDMModel = mongoose.model<IPriorityDM>(
  "PriorityDM",
  PriorityDMSchema
);

export default PriorityDMModel;
