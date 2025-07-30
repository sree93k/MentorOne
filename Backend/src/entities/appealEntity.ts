import { Document, Types } from "mongoose";

export interface EAppeal extends Document {
  _id: Types.ObjectId;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  appealMessage: string;
  category: "wrongful_block" | "account_hacked" | "misunderstanding" | "other";
  status: "pending" | "approved" | "rejected" | "under_review";
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string; // Admin ID
  adminResponse?: string;
  adminNotes?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAppealDTO {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  appealMessage: string;
  category?: "wrongful_block" | "account_hacked" | "misunderstanding" | "other";
  ipAddress?: string;
  userAgent?: string;
}

export interface UpdateAppealDTO {
  status?: "pending" | "approved" | "rejected" | "under_review";
  reviewedAt?: Date;
  reviewedBy?: string;
  adminResponse?: string;
  adminNotes?: string;
}

export interface AppealSearchFilters {
  status?: string;
  email?: string;
  userId?: string;
  category?: string;
  dateFrom?: Date;
  dateTo?: Date;
}
