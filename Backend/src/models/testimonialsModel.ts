import mongoose, { Schema } from "mongoose";

const TestimonialSchema = new Schema({
  menteeId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  bookingId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  comment: { type: String, required: true, trim: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});
