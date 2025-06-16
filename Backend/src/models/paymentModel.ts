import { EPayment } from "../entities/paymentEntity";
import mongoose, { Schema } from "mongoose";

const PaymentSchema = new Schema<EPayment>({
  bookingId: {
    type: Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
  },
  menteeId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  mentorId: {
    // Add mentorId to track the recipient
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  platformPercentage: {
    type: Number,
    required: true,
    min: 0,
    default: 15, // Default to 15%
  },
  platformCharge: {
    type: Number,
    required: true,
    min: 0,
  },
  total: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "transferred", "failed", "refunded"],
    default: "pending",
  },
  customerEmail: {
    type: String,
    required: false,
    lowercase: true,
    trim: true,
  },
  customerName: {
    type: String,
    required: false,
    trim: true,
  },
  customerPhone: {
    type: String,
    required: false,
  },
  transactionId: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Payment = mongoose.model<EPayment>("Payment", PaymentSchema);

export default Payment;
