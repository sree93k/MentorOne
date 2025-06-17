import mongoose, { Schema } from "mongoose";
import { ETestimonial } from "../entities/testimonialEntity";

const TestimonialSchema = new Schema<ETestimonial>({
  menteeId: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  mentorId: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  serviceId: {
    type: Schema.Types.ObjectId,
    ref: "Service",
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
    min: 0,
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
