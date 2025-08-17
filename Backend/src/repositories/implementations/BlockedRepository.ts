import { injectable } from "inversify";
import mongoose from "mongoose";
import BlockedDate from "../../models/blockedModel";
import {
  IBlockedRepository,
  BlockedDateData,
} from "../interface/IBlockedRepository";
import BaseRepository from "./BaseRepository";
import { EBlockedDate } from "../../entities/blockedEntity";

@injectable()
export default class BlockedRepository
  extends BaseRepository<EBlockedDate>
  implements IBlockedRepository
{
  constructor() {
    super(BlockedDate);
  }
  async getBlockedDates(mentorId: string | mongoose.Types.ObjectId) {
    return await BlockedDate.find({
      mentorId: new mongoose.Types.ObjectId(mentorId),
    });
  }

  async addBlockedDates(
    mentorId: string | mongoose.Types.ObjectId,
    dates: BlockedDateData[]
  ) {
    console.log("calendar repo addBlockedDates step1", mentorId, dates);

    const blockedDates = dates.map(({ date, day, slotTime, type }) => ({
      mentorId: new mongoose.Types.ObjectId(mentorId),
      date,
      day,
      slotTime: slotTime || undefined, // Include slotTime if provided
      type: type || "blocked", // Default to "blocked" if type not provided
      createdAt: new Date(),
    }));

    const response = await BlockedDate.insertMany(blockedDates);
    console.log("calendar repo addBlockedDates step2", response);
    return response;
  }

  async removeBlockedDate(
    mentorId: string,
    date: string,
    slotTime: string
  ): Promise<void> {
    try {
      await BlockedDate.updateOne(
        { mentorId },
        { $pull: { blockedDates: { date, slotTime, type: "booking" } } }
      );
    } catch (error: any) {
      throw new Error("Failed to remove blocked date", error.message);
    }
  }
  async deleteById(id: string): Promise<EBlockedDate | null> {
    try {
      const deletedDate = await BlockedDate.findByIdAndDelete(id);
      return deletedDate as EBlockedDate | null;
    } catch (error) {
      throw new Error("Failed to remove blocked date", error);
    }
  }
  async deleteBlockedDate(
    mentorId: string,
    date: string,
    slotTime: string
  ): Promise<void> {
    try {
      console.log("deleteDate >>>>> step1", mentorId);
      console.log("deleteDate >>>>> step2", date);
      console.log("deleteDate >>>>> step3", slotTime);

      // Normalize date to a Date object and strip time for comparison
      const normalizedDate = new Date(date);
      normalizedDate.setUTCHours(0, 0, 0, 0); // Set to midnight UTC
      console.log(
        "deleteDate >>>>> normalizedDate",
        normalizedDate.toISOString()
      );

      // Normalize slotTime (trim and standardize case)
      const normalizedSlotTime = slotTime.trim().toUpperCase(); // e.g., "11:00 AM"
      console.log("deleteDate >>>>> normalizedSlotTime", normalizedSlotTime);

      // Check if document exists
      const existingDocument = await BlockedDate.findOne({
        mentorId,
        date: normalizedDate,
        slotTime: normalizedSlotTime,
      });
      console.log("deleteDate >>>>> existingDocument", existingDocument);

      if (!existingDocument) {
        console.log("deleteDate >>>>> No document found with query", {
          mentorId,
          date: normalizedDate,
          slotTime: normalizedSlotTime,
        });
        throw new Error("No blocked date found to delete");
      }

      // Perform deletion
      const deleteResult = await BlockedDate.deleteOne({
        mentorId,
        date: normalizedDate,
        slotTime: normalizedSlotTime,
      });
      console.log("deleteDate >>>>> deleteResult", deleteResult);

      if (deleteResult.deletedCount === 0) {
        throw new Error(
          "Failed to delete blocked date: No document was deleted"
        );
      }

      console.log("deleteDate >>>>> Successfully deleted blocked date");
    } catch (error: any) {
      console.error("deleteDate >>>>> error", error);
      throw new Error(`Failed to remove blocked date: ${error.message}`);
    }
  }
}
