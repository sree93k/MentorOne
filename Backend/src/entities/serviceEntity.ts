import { Document, ObjectId } from "mongoose";

export interface EService extends Document {
  _id: ObjectId;
  mentorId: ObjectId;
  type: "1-1Call" | "priorityDM" | "DigitalProducts";
  serviceId?: ObjectId; // Optional reference to specific service (OnlineService or DigitalProduct)
  title: string;
  amount: number;
  shortDescription: string;
  createdAt: Date;
  updatedAt: Date;
}
