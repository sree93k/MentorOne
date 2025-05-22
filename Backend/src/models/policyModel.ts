import { EPolicy } from "../entities/policyEntity";
import mongoose, { Schema, model } from "mongoose";

const PolicySchema = new Schema<EPolicy>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  reschedulePeriod: {
    value: { type: Number, required: true, min: 0 },
    unit: { type: String, enum: ["hours", "days"], required: true },
  },
  bookingPeriod: {
    value: { type: Number, required: true, min: 0 },
    unit: { type: String, enum: ["hours", "days"], required: true },
  },
  noticePeriod: {
    value: { type: Number, required: true, min: 0 },
    unit: { type: String, enum: ["minutes"], required: true },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Policy = model<EPolicy>("Policy", PolicySchema);

export default Policy;
