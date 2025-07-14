import { EWallet } from "../../entities/WalletEntity";

export interface IWalletRepository {
  createWallet(userId: string): Promise<EWallet>;
  findByUserId(userId: string): Promise<EWallet | null>;
  updateBalance(
    userId: string,
    amount: number,
    type: "credit" | "debit",
    paymentId: string,
    description: string
  ): Promise<EWallet>;
  addPendingBalance(
    userId: string,
    amount: number,
    paymentId: string
  ): Promise<EWallet>;
  releasePendingBalance(
    userId: string,
    amount: number,
    paymentId: string
  ): Promise<EWallet>;
}
