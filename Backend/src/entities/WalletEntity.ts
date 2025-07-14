import mongoose, { Document } from "mongoose";

export interface EWallet extends Document {
  userId: mongoose.Types.ObjectId; // Mentor ID
  balance: number; // Available balance
  pendingBalance: number; // Pending transfers
  status: string;
  transactions: {
    paymentId: mongoose.Types.ObjectId;
    amount: number;
    type: "credit" | "debit";
    description: string;
    createdAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}
