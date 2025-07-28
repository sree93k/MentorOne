import mongoose, { Schema, model, Document } from "mongoose";

export interface EFAQ extends Document {
  _id: mongoose.Types.ObjectId;
  categoryId: mongoose.Types.ObjectId;
  question: string;
  answer: string;
  keywords: string[];
  priority: number;
  targetUsers: ("anonymous" | "mentee" | "mentor")[];
  analytics: {
    views: number;
    helpful: number;
    notHelpful: number;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
