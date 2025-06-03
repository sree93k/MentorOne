import { IWallet } from "../../entities/WalletEntity";

export interface IWalletRepository {
  create(userId: string): Promise<IWallet>;
  findByUserId(userId: string): Promise<IWallet | null>;
  updateBalance(
    userId: string,
    amount: number,
    type: "credit" | "debit",
    paymentId: string,
    description: string
  ): Promise<IWallet>;
  addPendingBalance(
    userId: string,
    amount: number,
    paymentId: string
  ): Promise<IWallet>;
  releasePendingBalance(
    userId: string,
    amount: number,
    paymentId: string
  ): Promise<IWallet>;
}
