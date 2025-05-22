import { Document, ObjectId } from "mongoose";

export interface Slot {
  index: number;
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  isAvailable: boolean;
}

export interface DaySchedule {
  day:
    | "sunday"
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday";
  slots: Slot[];
}

export interface ESchedule extends Document {
  _id: ObjectId;
  mentorId: ObjectId;
  weeklySchedule: DaySchedule[];
  scheduleName: string;
  createdAt: Date;
  updatedAt: Date;
}
