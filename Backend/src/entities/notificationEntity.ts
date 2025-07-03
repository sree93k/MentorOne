import { Document, ObjectId } from "mongoose";

export interface ENotification extends Document {
  _id: ObjectId;
  recipientId: string;
  type: "payment" | "booking" | "chat" | "meeting";
  message: string;
  relatedId?: string;
  isRead: boolean;
  createdAt: Date;
  senderId?: ObjectId;
}
