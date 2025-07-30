// NEW FILE - Create this file
import mongoose, { Schema, model, Document } from "mongoose";

export interface IAuditLog extends Document {
  adminId: string;
  targetUserId: string;
  action:
    | "BLOCKED"
    | "UNBLOCKED"
    | "APPEAL_SUBMITTED"
    | "APPEAL_APPROVED"
    | "APPEAL_REJECTED";
  reason?: string;
  timestamp: Date;
  ipAddress?: string;
  metadata?: any;
}

const AuditLogSchema: Schema<IAuditLog> = new Schema(
  {
    adminId: { type: String, required: true },
    targetUserId: { type: String, required: true },
    action: {
      type: String,
      enum: [
        "BLOCKED",
        "UNBLOCKED",
        "APPEAL_SUBMITTED",
        "APPEAL_APPROVED",
        "APPEAL_REJECTED",
      ],
      required: true,
    },
    reason: { type: String },
    timestamp: { type: Date, default: Date.now },
    ipAddress: { type: String },
    metadata: { type: Schema.Types.Mixed },
  },
  {
    collection: "AuditLogs",
    timestamps: true,
  }
);

export default model<IAuditLog>("AuditLog", AuditLogSchema);
