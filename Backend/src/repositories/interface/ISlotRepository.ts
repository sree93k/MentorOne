import { ESchedule } from "../../entities/scheduleEntity";
import { EBlockedDate } from "../../entities/blockedEntity";
export interface ISlotRepository {
  findAvailableSlots(mentorId: string): Promise<ESchedule[]>;
  findBlockedDates(mentorId: string): Promise<EBlockedDate[]>;
}
