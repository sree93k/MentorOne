// import mongoose, { Schema } from "mongoose";

// const ScheduleSchema = new Schema({
//   mentorId: {
//     type: Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   day: {
//     type: String,
//     enum: [
//       "monday",
//       "tuesday",
//       "wednesday",
//       "thursday",
//       "friday",
//       "saturday",
//       "sunday",
//     ],
//     required: true,
//   },
//   slots: [
//     {
//       index: {
//         type: Number,
//         required: true,
//         min: 0,
//         max: 2,
//       },
//       startTime: {
//         type: String,
//         required: true,
//         match: /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/,
//       },
//       endTime: {
//         type: String,
//         required: true,
//         match: /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/,
//       },
//       isAvailable: {
//         type: Boolean,
//         default: true,
//       },
//     },
//   ],
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// export default mongoose.model("Schedule", ScheduleSchema);
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
    match: /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, // HH:MM format
  },
  endTime: {
    type: String,
    required: true,
    match: /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/,
  },
  isAvailable: {
    type: Boolean,
    default: true,
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
    validate: [(v: any[]) => v.length === 3, "Each day must have 3 slots"],
  },
});

const ScheduleSchema = new Schema({
  mentorId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  weeklySchedule: {
    type: [DaySchema],
    validate: [
      (v: any[]) => v.length === 7,
      "Must contain 7 days (Sunday to Saturday)",
    ],
  },
  scheduleName: {
    type: String,
    required: true,
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

export default mongoose.model("Schedule", ScheduleSchema);
