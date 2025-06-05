import { ESchedule } from "../../entities/scheduleEntity"; // Adjust the path based on your project structure

export interface ICalendarService {
  getMentorCalendar(mentorId: string): Promise<{
    policy: any;
    schedules: any[];
    blockedDates: any[];
  }>;
  getMentorPolicy(mentorId: string): Promise<any>;
  updatePolicy(mentorId: string, data: any): Promise<any>;

  createSchedule(mentorId: string, data: ESchedule): Promise<any>;

  updateSchedule(scheduleId: string, data: any): Promise<any>;

  deleteSchedule(scheduleId: string): Promise<any>;

  addBlockedDates(mentorId: string, dates: Date[]): Promise<any>;

  removeBlockedDate(blockedDateId: string): Promise<any>;
}
