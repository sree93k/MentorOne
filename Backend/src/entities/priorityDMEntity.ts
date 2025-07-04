import { Document, Types } from "mongoose";

export interface EPriorityDM extends Document {
  serviceId: Types.ObjectId;
  mentorId: Types.ObjectId;
  menteeId: Types.ObjectId;
  bookingId: Types.ObjectId;
  content: string;
  pdfFiles: Array<{
    fileName: string;
    s3Key: string;
    url: string;
    uploadedAt: Date;
  }>;
  mentorReply?: {
    content?: string;
    pdfFiles?: Array<{
      fileName: string;
      s3Key: string;
      url: string;
      uploadedAt: Date;
    }>;
    repliedAt?: Date;
  };
  status: "pending" | "replied" | "closed";
  menteeTestimonial?: {
    comment?: string;
    rating?: number;
    submittedAt?: Date;
  };
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}
