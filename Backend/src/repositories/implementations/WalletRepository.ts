import mongoose from "mongoose";
import { IWallet } from "../../entities/WalletEntity";
import Wallet from "../../models/WalletSchema";

export default class WalletRepository {
  async create(userId: string): Promise<IWallet> {
    const wallet = new Wallet({ userId });
    return wallet.save();
  }

  async findByUserId(userId: string): Promise<IWallet | null> {
    return Wallet.findOne({ userId }).exec();
  }

  async updateBalance(
    userId: string,
    amount: number,
    type: "credit" | "debit",
    paymentId: string,
    description: string
  ): Promise<IWallet> {
    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      throw new Error("Wallet not found");
    }

    if (type === "credit") {
      wallet.balance += amount;
    } else {
      if (wallet.balance < amount) {
        throw new Error("Insufficient balance");
      }
      wallet.balance -= amount;
    }

    wallet.transactions.push({
      paymentId: new mongoose.Types.ObjectId(paymentId),
      amount,
      type,
      description,
      createdAt: new Date(),
    });

    wallet.updatedAt = new Date();
    return wallet.save();
  }

  async addPendingBalance(
    userId: string,
    amount: number,
    paymentId: string
  ): Promise<IWallet> {
    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      throw new Error("Wallet not found");
    }

    wallet.pendingBalance += amount;
    wallet.transactions.push({
      paymentId: new mongoose.Types.ObjectId(paymentId),
      amount,
      type: "credit",
      description: "Pending transfer from payment",
      createdAt: new Date(),
    });

    wallet.updatedAt = new Date();
    return wallet.save();
  }

  async releasePendingBalance(
    userId: string,
    amount: number,
    paymentId: string
  ): Promise<IWallet> {
    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      throw new Error("Wallet not found");
    }

    if (wallet.pendingBalance < amount) {
      throw new Error("Insufficient pending balance");
    }

    wallet.pendingBalance -= amount;
    wallet.balance += amount;
    wallet.transactions.push({
      paymentId: new mongoose.Types.ObjectId(paymentId),
      amount,
      type: "credit",
      description: "Released from pending to balance",
      createdAt: new Date(),
    });

    wallet.updatedAt = new Date();
    return wallet.save();
  }
}
