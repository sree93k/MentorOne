import mongoose, { Schema } from "mongoose";

const ChatSchema = new Schema(
  {
    chatName: { type: String, trim: true }, // Optional name for the chat
    isGroupChat: { type: Boolean, default: false }, // Support group chats
    users: [{ type: Schema.Types.ObjectId, ref: "Users" }], // Participants
    roles: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "Users" },
        role: { type: String, enum: ["mentee", "mentor"], required: true },
      },
    ], // Track user roles
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking" }, // Link to Booking
    latestMessage: { type: Schema.Types.ObjectId, ref: "Message" }, // Latest message
    groupAdmin: { type: Schema.Types.ObjectId, ref: "Users" }, // For group chats
  },
  { timestamps: true }
);

export default mongoose.model("Chat", ChatSchema);
