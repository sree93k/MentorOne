import mongoose from "mongoose";

export interface BlockedDateData {
  date: Date;
  day: string;
  slotTime?: string; // Add slotTime as optional
  type?: "blocked" | "booking"; // Add type as optional
}

export interface IBlockedRepository {
  getBlockedDates(mentorId: string | mongoose.Types.ObjectId): Promise<any[]>;
  addBlockedDates(
    mentorId: string | mongoose.Types.ObjectId,
    dates: BlockedDateData[]
  ): Promise<any[]>;
  // removeBlockedDate(blockedDateId: string): Promise<any | null>;
  removeBlockedDate(
    mentorId: string,
    date: string,
    slotTime: string
  ): Promise<void>;
  deleteBlockedDate(
    mentorId: string,
    date: string,
    slotTime: string
  ): Promise<void>;
}
