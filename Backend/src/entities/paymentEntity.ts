import { Document, ObjectId } from "mongoose";

export interface EPayment extends Document {
  _id: ObjectId;
  bookingId: ObjectId;
  menteeId: ObjectId;
  amount: number;
  status: "pending" | "completed" | "failed" | "refunded";
  transactionId: string;
  createdAt: Date;
  updatedAt: Date;
}
