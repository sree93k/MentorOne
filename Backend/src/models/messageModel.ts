import { EMessage } from "../entities/messageEntity";
import mongoose, { Schema } from "mongoose";

const MessageSchema = new Schema<EMessage>(
  {
    sender: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    content: { type: String, trim: true, required: true },
    type: {
      type: String,
      enum: ["text", "image", "audio"],
      default: "text",
      required: true,
    },
    chat: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
    readBy: [{ type: Schema.Types.ObjectId, ref: "Users" }],
  },
  { timestamps: true }
);

const Message = mongoose.model<EMessage>("Message", MessageSchema);

export default Message;
