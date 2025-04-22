import mongoose, { Document, Schema, ObjectId } from "mongoose";

export interface EMentee extends Document {
  _id: mongoose.Types.ObjectId;
  joinPurpose: string[] | null;
  careerGoals: string | null;
  interestedNewcareer: string[] | null;
  Bookings: ObjectId[] | null;
}
