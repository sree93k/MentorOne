import mongoose, { Schema } from "mongoose";
import { IService } from "../entities/serviceEntity";

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
    serviceId: {
      type: Schema.Types.ObjectId,
      refPath: "type", // Dynamically references OnlineService or DigitalProduct based on type
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
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    collection: "Service",
    timestamps: true,
  }
);

const ServiceModel = mongoose.model<IService>("Service", ServiceSchema);

export default ServiceModel;
