import mongoose from "mongoose";
import { EBlockedDate } from "../../entities/blockedEntity";

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
  deleteById(date: string): Promise<EBlockedDate | null>;
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
