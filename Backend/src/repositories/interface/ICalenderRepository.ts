import mongoose from "mongoose";

export interface PolicyData {
  reschedulePeriod?: { value: number; unit: "hours" | "days" };
  bookingPeriod?: { value: number; unit: "hours" | "days" };
  noticePeriod?: { value: number; unit: "minutes" };
}

export interface ScheduleSlot {
  index: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface ScheduleData {
  day: string;
  slots: ScheduleSlot[];
  scheduleName?: string;
  weeklySchedule?: {
    day: string;
    slots: ScheduleSlot[];
  }[];
}

// export interface BlockedDateData {
//   date: Date;
//   day: string;
//   slotTime: number;
// }
export interface BlockedDateData {
  date: Date;
  day: string;
  slotTime?: string; // Add slotTime as optional
  type?: "blocked" | "booking"; // Add type as optional
}
export interface ICalendarRepository {
  getPolicy(mentorId: string | mongoose.Types.ObjectId): Promise<any | null>;
  updatePolicy(
    mentorId: string | mongoose.Types.ObjectId,
    data: PolicyData
  ): Promise<any | null>;
  getSchedules(mentorId: string | mongoose.Types.ObjectId): Promise<any[]>;
  createSchedule(
    mentorId: string | mongoose.Types.ObjectId,
    data: ScheduleData
  ): Promise<any>;
  updateSchedule(scheduleId: string, data: ScheduleData): Promise<any | null>;
  deleteSchedule(scheduleId: string): Promise<any | null>;
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
}
