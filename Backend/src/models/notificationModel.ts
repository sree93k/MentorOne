// import mongoose, { Schema } from "mongoose";
// import { ENotification } from "../entities/notificationEntity";

// const NotificationSchema = new Schema<ENotification>({
//   recipientId: { type: String, required: true },
//   targetRole: {
//     type: String,
//     enum: ["mentor", "mentee", "both"],
//     required: true,
//     default: "both",
//   }, // NEW FIELD
//   type: {
//     type: String,
//     enum: ["payment", "booking", "chat", "meeting"],
//     required: true,
//   },
//   message: { type: String, required: true },
//   relatedId: { type: String },
//   isRead: { type: Boolean, default: false },
//   createdAt: { type: Date, default: Date.now },
//   senderId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
// });

// // Add compound index for efficient role-based queries
// NotificationSchema.index({ recipientId: 1, targetRole: 1, isRead: 1 });

// export default mongoose.model("Notification", NotificationSchema);
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
    enum: ["payment", "booking", "chat", "meeting"],
    required: true,
  },
  message: { type: String, required: true },
  relatedId: { type: String },
  isRead: { type: Boolean, default: false },
  isSeen: { type: Boolean, default: false }, // ✅ NEW FIELD
  createdAt: { type: Date, default: Date.now },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
});

// ✅ UPDATED INDEXES
NotificationSchema.index({ recipientId: 1, targetRole: 1, isRead: 1 });
NotificationSchema.index({ recipientId: 1, targetRole: 1, isSeen: 1 }); // ✅ NEW INDEX
NotificationSchema.index({ createdAt: 1 }); // ✅ NEW INDEX for 30-day limit

export default mongoose.model("Notification", NotificationSchema);
