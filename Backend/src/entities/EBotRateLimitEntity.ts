import mongoose, { Schema, model, Document } from "mongoose";

export interface EBotRateLimit extends Document {
  _id: mongoose.Types.ObjectId;
  identifier: string; // IP address or sessionId
  count: number;
  resetTime: Date;
  createdAt: Date;
  updatedAt: Date;
}
