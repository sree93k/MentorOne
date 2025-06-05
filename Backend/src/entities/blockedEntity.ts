import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface EBlockedDate extends Document {
  mentorId: mongoose.Types.ObjectId;
  date: Date;
  day: string;
  slotTime: string;
  type: string;
  createdAt: Date;
}
