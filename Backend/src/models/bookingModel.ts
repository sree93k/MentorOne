import { EBooking } from "../entities/bookingEntity";
import mongoose, { Schema } from "mongoose";

const BookingSchema = new Schema<EBooking>({
  serviceId: {
    type: Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  mentorId: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  menteeId: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  day: {
    type: String,
    enum: [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ],
    required: true,
  },
  slotIndex: {
    type: Number,
    min: 0,
    max: 2,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
    match: /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/,
  },
  bookingDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["confirmed", "rescheduled", "cancelled", "completed"],
    default: "confirmed",
  },
  paymentDetails: {
    sessionId: { type: String },
    amount: { type: Number },
    currency: { type: String },
    status: { type: String },
    createdAt: { type: Date },
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

const Booking = mongoose.model<EBooking>("Booking", BookingSchema);

export default Booking;
