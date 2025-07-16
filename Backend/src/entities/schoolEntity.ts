import mongoose, { Document } from "mongoose";

export interface ESchoolExperience extends Document {
  _id: mongoose.Types.ObjectId;
  userType: string;
  schoolName: string;
  class: number;
  city: string;
  startDate?: Date;
  endDate?: Date;
}
