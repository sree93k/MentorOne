import mongoose, { Schema } from "mongoose";
import { IOnlineService } from "../entities/onlineServcieEntity";

const OnlineServiceSchema: Schema = new Schema(
  {
    mentorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
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
      min: 5,
    },
    longDescription: {
      type: String,
      required: true,
      trim: true,
      minlength: 20,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    collection: "OnlineService",
    timestamps: true,
  }
);

const OnlineServiceModel = mongoose.model<IOnlineService>(
  "OnlineService",
  OnlineServiceSchema
);

export default OnlineServiceModel;
