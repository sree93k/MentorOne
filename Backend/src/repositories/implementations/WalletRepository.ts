import mongoose from "mongoose";
import { EWallet } from "../../entities/WalletEntity";
import Wallet from "../../models/WalletSchema";
import BaseRepository from "./BaseRepository";
import { IWalletRepository } from "../interface/IWalletRepository";

export default class WalletRepository
  extends BaseRepository<EWallet>
  implements IWalletRepository
{
  constructor() {
    super(Wallet);
  }
  async createWallet(userId: string): Promise<EWallet> {
    console.log("WALLET REPOSITRORY");
    console.log("WALLET REPOSITRORY");
    console.log("WALLET REPOSITRORY");
    console.log("WALLET REPOSITRORY");
    console.log("WALLET REPOSITRORY");

    const wallet = new Wallet({ userId });
    return wallet.save();
  }

  async findByUserId(userId: string): Promise<EWallet | null> {
    return Wallet.findOne({ userId }).exec();
  }

  async updateBalance(
    userId: string,
    amount: number,
    type: "credit" | "debit",
    paymentId: string,
    description: string
  ): Promise<EWallet> {
    console.log("WALLET REPOSITRORY");
    console.log("WALLET REPOSITRORY");
    console.log("WALLET REPOSITRORY");
    console.log("WALLET REPOSITRORY");
    console.log("WALLET REPOSITRORY");
    console.log("WALLET REPOSITRORY");
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
  ): Promise<EWallet> {
    console.log("WALLET REPOSITRORY addPendingBalance step1");
    console.log("WALLET REPOSITRORY", userId);
    console.log("WALLET REPOSITRORY", amount);
    console.log("WALLET REPOSITRORY", paymentId);
    console.log("WALLET REPOSITRORY");
    console.log("WALLET REPOSITRORY");

    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      throw new Error("Wallet not found");
    }

    console.log("WALLET REPOSITRORY addPendingBalance step2");

    wallet.pendingBalance += amount;

    console.log("WALLET REPOSITRORY addPendingBalance step3");

    wallet.transactions.push({
      paymentId: new mongoose.Types.ObjectId(paymentId),
      amount,
      type: "credit",
      description: "Transfer from cancelled booking",
      createdAt: new Date(),
    });

    console.log("WALLET REPOSITRORY addPendingBalance step4");

    wallet.updatedAt = new Date();

    console.log("WALLET REPOSITRORY addPendingBalance step5", wallet);

    return wallet.save();
  }

  async releasePendingBalance(
    userId: string,
    amount: number,
    paymentId: string
  ): Promise<EWallet> {
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
