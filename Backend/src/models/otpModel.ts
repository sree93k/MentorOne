import mongoose, { Schema, Document } from "mongoose";
import { EOTP } from "../entities/OTPEntity";

const OTPSchema: Schema = new Schema(
  {
    email: { type: String, required: true },
    otp: { type: String, required: true },
    user: {
      firstName: { type: String, required: false, trim: true },
      lastName: { type: String, required: false, trim: true },
      email: {
        type: String,
        required: false,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
      },
      password: { type: String, required: false },
      phone: { type: Number, required: false },
      gender: { type: String, enum: ["male", "female"], required: false },
      role: {
        type: [String],
        enum: ["mentee", "mentor"],
        validate: {
          validator: (value: string[]) => value.length <= 2,
          message: "Role array cannot have more than 2 elements.",
        },
        default: ["mentee"],
      },
    },
    expirationTime: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 }, // TTL index to delete at expirationTime
    },
    createdAt: { type: Date, default: Date.now },
    attempts: { type: Number, default: 0 },
    role: { type: String, default: "user" },
  },
  {
    collection: "OTP",
    timestamps: true,
  }
);

OTPSchema.index({ expirationTime: 1 }, { expireAfterSeconds: 0 });

const OTPModel = mongoose.model<EOTP>("OTP", OTPSchema);

export default OTPModel;
