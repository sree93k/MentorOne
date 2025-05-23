import mongoose, { Schema } from "mongoose";
import { EVideoCall } from "../entities/videoCallEntity";

const VideoCallSchema: Schema<EVideoCall> = new Schema({
  meetingId: { type: String, required: true, unique: true },
  creatorId: { type: String, ref: "User", required: true },
  participants: [
    {
      userId: { type: String, ref: "User", required: true },
      joinedAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  endedAt: { type: Date },
});

export default mongoose.model<EVideoCall>("VideoCall", VideoCallSchema);
