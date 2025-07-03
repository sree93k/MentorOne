import { Document, ObjectId } from "mongoose";

interface TimeUnit {
  value: number;
  unit: "minutes" | "hours" | "days";
}

export interface EPolicy extends Document {
  _id: ObjectId;
  userId: ObjectId;
  reschedulePeriod: Omit<TimeUnit, "minutes">;
  bookingPeriod: Omit<TimeUnit, "minutes">;
  noticePeriod: Omit<TimeUnit, "hours" | "days">;
  createdAt: Date;
  updatedAt: Date;
}
