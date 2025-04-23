import mongoose, { Schema } from "mongoose";

const ChattingServiceSchema = new Schema({
  duration: {
    type: Number,
    required: true,
    min: 1,
  },
  longDescription: {
    type: String,
    required: true,
    trim: true,
  },
});
