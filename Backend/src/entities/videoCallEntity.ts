import { Document } from "mongoose";

export interface Participant {
  userId: string;
  joinedAt: Date;
}

export interface EVideoCall extends Document {
  meetingId: string;
  creatorId: string;
  bookingId: string;
  participants: Participant[];
  createdAt: Date;
  endedAt?: Date;
}
