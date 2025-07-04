import { Document, Types } from "mongoose";

export interface WalletTransaction {
  paymentId: Types.ObjectId;
  amount: number;
  type: "credit" | "debit";
  description: string;
  createdAt: Date;
}

export interface EWallet extends Document {
  userId: string;
  balance: number;
  pendingBalance: number;
  transactions: WalletTransaction[];
  createdAt: Date;
  updatedAt: Date;
}
