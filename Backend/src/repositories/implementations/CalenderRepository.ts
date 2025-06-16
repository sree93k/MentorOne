import mongoose from "mongoose";
import Policy from "../../models/policyModel";
import Schedule from "../../models/scheduleModel";
import BlockedDate from "../../models/blockedModel";
import ApiError from "../../utils/apiResponse";

import {
  ICalendarRepository,
  PolicyData,
  ScheduleData,
  BlockedDateData,
} from "../interface/ICalenderRepository";

export default class CalendarRepository implements ICalendarRepository {
  async getPolicy(mentorId: string | mongoose.Types.ObjectId) {
    return await Policy.findOne({
      userId: new mongoose.Types.ObjectId(mentorId),
    });
  }

  async updatePolicy(
    mentorId: string | mongoose.Types.ObjectId,
    data: PolicyData
  ) {
    return await Policy.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(mentorId) },
      { $set: data, updatedAt: new Date() },
      { new: true, upsert: true }
    );
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

  async getBlockedDates(mentorId: string | mongoose.Types.ObjectId) {
    return await BlockedDate.find({
      mentorId: new mongoose.Types.ObjectId(mentorId),
    });
  }

  async addBlockedDates(
    mentorId: string | mongoose.Types.ObjectId,
    dates: BlockedDateData[]
  ) {
    console.log("calendar repo addBlockedDates step1", mentorId, dates);

    const blockedDates = dates.map(({ date, day, slotTime, type }) => ({
      mentorId: new mongoose.Types.ObjectId(mentorId),
      date,
      day,
      slotTime: slotTime || undefined, // Include slotTime if provided
      type: type || "blocked", // Default to "blocked" if type not provided
      createdAt: new Date(),
    }));

    const response = await BlockedDate.insertMany(blockedDates);
    console.log("calendar repo addBlockedDates step2", response);
    return response;
  }

  async removeBlockedDate(
    mentorId: string,
    date: string,
    slotTime: string
  ): Promise<void> {
    try {
      await BlockedDate.updateOne(
        { mentorId },
        { $pull: { blockedDates: { date, slotTime, type: "booking" } } }
      );
    } catch (error: any) {
      throw new ApiError(500, "Failed to remove blocked date", error.message);
    }
  }
  async deleteBlockedDate(
    mentorId: string,
    date: string,
    slotTime: string
  ): Promise<void> {
    try {
      const deleteDate = await BlockedDate.deleteOne({
        mentorId,
        slotTime,
        date,
      });
      console.log("deleteDate >>>>> ", deleteDate);
    } catch (error: any) {
      throw new ApiError(500, "Failed to remove blocked date", error.message);
    }
  }
}
