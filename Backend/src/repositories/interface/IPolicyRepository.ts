import mongoose from "mongoose";

export interface PolicyData {
  reschedulePeriod?: { value: number; unit: "hours" | "days" };
  bookingPeriod?: { value: number; unit: "hours" | "days" };
  noticePeriod?: { value: number; unit: "minutes" };
}

export interface IPolicyRepository {
  getPolicy(mentorId: string | mongoose.Types.ObjectId): Promise<any | null>;
  updatePolicy(
    mentorId: string | mongoose.Types.ObjectId,
    data: PolicyData
  ): Promise<any | null>;
}
