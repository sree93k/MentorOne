import mongoose, { Schema } from "mongoose";

const OnlineServiceSchema = new Schema({
  mentorId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  type: {
    type: String,
    enum: ["chat", "videoCall", "priorityDM"],
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  longDescription: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});
