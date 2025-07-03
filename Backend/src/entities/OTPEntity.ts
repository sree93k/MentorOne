import { Document, ObjectId } from "mongoose";

export interface EOTP extends Document {
  _id: ObjectId | null;
  email: string | null;
  user: ObjectId | null;
  otp: string | null;
  expirationTime: Date | null;
  createdDate: Date | null;
  attempts: Number | null;
}
