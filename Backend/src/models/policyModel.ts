import mongoose, { Schema, model, Document } from "mongoose";
import { EUsers } from "../entities/userEntity";

const PolicySchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true, // One policy per mentor
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

const Policy = model("Policy", PolicySchema);

export default Policy;
