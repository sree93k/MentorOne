import { Document, ObjectId } from "mongoose";

export interface EVideoCall extends Document {
  meetingId: string;
  creatorId: string;
  bookingId: string;
  participants: { userId: string; joinedAt: Date }[];
  createdAt: Date;
  endedAt?: Date;
}
