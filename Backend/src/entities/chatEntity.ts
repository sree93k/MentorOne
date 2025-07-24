import { Document, Types } from "mongoose";

export interface EChat extends Document {
  _id: Types.ObjectId;
  chatName?: string;
  isGroupChat: boolean;
  users: Types.ObjectId[];
  roles: Array<{
    userId: Types.ObjectId;
    role: "mentee" | "mentor";
  }>;
  bookingId?: Types.ObjectId;
  latestMessage?: Types.ObjectId;
  groupAdmin?: Types.ObjectId;
  isActive: boolean;
  otherUserId?: string; // Added for frontend use
  createdAt: Date;
  updatedAt: Date;
}
