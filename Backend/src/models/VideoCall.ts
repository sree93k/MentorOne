import mongoose, { Schema, Document } from "mongoose";

export interface IVideoCall extends Document {
  meetingId: string;
  creatorId: string;
  participants: { userId: string; joinedAt: Date }[];
  createdAt: Date;
  endedAt?: Date;
}

const VideoCallSchema: Schema = new Schema({
  meetingId: { type: String, required: true, unique: true },
  creatorId: { type: String, required: true },
  participants: [
    {
      userId: { type: String, required: true },
      joinedAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  endedAt: { type: Date },
});

export default mongoose.model<IVideoCall>("VideoCall", VideoCallSchema);
