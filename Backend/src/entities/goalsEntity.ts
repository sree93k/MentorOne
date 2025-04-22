import mongoose, { Document, Schema, ObjectId } from "mongoose";

export interface EGoals extends Document {
  _id: mongoose.Types.ObjectId;
  joinPurpose: string[];
  careerGoals: string;
  interestedNewcareer: string[];
}
