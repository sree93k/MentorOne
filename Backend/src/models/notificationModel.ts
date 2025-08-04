import mongoose, { Schema } from "mongoose";
import { ENotification } from "../entities/notificationEntity";

const NotificationSchema = new Schema<ENotification>({
  recipientId: { type: String, required: true },
  targetRole: {
    type: String,
    enum: ["mentor", "mentee", "both"],
    required: true,
    default: "both",
  },
  type: {
    type: String,
    // 📍 FIXED: Add booking_reminder to enum
    enum: [
      "payment",
      "booking",
      "chat",
      "meeting",
      "booking_reminder",
      "contact_response",
    ],
    required: true,
  },
  message: { type: String, required: true },
  relatedId: { type: String },
  isRead: { type: Boolean, default: false },
  isSeen: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
});

// Indexes for efficient queries
NotificationSchema.index({ recipientId: 1, targetRole: 1, isRead: 1 });
NotificationSchema.index({ recipientId: 1, targetRole: 1, isSeen: 1 });
NotificationSchema.index({ createdAt: 1 });

export default mongoose.model("Notification", NotificationSchema);
