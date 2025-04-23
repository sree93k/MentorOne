import mongoose, { Schema } from "mongoose";
import { EService } from "../entities/serviceEntity";

const ServiceSchema: Schema = new Schema(
  {
    mentorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["1-1Call", "priorityDM", "DigitalProducts"],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    duration: {
      type: Number,
      min: 5,
    },
    longDescription: {
      type: String,
      trim: true,
      minlength: 20,
    },
    oneToOneType: {
      type: String,
      enum: ["chat", "video"],
    },
    digitalProductType: {
      type: String,
      enum: ["documents", "videoTutorials"],
    },
    fileUrl: {
      type: String,
    },
    exclusiveContent: [
      {
        season: { type: String },
        episodes: [
          {
            episode: { type: String },
            title: { type: String },
            description: { type: String },
            videoUrl: { type: String },
          },
        ],
      },
    ],
  },
  {
    collection: "Service",
    timestamps: true,
  }
);

const ServiceModel = mongoose.model<EService>("Service", ServiceSchema);

export default ServiceModel;
