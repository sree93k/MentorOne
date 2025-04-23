import mongoose, { Schema } from "mongoose";

interface IPayment extends Document {
  bookingId: mongoose.Types.ObjectId;
  serviceId: mongoose.Types.ObjectId;
  menteeId: mongoose.Types.ObjectId;
  amount: number;
  status: "pending" | "completed" | "failed" | "refunded";
  transactionId: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>({
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
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed", "refunded"],
    default: "pending",
  },
  transactionId: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
