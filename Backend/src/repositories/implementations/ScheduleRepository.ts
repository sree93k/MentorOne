import mongoose from "mongoose";
import Schedule from "../../models/scheduleModel";
import { ESchedule } from "../../entities/scheduleEntity";
import {
  IScheduleRepository,
  ScheduleData,
} from "../interface/IScheduleRepository";
import BaseRepository from "./BaseRepository";

export default class ScheduleRepository
  extends BaseRepository<ESchedule>
  implements IScheduleRepository
{
  constructor() {
    super(Schedule);
  }
  async getSchedules(mentorId: string | mongoose.Types.ObjectId) {
    return await Schedule.find({
      mentorId: new mongoose.Types.ObjectId(mentorId),
    });
  }

  async createSchedule(
    mentorId: string | mongoose.Types.ObjectId,
    data: ScheduleData
  ) {
    console.log("calendar repo createSchedule step1", mentorId, data);

    const validDays = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];

    let weeklySchedule;

    if (data.weeklySchedule) {
      const providedDays = data.weeklySchedule.reduce((acc, d) => {
        acc[d.day] = d;
        return acc;
      }, {} as Record<string, NonNullable<ScheduleData["weeklySchedule"]>[0]>);

      weeklySchedule = validDays.map((day) => ({
        day,
        slots: providedDays[day]?.slots || [],
      }));
    } else {
      throw new Error("weeklySchedule must be provided");
    }

    const schedule = await Schedule.create({
      mentorId: new mongoose.Types.ObjectId(mentorId),
      scheduleName: data.scheduleName || "Default Schedule",
      weeklySchedule,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log("calendar repo createSchedule step2", schedule);
    return schedule;
  }

  async updateSchedule(scheduleId: string, data: ScheduleData) {
    console.log("calendar repo updateSchedule step1", scheduleId, data);
    const updatedSchedule = await Schedule.findByIdAndUpdate(
      scheduleId,
      { $set: { weeklySchedule: data?.weeklySchedule, updatedAt: new Date() } },
      { new: true }
    );
    console.log("calendar repo updateSchedule step2", updatedSchedule);
    return updatedSchedule;
  }

  async deleteSchedule(scheduleId: string) {
    console.log("calendar repo deleteSchedule step1", scheduleId);
    const result = await Schedule.findByIdAndDelete(scheduleId);
    console.log("calendar repo deleteSchedule step2", result);
    return result;
  }
}
