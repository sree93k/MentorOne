import { ECollegeExperience } from "../entities/collegeEntity";
import mongoose,{Schema} from "mongoose";

const CollegeExperienceSchema = new Schema<ECollegeExperience>({
    course: { type: String, required: true },
    specializedIn: { type: String, required: true },
    courseStartDate: { type: Date, required: true },
    courseEndDate: { type: Date, required: true },
    collegeName: { type: String, required: true },
    city: { type: String, required: true },
  });

    const CollegeExperience = mongoose.model<ECollegeExperience>('CollegeExperience', CollegeExperienceSchema);
    
    export default CollegeExperience;