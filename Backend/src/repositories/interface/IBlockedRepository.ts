import mongoose from "mongoose";
import { EBlockedDate } from "../../entities/blockedEntity";

export interface BlockedDateData {
  date: Date;
  day: string;
  slotTime?: string;
  type?: "blocked" | "booking";
}

export interface IBlockedRepository {
  findBlockedDates(mentorId: string): Promise<EBlockedDate[]>;
  getBlockedDates(
    mentorId: string | mongoose.Types.ObjectId
  ): Promise<EBlockedDate[]>;
  addBlockedDates(
    mentorId: string | mongoose.Types.ObjectId,
    dates: BlockedDateData[]
  ): Promise<EBlockedDate[]>;
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
