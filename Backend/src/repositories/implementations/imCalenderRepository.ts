import mongoose from "mongoose";
import Policy from "../../models/policyModel";
import Schedule from "../../models/ScheduleModel"; // Use consistent casing
import BlockedDate from "../../models/blockedModel";

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

  async createSchedule(mentorId: string, data: ScheduleData) {
    return await Schedule.create({
      mentorId: new mongoose.Types.ObjectId(mentorId),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async updateSchedule(scheduleId: string, data: ScheduleData) {
    return await Schedule.findByIdAndUpdate(
      scheduleId,
      { $set: { ...data, updatedAt: new Date() } },
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
