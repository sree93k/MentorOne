import { Document, ObjectId } from "mongoose";

export interface ChatRole {
  userId: ObjectId;
  role: "mentee" | "mentor";
}

export interface EChat extends Document {
  _id: ObjectId;
  chatName?: string;
  isGroupChat: boolean;
  users: ObjectId[];
  roles: ChatRole[];
  bookingId?: ObjectId;
  latestMessage?: ObjectId;
  groupAdmin?: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
