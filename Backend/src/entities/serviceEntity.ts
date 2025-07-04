import mongoose, { Document } from "mongoose";

export interface EService extends Document {
  mentorId: mongoose.Types.ObjectId;
  type: "1-1Call" | "priorityDM" | "DigitalProducts";
  title: string;
  amount: number;
  shortDescription: string;
  duration?: number;
  longDescription?: string;
  oneToOneType?: "chat" | "video";
  digitalProductType?: "documents" | "videoTutorials";
  fileUrl?: string;
  exclusiveContent?: {
    season: string;
    episodes: {
      episode: string;
      title: string;
      description: string;
      videoUrl: string;
    }[];
  }[];
  stats?: {
    views: number;
    bookings: number;
    earnings: number;
    conversions: string;
  };
  slot?: mongoose.Types.ObjectId;
}
