import { Document, Types } from "mongoose";

export interface EMessage extends Document {
  _id: Types.ObjectId;
  sender: Types.ObjectId;
  content: string;
  type: "text" | "image" | "audio";
  chat: Types.ObjectId;
  readBy: Types.ObjectId[];
  status: "sent" | "delivered" | "read";
  createdAt: Date;
  updatedAt: Date;
}
