import mongoose, { Types } from "mongoose";
import { injectable } from "inversify";
import ScheduleModel from "../../models/scheduleModel";
import {
  IScheduleRepository,
  ScheduleData,
} from "../interface/IScheduleRepository";
import { ESchedule } from "../../entities/scheduleEntity";
import BaseRepository from "../implementations/BaseRepository";

@injectable()
export default class ScheduleRepository
  extends BaseRepository<ESchedule>
  implements IScheduleRepository
{
  constructor() {
    super(ScheduleModel);
  }

  async getSchedules(mentorId: string | Types.ObjectId): Promise<ESchedule[]> {
    return await this.model.find({
      mentorId: new Types.ObjectId(mentorId),
    });
  }

  async createSchedule(
    mentorId: string | Types.ObjectId,
    data: ScheduleData
  ): Promise<ESchedule> {
    const validDays = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];

    if (!data.weeklySchedule) {
      throw new Error("weeklySchedule must be provided");
    }

    const providedDays = data.weeklySchedule.reduce((acc, d) => {
      acc[d.day] = d;
      return acc;
    }, {} as Record<string, (typeof data.weeklySchedule)[number]>);

    const weeklySchedule = validDays.map((day) => ({
      day,
      slots: providedDays[day]?.slots || [],
    }));

    const schedule = await this.model.create({
      mentorId: new Types.ObjectId(mentorId),
      scheduleName: data.scheduleName || "Default Schedule",
      weeklySchedule,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return schedule;
  }

  async updateSchedule(
    scheduleId: string,
    data: ScheduleData
  ): Promise<ESchedule | null> {
    return await this.model.findByIdAndUpdate(
      scheduleId,
      { $set: { weeklySchedule: data?.weeklySchedule, updatedAt: new Date() } },
      { new: true }
    );
  }

  async deleteSchedule(scheduleId: string): Promise<ESchedule | null> {
    return await this.model.findByIdAndDelete(scheduleId);
  }
}
