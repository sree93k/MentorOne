import { Schema, model } from "mongoose";
import { EWallet } from "../entities/WalletEntity";

const WalletSchema = new Schema<EWallet>(
  {
    userId: { type: String, required: true, unique: true },
    balance: { type: Number, default: 0 },
    pendingBalance: { type: Number, default: 0 },
    transactions: [
      {
        paymentId: { type: Schema.Types.ObjectId, ref: "Payment" },
        amount: Number,
        type: { type: String, enum: ["credit", "debit"] },
        description: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

export default model<EWallet>("Wallet", WalletSchema);
