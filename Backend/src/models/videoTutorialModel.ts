import mongoose, { Schema } from "mongoose";
import { EVideoTutorial } from "../entities/videoTutorialEntity";

const videoTutorialSchema: Schema = new mongoose.Schema(
  {
    exclusiveContent: [
      {
        season: { type: String, required: true },
        episodes: [
          {
            episode: { type: String, required: true },
            title: { type: String, required: true },
            description: { type: String, required: true },
            videoUrl: { type: String, required: true },
          },
        ],
      },
    ],
  },
  {
    collection: "VideoTutorial",
    timestamps: true,
  }
);

const VideoTutorialModel = mongoose.model<EVideoTutorial>(
  "VideoTutorial",
  videoTutorialSchema
);

export default VideoTutorialModel;
