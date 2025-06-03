import mongoose, { Schema } from "mongoose";
import { ENotification } from "../entities/notificationEntity";

const NotificationSchema = new Schema<ENotification>({
  recipientId: { type: String, required: true },
  type: {
    type: String,
    enum: ["payment", "booking", "chat", "meeting"],
    required: true,
  },
  message: { type: String, required: true },
  relatedId: { type: String },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" }, // Reference to Users model
});

export default mongoose.model("Notification", NotificationSchema);
