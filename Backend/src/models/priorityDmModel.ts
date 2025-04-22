import mongoose, { Schema } from "mongoose";

const MessagesSchema = new Schema({
  mentorId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  menteeId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  bookingId: {
    type: Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
  },
  mentorFeedback: {
    type: String,
    trim: true,
  },
  menteeTestimonial: {
    comment: { type: String, trim: true },
    rating: { type: Number, min: 1, max: 5 },
  },
  status: {
    type: String,
    enum: ["pending", "replied"],
  },
  timestamp: { type: Date, default: Date.now },
});
