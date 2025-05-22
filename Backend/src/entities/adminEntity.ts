import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface EAdmin extends Document {
  _id: ObjectId;
  adminName: string | null;
  adminEmail: string | null;
  role: string | null;
  adminPassword: string | null;
  profilePicture: string | null;
}
