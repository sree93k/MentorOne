// // entities/notificationEntity.ts
// import { Document, ObjectId } from "mongoose";

// export interface ENotification extends Document {
//   _id: ObjectId;
//   recipientId: string;
//   targetRole: "mentor" | "mentee" | "both";
//   type: "payment" | "booking" | "chat";
//   message: string;
//   relatedId?: string;
//   isRead: boolean;
//   createdAt: Date;
//   senderId?: ObjectId; // Ref to User model
// }
export interface ENotification {
  _id?: string;
  recipientId: string;
  targetRole: "mentor" | "mentee" | "both";
  type: "payment" | "booking" | "chat" | "meeting";
  message: string;
  relatedId?: string;
  isRead: boolean;
  isSeen: boolean; // ✅ NEW FIELD
  createdAt: Date;
  senderId?: string;
}
