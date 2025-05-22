import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface EBlockedDate extends Document {
  mentorId: mongoose.Types.ObjectId;
  date: Date;
  day: String;
  createdAt: Date;
}
