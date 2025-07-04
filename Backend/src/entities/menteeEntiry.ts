import mongoose, { Document, ObjectId } from "mongoose";

export interface EMentee extends Document {
  _id: mongoose.Types.ObjectId;
  joinPurpose: string[];
  careerGoals: string;
  interestedNewcareer: string[];
  Bookings?: ObjectId[];
  isOnline?: boolean;
}
