// import mongoose, { Schema, Document } from "mongoose";

// // Interface for TimeSlot
// interface ITimeSlot extends Document {
//   startTime: string;
//   endTime: string;
//   isBooked: boolean;
//   bookingId?: mongoose.Types.ObjectId;
// }

// const TimeSlotSchema = new Schema<ITimeSlot>({
//   startTime: {
//     type: String,
//     required: true,
//     match: /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/,
//   },
//   endTime: {
//     type: String,
//     required: true,
//     match: /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/,
//   },
//   isBooked: {
//     type: Boolean,
//     default: false,
//   },
//   bookingId: {
//     type: Schema.Types.ObjectId,
//     ref: "Booking",
//     default: null,
//   },
// });

// // Interface for Schedule
// interface ISchedule extends Document {
//   userId: mongoose.Types.ObjectId;
//   title: string;
//   timeSlots: {
//     monday: ITimeSlot[];
//     tuesday: ITimeSlot[];
//     wednesday: ITimeSlot[];
//     thursday: ITimeSlot[];
//     friday: ITimeSlot[];
//     saturday: ITimeSlot[];
//     sunday: ITimeSlot[];
//   };
//   unavailableDates: Date[];
//   createdAt: Date;
//   updatedAt: Date;
// }

// const ScheduleSchema = new Schema<ISchedule>({
//   userId: {
//     type: Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   title: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   timeSlots: {
//     monday: {
//       type: [TimeSlotSchema],
//       default: [],
//       validate: {
//         validator: (slots: ITimeSlot[]) => slots.length <= 3,
//         message: "Max 3 slots per day.",
//       },
//     },
//     tuesday: {
//       type: [TimeSlotSchema],
//       default: [],
//       validate: {
//         validator: (slots: ITimeSlot[]) => slots.length <= 3,
//         message: "Max 3 slots per day.",
//       },
//     },
//     wednesday: {
//       type: [TimeSlotSchema],
//       default: [],
//       validate: {
//         validator: (slots: ITimeSlot[]) => slots.length <= 3,
//         message: "Max 3 slots per day.",
//       },
//     },
//     thursday: {
//       type: [TimeSlotSchema],
//       default: [],
//       validate: {
//         validator: (slots: ITimeSlot[]) => slots.length <= 3,
//         message: "Max 3 slots per day.",
//       },
//     },
//     friday: {
//       type: [TimeSlotSchema],
//       default: [],
//       validate: {
//         validator: (slots: ITimeSlot[]) => slots.length <= 3,
//         message: "Max 3 slots per day.",
//       },
//     },
//     saturday: {
//       type: [TimeSlotSchema],
//       default: [],
//       validate: {
//         validator: (slots: ITimeSlot[]) => slots.length <= 3,
//         message: "Max 3 slots per day.",
//       },
//     },
//     sunday: {
//       type: [TimeSlotSchema],
//       default: [],
//       validate: {
//         validator: (slots: ITimeSlot[]) => slots.length <= 3,
//         message: "Max 3 slots per day.",
//       },
//     },
//   },
//   unavailableDates: [{ type: Date }],
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now },
// });

// const Schedule = mongoose.model("Schedule", TimeSlotSchema);

// export default Schedule;

import mongoose, { Schema } from "mongoose";

const ScheduleSchema = new Schema({
  mentorId: {
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
  slots: [
    {
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
        default: true,
      },
    },
  ],
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
