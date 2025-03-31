import { required } from "joi";
import { EMentor } from "../entities/mentorEntity";
import mongoose,{Schema} from "mongoose";


const MentorSchema: Schema<EMentor> = new Schema(
    {
      bio: {
        type: String,
        required: false, 
      },
      skills: {
        type: [String], 
        required: false, 
      },
      selfIntro: {
        type: String, 
        required: false, 
      },
      achievements: {
        type: [String], 
        required: false, 
      },
      services: {
        type: [{ type: Schema.Types.ObjectId, ref: "Services" }], 
        required: false,
      },
    },
    {
      timestamps: true, 
    }
  );

const Mentor = mongoose.model<EMentor>('Mentor', MentorSchema);

export default Mentor;