// entities/notificationEntity.ts
import { Document, ObjectId } from "mongoose";

export interface ENotification extends Document {
  _id: ObjectId;
  recipientId: string;
  type: "payment" | "booking" | "chat";
  message: string;
  relatedId?: string;
  isRead: boolean;
  createdAt: Date;
  senderId?: ObjectId; // Ref to User model
}
