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

    // Create a map of input days for easy lookup
    const dayMap = data.days.reduce((acc, dayData) => {
      const normalizedDay = dayData.day.toLowerCase();
      if (validDays.includes(normalizedDay)) {
        acc[normalizedDay] = dayData;
      }
      return acc;
    }, {} as Record<string, ScheduleData["days"][0]>);

    // Generate weeklySchedule with 7 days
    const weeklySchedule = validDays.map((day) => {
      const dayData = dayMap[day] || { times: ["12:00"], available: false };
      const baseTime = dayData.times[0] || "12:00"; // Use first time or default

      // Generate 3 slots by incrementing the base time
      const slots = Array.from({ length: 3 }, (_, index) => {
        const startHour = parseInt(baseTime.split(":")[0]) + index;
        const startTime = `${startHour.toString().padStart(2, "0")}:00`;
        const endTime = `${(startHour + 1).toString().padStart(2, "0")}:00`;
        return {
          index,
          startTime,
          endTime,
          isAvailable: dayData.available,
        };
      });

      return { day, slots };
    });
    console.log("data name is ", data.name);

    const schedule = await Schedule.create({
      mentorId: new mongoose.Types.ObjectId(mentorId),
      weeklySchedule,
      scheduleName: data.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log("calender repo createSchedule step2", schedule);
    return schedule; // Return single schedule object
  }

  async updateSchedule(scheduleId: string, data: Partial<ScheduleData>) {
    return await Schedule.findByIdAndUpdate(
      scheduleId,
      { $set: { weeklySchedule: data?.days, updatedAt: new Date() } },
      { new: true }
    );
  }

  async deleteSchedule(scheduleId: string) {
    return await Schedule.findByIdAndDelete(scheduleId);
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
