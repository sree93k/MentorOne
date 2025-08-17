import { injectable, inject } from "inversify";
import { ESchedule } from "../../entities/scheduleEntity";
import { ICalendarService } from "../interface/ICalenderService";
import { IPolicyRepository } from "../../repositories/interface/IPolicyRepository";
import { IBlockedRepository } from "../../repositories/interface/IBlockedRepository";
import { IScheduleRepository } from "../../repositories/interface/IScheduleRepository";
import { TYPES } from "../../inversify/types";

@injectable()
export default class CalendarService implements ICalendarService {
  private PolicyRepository: IPolicyRepository;
  private BlockedRepository: IBlockedRepository;
  private ScheduleRepository: IScheduleRepository;

  constructor(
    @inject(TYPES.IPolicyRepository) policyRepository: IPolicyRepository,
    @inject(TYPES.IBlockedRepository) blockedRepository: IBlockedRepository,
    @inject(TYPES.IScheduleRepository) scheduleRepository: IScheduleRepository
  ) {
    this.PolicyRepository = policyRepository;
    this.BlockedRepository = blockedRepository;
    this.ScheduleRepository = scheduleRepository;
  }

  async getMentorCalendar(mentorId: string) {
    const [policy, schedules, blockedDates] = await Promise.all([
      this.PolicyRepository.getPolicy(mentorId),
      this.ScheduleRepository.getSchedules(mentorId),
      this.BlockedRepository.getBlockedDates(mentorId),
    ]);
    console.log("getMentorCalendar data policy", policy);
    console.log("getMentorCalendar data schedules", schedules);
    console.log("getMentorCalendar data blockedDates", blockedDates);
    return { policy, schedules, blockedDates };
  }
  async getMentorPolicy(mentorId: string) {
    console.log("calnderservcie getMentorPolicy  step 1", mentorId);
    const response = await this.PolicyRepository.getPolicy(mentorId);
    console.log("calnderservcie getMentorPolicy  step 2", response);
    return response;
  }

  async updatePolicy(mentorId: string, data: any) {
    return await this.PolicyRepository.updatePolicy(mentorId, data);
  }

  async createSchedule(mentorId: string, data: ESchedule) {
    console.log("calender service createSchedule step 1", mentorId, data);
    const schedule = await this.ScheduleRepository.createSchedule(
      mentorId,
      data
    );
    console.log("calender service createSchedule step 2", schedule);
    return schedule; // Single schedule object
  }

  async updateSchedule(scheduleId: string, data: any) {
    return await this.ScheduleRepository.updateSchedule(scheduleId, data);
  }

  async deleteSchedule(scheduleId: string) {
    return await this.ScheduleRepository.deleteSchedule(scheduleId);
  }

  async addBlockedDates(mentorId: string, dates: Date[]) {
    console.log("calnder addBlockedDates sterp 1 ", mentorId, dates);

    const response = await this.BlockedRepository.addBlockedDates(
      mentorId,
      dates
    );
    console.log("calnder addBlockedDates sterp 2 ", response);
    return response;
  }

  async removeBlockedDate(blockedDateId: string) {
    return await this.BlockedRepository.deleteById(blockedDateId);
  }
}
