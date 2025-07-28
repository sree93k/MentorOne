import mongoose, { Schema, model, Document } from "mongoose";
import { EBotRateLimit } from "../entities/EBotRateLimitEntity";
const BotRateLimitSchema: Schema<EBotRateLimit> = new Schema(
  {
    identifier: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    count: {
      type: Number,
      default: 0,
    },
    resetTime: {
      type: Date,
      required: true,
    },
  },
  {
    collection: "BotRateLimits",
    timestamps: true,
  }
);

const BotRateLimit = model<EBotRateLimit>("BotRateLimit", BotRateLimitSchema);

export default BotRateLimit;
