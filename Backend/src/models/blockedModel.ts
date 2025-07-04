import mongoose, { Schema } from "mongoose";
import { EBlockedDate } from "../entities/blockedEntity";

const BlockedDateSchema: Schema = new Schema(
  {
    mentorId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    slotTime: {
      type: String,
      required: false,
    },
    day: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["blocked", "booking"],
      default: "blocked",
      required: false,
    },
  },
  {
    collection: "BlockedDate",
    timestamps: true,
  }
);

// Normalize `date` to end of day before saving
BlockedDateSchema.pre("save", function (next) {
  if (this.date) {
    const endOfDay = new Date(this?.date);
    endOfDay.setHours(23, 59, 59, 999);
    this.date = endOfDay;
  }
  next();
});

// TTL index to expire documents when the `date` is reached
BlockedDateSchema.index({ date: 1 }, { expireAfterSeconds: 0 });

const BlockedDate = mongoose.model<EBlockedDate>(
  "BlockedDate",
  BlockedDateSchema
);

export default BlockedDate;
