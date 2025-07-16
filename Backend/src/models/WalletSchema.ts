import mongoose, { Schema } from "mongoose";
import { EWallet } from "../entities/WalletEntity";

const WalletSchema = new Schema<EWallet>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  balance: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  pendingBalance: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  status: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending",
  },
  transactions: [
    {
      paymentId: {
        type: Schema.Types.ObjectId,
        ref: "Payment",
        required: true,
      },
      amount: {
        type: Number,
        required: true,
        min: 0,
      },
      type: {
        type: String,
        enum: ["credit", "debit"],
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Wallet = mongoose.model<EWallet>("Wallet", WalletSchema);

export default Wallet;
