import { Document, ObjectId } from "mongoose";

export interface EService extends Document {
  _id: ObjectId;
  mentorId: ObjectId;
  type: "1-1Call" | "priorityDM" | "DigitalProducts";
  title: string;
  amount: number;
  shortDescription: string;
  duration?: number;
  longDescription?: string;
  oneToOneType?: "chat" | "video";
  digitalProductType?: "documents" | "videoTutorials";
  fileUrl?: string;
  exclusiveContent?: Array<{
    season: string;
    episodes: Array<{
      episode: string;
      title: string;
      description: string;
      videoUrl: string;
    }>;
  }>;
  createdAt: Date;
  updatedAt: Date;
}
