import { Document, ObjectId } from "mongoose";

export interface EBlockedDate extends Document {
  mentorId: ObjectId;
  date: Date;
  day: string;
  slotTime: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
}
