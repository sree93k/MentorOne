import mongoose, { Schema } from "mongoose";
import { ENotification } from "../entities/notificationEntity";

const NotificationSchema = new Schema<ENotification>({
  recipientId: { type: String, required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  type: {
    type: String,
    enum: ["payment", "booking", "chat", "meeting"],
    required: true,
  },
  message: { type: String, required: true },
  relatedId: { type: String },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Notification", NotificationSchema);
