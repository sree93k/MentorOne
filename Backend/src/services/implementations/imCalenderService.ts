import { response } from "express";
import { CalendarRepository } from "../../repositories/implementations/imCalenderRepository";

export class CalendarService {
  private repository: CalendarRepository;

  constructor() {
    this.repository = new CalendarRepository();
  }

  async getMentorCalendar(mentorId: string) {
    const [policy, schedules, blockedDates] = await Promise.all([
      this.repository.getPolicy(mentorId),
      this.repository.getSchedules(mentorId),
      this.repository.getBlockedDates(mentorId),
    ]);
    console.log("getMentorCalendar data policy", policy);
    console.log("getMentorCalendar data schedules", schedules);
    console.log("getMentorCalendar data blockedDates", blockedDates);
    return { policy, schedules, blockedDates };
  }

  async updatePolicy(mentorId: string, data: any) {
    return await this.repository.updatePolicy(mentorId, data);
  }

  // async createSchedule(mentorId: string, data: any) {
  //   console.log("calender servcice createSchedule step 1", mentorId, data);

  //   const response = await this.repository.createSchedule(mentorId, data);
  //   console.log("calender servcice createSchedule step 2", response);
  //   return response;
  // }

  async createSchedule(mentorId: string, data: ScheduleData) {
    console.log("calender service createSchedule step 1", mentorId, data);
    const schedule = await this.repository.createSchedule(mentorId, data);
    console.log("calender service createSchedule step 2", schedule);
    return schedule; // Single schedule object
  }

  async updateSchedule(scheduleId: string, data: any) {
    return await this.repository.updateSchedule(scheduleId, data);
  }

  async deleteSchedule(scheduleId: string) {
    return await this.repository.deleteSchedule(scheduleId);
  }

  async addBlockedDates(mentorId: string, dates: Date[]) {
    console.log("calnder addBlockedDates sterp 1 ", mentorId, dates);

    const response = await this.repository.addBlockedDates(mentorId, dates);
    console.log("calnder addBlockedDates sterp 2 ", response);
    return response;
  }

  async removeBlockedDate(blockedDateId: string) {
    return await this.repository.removeBlockedDate(blockedDateId);
  }
}
