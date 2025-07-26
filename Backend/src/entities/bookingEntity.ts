// import { Document, ObjectId } from "mongoose";

// export interface PaymentDetails {
//   sessionId?: string;
//   amount?: number;
//   currency?: string;
//   status?: string;
//   createdAt?: Date;
// }

// interface rescheduleRequest {
//   requestedDate: string;
//   requestedTime: string;
//   requestedSlotIndex: number;
//   mentorDecides: boolean;
//   rescheduleStatus: string;
//   reason: string;
// }

// export interface EBooking extends Document {
//   _id: ObjectId;
//   serviceId: ObjectId;
//   mentorId: ObjectId;
//   menteeId: ObjectId;
//   day:
//     | "monday"
//     | "tuesday"
//     | "wednesday"
//     | "thursday"
//     | "friday"
//     | "saturday"
//     | "sunday";
//   slotIndex: number;
//   startTime: string;
//   bookingDate: Date;
//   status: "confirmed" | "rescheduled" | "cancelled" | "completed";
//   rescheduleRequest: rescheduleRequest;
//   testimonials: ObjectId;
//   paymentDetails?: PaymentDetails;
//   createdAt: Date;
//   updatedAt: Date;
// }

import { Document, ObjectId } from "mongoose";

export interface PaymentDetails {
  sessionId?: string;
  amount?: number;
  currency?: string;
  status?: string;
  createdAt?: Date;
}

interface rescheduleRequest {
  requestedDate: string;
  requestedTime: string;
  requestedSlotIndex: number;
  mentorDecides: boolean;
  rescheduleStatus: string;
  reason: string;
}

// 📍 ADD THESE NEW INTERFACES:
export interface ReminderJobs {
  oneHourJob?: string;
  thirtyMinJob?: string;
  tenMinJob?: string;
  sessionStartJob?: string;
}

export interface ReminderStatus {
  oneHourSent?: boolean;
  thirtyMinSent?: boolean;
  tenMinSent?: boolean;
  sessionStartSent?: boolean;
}

export interface EBooking extends Document {
  _id: ObjectId;
  serviceId: ObjectId;
  mentorId: ObjectId;
  menteeId: ObjectId;
  day:
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday";
  slotIndex: number;
  startTime: string;
  bookingDate: Date;
  status: "confirmed" | "rescheduled" | "cancelled" | "completed";
  rescheduleRequest: rescheduleRequest;
  testimonials: ObjectId;
  paymentDetails?: PaymentDetails;

  // 📍 ADD THESE NEW FIELDS:
  reminderJobs?: ReminderJobs;
  reminderStatus?: ReminderStatus;

  createdAt: Date;
  updatedAt: Date;
}
