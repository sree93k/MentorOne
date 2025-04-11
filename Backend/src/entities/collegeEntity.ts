import mongoose, { Document, Schema, ObjectId } from "mongoose";

export interface ECollegeExperience extends Document {
  _id: mongoose.Types.ObjectId;
  userType: string;
  course: string;
  specializedIn: string;
  startDate: Date;
  endDate: Date;
  collegeName: string;
  city: string;
}
