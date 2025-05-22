import { Document, ObjectId } from "mongoose";

export interface PaymentDetails {
  sessionId?: string;
  amount?: number;
  currency?: string;
  status?: string;
  createdAt?: Date;
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
  paymentDetails?: PaymentDetails;
  createdAt: Date;
  updatedAt: Date;
}
