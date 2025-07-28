import mongoose, { Schema, model, Document } from "mongoose";

export interface EFAQCategory extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  priority: number;
  targetUsers: ("anonymous" | "mentee" | "mentor")[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
