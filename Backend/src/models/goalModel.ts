import { EGoals } from "../entities/goalsEntity";
import mongoose, { Schema } from "mongoose";

const GoalsSchema = new Schema<EGoals>({
  joinPurpose: { type: [String], required: true },
  careerGoals: { type: String, required: true },
  interestedNewcareer: { type: [String], required: true },
});

const Goals = mongoose.model<EGoals>("Goals", GoalsSchema);

export default Goals;
