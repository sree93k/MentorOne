import { ESchedule } from "../entities/scheduleEntity";
import mongoose, { Schema } from "mongoose";

const SlotSchema = new Schema({
  index: {
    type: Number,
    required: true,
    min: 0,
    max: 2,
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
  isAvailable: {
    type: Boolean,
    default: false,
  },
});

const DaySchema = new Schema({
  day: {
    type: String,
    enum: [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ],
    required: true,
  },
  slots: {
    type: [SlotSchema],
    validate: [(v: any[]) => v.length <= 3, "Each day maximum upto 3 slots"],
  },
});

const ScheduleSchema = new Schema<ESchedule>(
  {
    mentorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    weeklySchedule: [DaySchema],
    scheduleName: { type: String, default: "Default Schedule" },
    status: {
      type: Boolean,
      default: false,
      required: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "Schedule",
    timestamps: true,
  }
);

export default mongoose.model<ESchedule>("Schedule", ScheduleSchema);
