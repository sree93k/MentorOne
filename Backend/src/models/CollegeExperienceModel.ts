import { required } from "joi";
import { ECollegeExperience } from "../entities/collegeEntity";
import mongoose, { Schema } from "mongoose";

const CollegeExperienceSchema = new Schema<ECollegeExperience>(
  {
    course: { type: String, required: true },
    specializedIn: { type: String, required: true },
    startDate: { type: Date, required: false },
    endDate: { type: Date, required: false },
    collegeName: { type: String, required: true },
    city: { type: String, required: true },
    userType: { type: String, required: true },
  },
  { timestamps: true }
);

const CollegeExperience = mongoose.model<ECollegeExperience>(
  "CollegeExperience",
  CollegeExperienceSchema
);

export default CollegeExperience;
