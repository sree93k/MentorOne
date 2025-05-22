import mongoose, { Schema, model, Document } from "mongoose";
import { EBlockedDate } from "../entities/blockedEntity";

const BlockedDateSchema = new Schema<EBlockedDate>({
  mentorId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  day: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Normalize `date` to end of day
BlockedDateSchema.pre("save", function (next) {
  if (this.date) {
    const endOfDay = new Date(this.date);
    endOfDay.setHours(23, 59, 59, 999);
    this.date = endOfDay;
  }
  next();
});

// TTL index to expire immediately after `date`
BlockedDateSchema.index({ date: 1 }, { expireAfterSeconds: 0 });

export default model<EBlockedDate>("BlockedDate", BlockedDateSchema);
