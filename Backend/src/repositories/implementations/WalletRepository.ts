import { IWalletRepository } from "../interface/IWalletRepository";
import BaseRepository from "../implementations/BaseRepository"; // Make sure path is correct
import Wallet from "../../models/WalletSchema";
import { EWallet } from "../../entities/WalletEntity";
import { Types } from "mongoose";
import { injectable } from "inversify";

@injectable()
export default class WalletRepository
  extends BaseRepository<EWallet>
  implements IWalletRepository
{
  constructor() {
    super(Wallet);
  }

  async createWallet(userId: string): Promise<EWallet> {
    const wallet = new this.model({ userId });
    return wallet.save();
  }

  // async findByUserId(userId: string): Promise<EWallet | null> {
  //   return this.model.findOne({ userId }).exec();
  // }

  async updateBalance(
    userId: string,
    amount: number,
    type: "credit" | "debit",
    paymentId: string,
    description: string
  ): Promise<EWallet> {
    const wallet = await this.findById(userId);
    if (!wallet) throw new Error("Wallet not found");

    if (type === "credit") {
      wallet.balance += amount;
    } else {
      if (wallet.balance < amount) throw new Error("Insufficient balance");
      wallet.balance -= amount;
    }

    wallet.transactions.push({
      paymentId: new Types.ObjectId(paymentId),
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
    const wallet = await this.findById(userId);
    if (!wallet) throw new Error("Wallet not found");

    wallet.pendingBalance += amount;

    wallet.transactions.push({
      paymentId: new Types.ObjectId(paymentId),
      amount,
      type: "credit",
      description: "Transfer from cancelled booking",
      createdAt: new Date(),
    });

    wallet.updatedAt = new Date();
    return wallet.save();
  }

  async releasePendingBalance(
    userId: string,
    amount: number,
    paymentId: string
  ): Promise<EWallet> {
    const wallet = await this.findById(userId);
    if (!wallet) throw new Error("Wallet not found");

    if (wallet.pendingBalance < amount)
      throw new Error("Insufficient pending balance");

    wallet.pendingBalance -= amount;
    wallet.balance += amount;

    wallet.transactions.push({
      paymentId: new Types.ObjectId(paymentId),
      amount,
      type: "credit",
      description: "Released from pending to balance",
      createdAt: new Date(),
    });

    wallet.updatedAt = new Date();
    return wallet.save();
  }
}
