import mongoose, { Schema } from "mongoose";
import { ETestimonial } from "../entities/testimonialEntity";

const TestimonialSchema = new Schema<ETestimonial>({
  menteeId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  bookingId: {
    type: Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
  },
  comment: {
    type: String,
    required: true,
    trim: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
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

export default mongoose.model<ETestimonial>("Testimonial", TestimonialSchema);
