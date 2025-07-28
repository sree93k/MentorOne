import mongoose, { Schema, model, Document } from "mongoose";
import { EBotConversation } from "../entities/EBotConversationEntity";

const BotConversationSchema: Schema<EBotConversation> = new Schema(
  {
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: false,
    },
    userType: {
      type: String,
      enum: ["anonymous", "mentee", "mentor"],
      required: true,
    },
    messages: [
      {
        text: { type: String, required: true },
        sender: { type: String, enum: ["user", "bot"], required: true },
        responseType: { type: String, enum: ["faq", "ai", "fallback"] },
        faqId: { type: Schema.Types.ObjectId, ref: "FAQ" },
        timestamp: { type: Date, default: Date.now },
        helpful: { type: Boolean },
      },
    ],
    totalQuestions: {
      type: Number,
      default: 0,
    },
    resolved: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "BotConversations",
    timestamps: true,
  }
);

const BotConversation = model<EBotConversation>(
  "BotConversation",
  BotConversationSchema
);
export default BotConversation;
