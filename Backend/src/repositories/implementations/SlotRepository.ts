import { ESchedule } from "../../entities/scheduleEntity";
import { EBlockedDate } from "../../entities/blockedEntity";
import scheduleModel from "../../models/scheduleModel";
import blockedModel from "../../models/blockedModel";
import { ISlotRepository } from "../interface/ISlotRepository";
import { ApiError } from "../../middlewares/errorHandler";
import { HttpStatus } from "../../constants/HttpStatus";
export default class SlotRepository implements ISlotRepository {
  async findAvailableSlots(serviceId: string): Promise<ESchedule[]> {
    try {
      console.log("SlotRepository findAvailableSlots steo 1", serviceId);
      const response = await scheduleModel.find({ _id: serviceId });
      console.log("SlotRepository findAvailableSlots steo 2", response);
      return response;
    } catch (error) {
      throw new ApiError(HttpStatus.NOT_FOUND, "not found slot");
    }
  }
  async findBlockedDates(mentorId: string): Promise<EBlockedDate[]> {
    try {
      console.log("SlotRepository findBlockedDates steo 1", mentorId);
      const response = await blockedModel.find({ mentorId: mentorId });
      console.log("SlotRepository findBlockedDates steo 2", response);
      return response;
    } catch (error) {
      throw new ApiError(HttpStatus.NOT_FOUND, "not found blockedDates");
    }
  }
}
