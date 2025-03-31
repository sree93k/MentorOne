import { ESchoolExperience } from "../entities/schoolEntity";
import mongoose,{Schema} from "mongoose";

const SchoolExperienceSchema = new Schema<ESchoolExperience>({
    schoolName: { type: String, required: true },
    class: { type: Number, required: true },
    city: { type: String, required: true },
    startDate: { type: Date },
    endDate: { type: Date },
  });

  const SchoolExperience = mongoose.model<ESchoolExperience>('SchoolExperience', SchoolExperienceSchema);
  
  export default SchoolExperience;