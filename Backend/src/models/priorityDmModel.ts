import mongoose, { Schema } from "mongoose";
import { EPriorityDM } from "../entities/priorityDMEntity";

const PriorityDMSchema: Schema = new Schema(
  {
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    mentorId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    menteeId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    content: {
      type: String, // Store HTML content from Quill editor
      required: true,
      trim: true,
    },
    pdfFiles: [
      {
        fileName: { type: String, required: true },
        s3Key: { type: String, required: true }, // S3 key for the PDF
        url: { type: String, required: true }, // S3 URL
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    mentorReply: {
      content: { type: String, trim: true }, // HTML content for mentor's reply
      pdfFiles: [
        {
          fileName: { type: String, required: true },
          s3Key: { type: String, required: true }, // S3 key for mentor's PDF
          url: { type: String, required: true }, // S3 URL
          uploadedAt: { type: Date, default: Date.now },
        },
      ],
      repliedAt: { type: Date },
    },
    status: {
      type: String,
      enum: ["pending", "replied", "closed"],
      default: "pending",
    },
    menteeTestimonial: {
      comment: { type: String, trim: true },
      rating: { type: Number, min: 1, max: 5 },
      submittedAt: { type: Date },
    },
    timestamp: { type: Date, default: Date.now },
  },
  {
    collection: "PriorityDM",
    timestamps: true,
  }
);

const PriorityDMModel = mongoose.model<EPriorityDM>(
  "PriorityDM",
  PriorityDMSchema
);

export default PriorityDMModel;
