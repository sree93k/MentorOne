import { Document, ObjectId } from "mongoose";

export interface EPriorityDM extends Document {
  _id: ObjectId;
  mentorId: ObjectId;
  menteeId: ObjectId;
  bookingId: ObjectId;
  mentorFeedback?: string;
  menteeTestimonial?: {
    comment: string;
    rating: number;
  };
  status: "pending" | "replied";
  timestamp: Date;
}
