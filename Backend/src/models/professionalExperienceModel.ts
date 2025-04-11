import { strict } from "assert";
import { EWorkExperience } from "../entities/professionalEnitity";
import mongoose, { Schema } from "mongoose";

const WorkExperienceSchema = new Schema<EWorkExperience>({
  company: { type: String, required: true },
  jobRole: { type: String, required: true },
  experience: { type: String, required: true },
  currentlyWorking: { type: Boolean, required: false },
  startDate: { type: Date, required: false },
  endDate: { type: Date, required: false },
  city: { type: String, required: true },
  userType: { type: String, required: true }, // Added
});

const WorkExperience = mongoose.model<EWorkExperience>(
  "WorkExperience",
  WorkExperienceSchema
);

export default WorkExperience;
