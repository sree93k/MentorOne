import mongoose, { Schema, model, Document } from "mongoose";

export interface EBotConversation extends Document {
  _id: mongoose.Types.ObjectId;
  sessionId: string;
  userId?: mongoose.Types.ObjectId;
  userType: "anonymous" | "mentee" | "mentor";
  messages: {
    text: string;
    sender: "user" | "bot";
    responseType: "faq" | "ai" | "fallback";
    faqId?: mongoose.Types.ObjectId;
    timestamp: Date;
    helpful?: boolean;
  }[];
  totalQuestions: number;
  resolved: boolean;
  createdAt: Date;
  updatedAt: Date;
}
