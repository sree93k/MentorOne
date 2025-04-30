// import mongoose, { Schema, model, Document } from "mongoose";

// interface EBlockedDate extends Document {
//   mentorId: mongoose.Types.ObjectId;
//   date: Date;
//   createdAt: Date;
// }

// const BlockedDateSchema = new Schema<EBlockedDate>({
//   mentorId: {
//     type: Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   date: {
//     type: Date,
//     required: true,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// // TTL index on the `date` field to expire at the end of the day
// BlockedDateSchema.index(
//   { date: 1 },
//   { expireAfterSeconds: 86400 } // Expire 24 hours after the `date` timestamp
// );

// export default model<EBlockedDate>("BlockedDate", BlockedDateSchema);
import mongoose, { Schema, model, Document } from "mongoose";

interface EBlockedDate extends Document {
  mentorId: mongoose.Types.ObjectId;
  date: Date;
  createdAt: Date;
}

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
