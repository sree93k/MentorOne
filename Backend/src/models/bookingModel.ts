import mongoose, { Schema } from "mongoose";

const BookingSchema = new Schema({
  scheduleId: {
    type: Schema.Types.ObjectId,
    ref: "Schedule",
    required: true,
  },
  serviceId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  mentorId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  menteeId: {
    type: Schema.Types.ObjectId,
    ref: "User",
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
  endTime: {
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
    enum: ["confirmed", "rescheduled", "cancelled"],
    default: "confirmed",
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
