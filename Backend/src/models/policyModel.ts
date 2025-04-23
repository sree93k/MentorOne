const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MentorPolicySchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true, // One policy per mentor
  },
  rescheduleWindow: {
    value: { type: Number, required: true, min: 0 },
    unit: { type: String, enum: ["hours", "days"], required: true },
  },
  bookingWindow: {
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
