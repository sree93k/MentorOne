import mongoose, { Document, Schema, ObjectId } from "mongoose";

export interface EWorkExperience extends Document {
  _id: mongoose.Types.ObjectId;
  userType: string;
  company: string;
  jobRole: string;
  experience: String;
  startDate: Date;
  currentlyWorking: boolean;
  endDate?: Date;
  city: string;
}
