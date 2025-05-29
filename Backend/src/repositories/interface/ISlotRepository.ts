import { ESchedule } from "../../entities/scheduleEntity";
import { EBlockedDate } from "../../entities/blockedEntity";
export interface ISlotRepository {
  findAvailableSlots(serviceId: string): Promise<ESchedule[]>;
  findBlockedDates(mentorId: string): Promise<EBlockedDate[]>;
}
