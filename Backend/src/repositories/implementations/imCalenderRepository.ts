import mongoose from "mongoose";
import Policy from "../../models/policyModel";
import Schedule from "../../models/ScheduleModel"; // Use consistent casing
import BlockedDate from "../../models/blockedModel";
import { response } from "express";

// Rest of the repository code remains the same
interface PolicyData {
  reschedulePeriod?: { value: number; unit: "hours" | "days" };
  bookingPeriod?: { value: number; unit: "hours" | "days" };
  noticePeriod?: { value: number; unit: "minutes" };
}

interface ScheduleSlot {
  index: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

interface ScheduleData {
  day: string;
  slots: ScheduleSlot[];
}

export class CalendarRepository {
  async getPolicy(mentorId: string) {
    return await Policy.findOne({
      userId: new mongoose.Types.ObjectId(mentorId),
    });
  }

  async updatePolicy(mentorId: string, data: PolicyData) {
    return await Policy.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(mentorId) },
      { $set: data, updatedAt: new Date() },
      { new: true, upsert: true }
    );
  }

  async getSchedules(mentorId: string) {
    return await Schedule.find({
      mentorId: new mongoose.Types.ObjectId(mentorId),
    });
  }

  //   async createSchedule(mentorId: string, data: ScheduleData) {
  //     console.log("calender repo createSchedule step1 ", mentorId, data);

  //     const repsonse = await Schedule.create({
  //       mentorId: new mongoose.Types.ObjectId(mentorId),
  //       ...data,
  //       createdAt: new Date(),
  //       updatedAt: new Date(),
  //     });
  //     console.log("calender repo createSchedule step2", repsonse);
  //     return response;
  //   }

  //   async updateSchedule(scheduleId: string, data: ScheduleData) {
  //     return await Schedule.findByIdAndUpdate(
  //       scheduleId,
  //       { $set: { ...data, updatedAt: new Date() } },
  //       { new: true }
  //     );
  //   }
  //   async deleteSchedule(scheduleId: string) {
  //     return await Schedule.findByIdAndDelete(scheduleId);
  //   }
  async createSchedule(mentorId: string, data: ScheduleData) {
    console.log("calender repo createSchedule step1", mentorId, data);

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
      // Use provided weeklySchedule, ensuring all days are included
      const providedDays = data.weeklySchedule.reduce((acc, d) => {
        acc[d.day] = d;
        return acc;
      }, {} as Record<string, ScheduleData["weeklySchedule"][0]>);

      weeklySchedule = validDays.map((day) => ({
        day,
        slots: providedDays[day]?.slots || [], // Use provided slots or empty array
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

    console.log("calender repo createSchedule step2", schedule);
    return schedule;
  }

  async updateSchedule(scheduleId: string, data: ScheduleData) {
    console.log("calender repo updateSchedule step1", scheduleId, data);
    const updatedSchedule = await Schedule.findByIdAndUpdate(
      scheduleId,
      { $set: { weeklySchedule: data?.weeklySchedule, updatedAt: new Date() } },
      { new: true }
    );
    console.log("calender repo updateSchedule step2", updatedSchedule);
    return updatedSchedule;
  }

  async deleteSchedule(scheduleId: string) {
    console.log("calender repo deleteSchedule step1", scheduleId);
    const result = await Schedule.findByIdAndDelete(scheduleId);
    console.log("calender repo deleteSchedule step2", result);
    return result;
  }

  async getBlockedDates(mentorId: string) {
    return await BlockedDate.find({
      mentorId: new mongoose.Types.ObjectId(mentorId),
    });
  }

  async addBlockedDates(mentorId: string, dates: Date[]) {
    const blockedDates = dates.map((date) => ({
      mentorId: new mongoose.Types.ObjectId(mentorId),
      date,
      createdAt: new Date(),
    }));
    return await BlockedDate.insertMany(blockedDates);
  }

  async removeBlockedDate(blockedDateId: string) {
    return await BlockedDate.findByIdAndDelete(blockedDateId);
  }
}
