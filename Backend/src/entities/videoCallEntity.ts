import { Document, ObjectId } from "mongoose";

export interface EVideoCall extends Document {
  meetingId: string;
  creatorId: ObjectId;
  participants: {
    userId: ObjectId;
    joinedAt: Date;
  }[];
  createdAt: Date;
  endedAt?: Date;
}
