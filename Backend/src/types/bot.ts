// import { Request } from "express";
// import { ObjectId } from "mongodb";

// // ✅ FIXED: Separate interface that doesn't conflict with existing types
// export interface ChatbotRequest extends Request {
//   user?: {
//     id: string;
//     role: string[];
//     rawToken?: string;
//   };
// }

// // ✅ Bot conversation data structure
// export interface BotConversationData {
//   sessionId: string;
//   userId?: string; // Keep as string, we'll convert to ObjectId in the repository
//   userType: "anonymous" | "mentee" | "mentor";
//   messages: any[];
//   totalQuestions: number;
//   resolved: boolean;
// }

// // ✅ Message interface
// export interface ChatMessage {
//   text: string;
//   sender: "user" | "bot";
//   responseType?: "faq" | "ai" | "fallback";
//   faqId?: string;
//   timestamp: Date;
//   helpful?: boolean;
// }

// // ✅ Response interface
// export interface ChatbotResponse {
//   text: string;
//   source: "faq" | "ai" | "fallback" | "keyword_match";
//   confidence: number;
//   faqId?: string;
//   suggestions?: string[];
// }
// Backend/src/types/bot.ts
import { Request } from "express";
import { ObjectId } from "mongodb";

// ✅ FIXED: Use intersection type instead of interface extension
interface ChatbotUser {
  user?: {
    id: string;
    role: string[];
    rawToken?: string;
  };
}

// ✅ FIXED: Use intersection type to avoid conflicts
export type ChatbotRequest = Request & ChatbotUser;

// ✅ Bot conversation data structure
export interface BotConversationData {
  sessionId: string;
  userId?: string; // Keep as string, we'll convert to ObjectId in the repository
  userType: "anonymous" | "mentee" | "mentor";
  messages: any[];
  totalQuestions: number;
  resolved: boolean;
}

// ✅ Message interface
export interface ChatMessage {
  text: string;
  sender: "user" | "bot";
  responseType?: "faq" | "ai" | "fallback";
  faqId?: string;
  timestamp: Date;
  helpful?: boolean;
}

// ✅ Response interface
export interface ChatbotResponse {
  text: string;
  source: "faq" | "ai" | "fallback" | "keyword_match";
  confidence: number;
  faqId?: string;
  suggestions?: string[];
}
