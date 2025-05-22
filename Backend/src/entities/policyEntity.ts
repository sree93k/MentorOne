import { Document, ObjectId } from "mongoose";

interface TimeUnit {
  value: number;
  unit: "minutes" | "hours" | "days";
}

export interface EPolicy extends Document {
  _id: ObjectId;
  userId: ObjectId;
  reschedulePeriod: Omit<TimeUnit, "minutes">; // only "hours" or "days"
  bookingPeriod: Omit<TimeUnit, "minutes">; // only "hours" or "days"
  noticePeriod: Omit<TimeUnit, "hours" | "days">; // only "minutes"
  createdAt: Date;
  updatedAt: Date;
}
