import mongoose, { Schema } from "mongoose";

const DigitalProductSchema = new Schema({
  mentorId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  type: {
    type: String,
    enum: ["douments", "videoTutorials"],
    required: true,
  },
  fileUrl: {
    type: String,
    required: false,
  },
  videoTutorials: {
    type: [Schema.Types.ObjectId],
    required: false,
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
