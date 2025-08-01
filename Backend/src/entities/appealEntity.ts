import { Document, ObjectId } from "mongoose";

export interface EAppeal extends Document {
  _id: ObjectId;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  appealMessage: string;
  category: "wrongful_block" | "account_hacked" | "misunderstanding" | "other";
  status: "pending" | "under_review" | "approved" | "rejected";

  // ✅ NEW: Enhanced tracking fields
  blockEventId: string;
  appealCount: number;
  previousAppealId?: string;
  canReappeal: boolean;

  // Admin review fields
  reviewedBy?: string;
  reviewedAt?: Date;
  adminResponse?: string;
  adminNotes?: string;

  // Metadata
  ipAddress?: string;
  userAgent?: string;
  submittedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAppealDTO {
  userId?: string; // Optional - will be set in service
  email: string;
  firstName: string;
  lastName: string;
  appealMessage: string;
  category: "wrongful_block" | "account_hacked" | "misunderstanding" | "other";

  // ✅ NEW: Enhanced tracking fields
  blockEventId?: string;
  appealCount?: number;
  previousAppealId?: string;
  canReappeal?: boolean;

  // Metadata
  ipAddress?: string;
  userAgent?: string;
}

export interface UpdateAppealDTO {
  status?: "pending" | "under_review" | "approved" | "rejected";
  reviewedBy?: string;
  reviewedAt?: Date;
  adminResponse?: string;
  adminNotes?: string;
}

// ✅ ENHANCED: Advanced search filters
export interface AppealSearchFilters {
  search?: string; // Text search across multiple fields
  status?: string;
  category?: string;
  email?: string;
  startDate?: string;
  endDate?: string;
  reviewedBy?: string;
  blockEventId?: string;
}
