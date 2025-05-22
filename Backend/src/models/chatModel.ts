import { EChat } from "../entities/chatEntity";
import mongoose, { Schema } from "mongoose";

const ChatSchema = new Schema<EChat>(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: Schema.Types.ObjectId, ref: "Users" }],
    roles: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "Users" },
        role: { type: String, enum: ["mentee", "mentor"], required: true },
      },
    ],
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking" },
    latestMessage: { type: Schema.Types.ObjectId, ref: "Message" },
    groupAdmin: { type: Schema.Types.ObjectId, ref: "Users" },
  },
  { timestamps: true }
);

const Chat = mongoose.model<EChat>("Chat", ChatSchema);

export default Chat;
