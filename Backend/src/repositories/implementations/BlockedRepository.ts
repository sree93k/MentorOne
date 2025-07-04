import { injectable } from "inversify";
import { Types } from "mongoose";
import blockedModel from "../../models/blockedModel";
import BaseRepository from "../implementations/BaseRepository";
import {
  IBlockedRepository,
  BlockedDateData,
} from "../interface/IBlockedRepository";
import { EBlockedDate } from "../../entities/blockedEntity";

@injectable()
export default class BlockedRepository
  extends BaseRepository<EBlockedDate>
  implements IBlockedRepository
{
  constructor() {
    super(blockedModel);
  }

  async findBlockedDates(mentorId: string): Promise<EBlockedDate[]> {
    return await this.model.find({ mentorId: new Types.ObjectId(mentorId) });
  }

  async getBlockedDates(
    mentorId: string | Types.ObjectId
  ): Promise<EBlockedDate[]> {
    return await this.model.find({ mentorId: new Types.ObjectId(mentorId) });
  }

  async addBlockedDates(
    mentorId: string | Types.ObjectId,
    dates: BlockedDateData[]
  ): Promise<EBlockedDate[]> {
    const blockedDates = dates.map(({ date, day, slotTime, type }) => ({
      mentorId: new Types.ObjectId(mentorId),
      date,
      day,
      slotTime: slotTime || undefined,
      type: type || "blocked",
      createdAt: new Date(),
    }));

    const insertedDocs = await this.model.insertMany(blockedDates);
    return insertedDocs.map((doc) => doc.toObject() as EBlockedDate);
  }

  async removeBlockedDate(
    mentorId: string,
    date: string,
    slotTime: string
  ): Promise<void> {
    await this.model.updateOne(
      { mentorId },
      { $pull: { blockedDates: { date, slotTime, type: "booking" } } }
    );
  }

  async deleteBlockedDate(
    mentorId: string,
    date: string,
    slotTime: string
  ): Promise<void> {
    const normalizedDate = new Date(date);
    normalizedDate.setUTCHours(0, 0, 0, 0);
    const normalizedSlotTime = slotTime.trim().toUpperCase();

    const deleteResult = await this.model.deleteOne({
      mentorId,
      date: normalizedDate,
      slotTime: normalizedSlotTime,
    });

    if (deleteResult.deletedCount === 0) {
      throw new Error("Blocked date not found or already deleted.");
    }
  }
}
