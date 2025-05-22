import { Document, ObjectId } from "mongoose";

export interface EMessage extends Document {
  _id: ObjectId;
  sender: ObjectId;
  content: string;
  type: "text" | "image" | "audio";
  chat: ObjectId;
  readBy: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}
