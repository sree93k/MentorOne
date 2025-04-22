import { Document, ObjectId } from "mongoose";

export interface IOnlineService extends Document {
  _id: ObjectId;
  mentorId: ObjectId;
  type: "chat" | "videoCall" | "priorityDM";
  duration: number;
  longDescription: string;
  createdAt: Date;
  updatedAt: Date;
}
