import { EMentee } from "../entities/menteeEntiry";
import mongoose, { Schema } from "mongoose";

const MenteeSchema = new Schema<EMentee>({
  joinPurpose: { type: [String], required: true },
  careerGoals: { type: String, required: true },
  interestedNewcareer: { type: [String], required: true },
});

const Mentee = mongoose.model<EMentee>("Mentee", MenteeSchema);

export default Mentee;
