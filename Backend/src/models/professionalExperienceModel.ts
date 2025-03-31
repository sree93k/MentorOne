import { EWorkExperience } from "../entities/professionalEnitity";
import mongoose,{Schema} from "mongoose";



const WorkExperienceSchema = new Schema<EWorkExperience>({
    company: { type: String, required: true },
    jobRole: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    city: { type: String, required: true },
  });

    const WorkExperience = mongoose.model<EWorkExperience>('WorkExperience', WorkExperienceSchema);
    
    export default WorkExperience;