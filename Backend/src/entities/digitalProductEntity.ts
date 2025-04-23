import { Document, ObjectId } from "mongoose";

export interface EDigitalProduct extends Document {
  _id: ObjectId;
  mentorId: ObjectId;
  type: "documents" | "videoTutorials";
  fileUrl?: string; // URL for PDF (documents)
  videoTutorials?: ObjectId[]; // References to VideoTutorial documents
  createdAt: Date;
  updatedAt: Date;
}
