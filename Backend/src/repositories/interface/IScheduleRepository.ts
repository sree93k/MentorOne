import mongoose from "mongoose";

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

export interface IScheduleRepository {
  getSchedules(mentorId: string | mongoose.Types.ObjectId): Promise<any[]>;
  createSchedule(
    mentorId: string | mongoose.Types.ObjectId,
    data: ScheduleData
  ): Promise<any>;
  updateSchedule(scheduleId: string, data: ScheduleData): Promise<any | null>;
  deleteSchedule(scheduleId: string): Promise<any | null>;
}
