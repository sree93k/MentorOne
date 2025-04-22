import mongoose, { Schema } from "mongoose";
import { IDigitalProduct } from "../entities/digitalProductEntity";

const DigitalProductSchema: Schema = new Schema(
  {
    mentorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["documents", "videoTutorials"],
      required: true,
    },
    fileUrl: {
      type: String,
      required: function (this: any) {
        return this.type === "documents";
      },
    },
    videoTutorials: {
      type: [{ type: Schema.Types.ObjectId, ref: "VideoTutorial" }],
      required: function (this: any) {
        return this.type === "videoTutorials";
      },
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    collection: "DigitalProduct",
    timestamps: true,
  }
);

const DigitalProductModel = mongoose.model<IDigitalProduct>(
  "DigitalProduct",
  DigitalProductSchema
);

export default DigitalProductModel;
