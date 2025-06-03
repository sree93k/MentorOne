import { Document, ObjectId } from "mongoose";

export interface EPayment extends Document {
  _id: ObjectId;
  bookingId: ObjectId;
  mentorId: ObjectId;
  menteeId: ObjectId;
  amount: number;
  platformPercentage: number;
  platformCharge: number;
  total: number;
  status: "pending" | "completed" | "failed" | "refunded";
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  transactionId: string;
  createdAt: Date;
  updatedAt: Date;
}
