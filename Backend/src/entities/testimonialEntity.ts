import { Document, ObjectId } from "mongoose";

export interface ETestimonial extends Document {
  _id: ObjectId;
  menteeId: ObjectId;
  bookingId: ObjectId;
  comment: string;
  rating: number; // from 1 to 5
  createdAt: Date;
  updatedAt: Date;
}
