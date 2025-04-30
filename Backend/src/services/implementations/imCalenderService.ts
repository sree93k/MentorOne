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

    return { policy, schedules, blockedDates };
  }

  async updatePolicy(mentorId: string, data: any) {
    return await this.repository.updatePolicy(mentorId, data);
  }

  async createSchedule(mentorId: string, data: any) {
    return await this.repository.createSchedule(mentorId, data);
  }

  async updateSchedule(scheduleId: string, data: any) {
    return await this.repository.updateSchedule(scheduleId, data);
  }

  async deleteSchedule(scheduleId: string) {
    return await this.repository.deleteSchedule(scheduleId);
  }

  async addBlockedDates(mentorId: string, dates: Date[]) {
    return await this.repository.addBlockedDates(mentorId, dates);
  }

  async removeBlockedDate(blockedDateId: string) {
    return await this.repository.removeBlockedDate(blockedDateId);
  }
}
