import mongoose, { Schema, Document } from "mongoose";
import { EOTP } from "../entities/OTPEntity";
import { object, required } from "joi";

const OTPSchema: Schema = new Schema(
  {
    email: { type: String, required: true }, // or use: userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
    otp: { type: String, required: true },
    user: {
      firstName: {
        type: String,
        required: [false, "First name is required"],
        trim: true,
      },
      lastName: {
        type: String,
        required: [false, "Last name is required"],
        trim: true,
      },
      email: {
        type: String,
        required: [false, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
      },
      password: {
        type: String,
        required: [false, "Password is required"],
      },
      phone: {
        type: Number,
        required: false,
      },
      gender: {
        type: String,
        enum: ["male", "female"],
        required: [false, "Gender is required"],
      },
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
    expirationTime: { type: Date, required: true },
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
