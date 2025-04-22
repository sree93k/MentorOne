import mongoose, { Schema } from "mongoose";
import { IVideoTutorial } from "../entities/videoTutorialEntity";

const EpisodeSchema: Schema = new Schema({
  episode: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  videoUrl: { type: String, required: true },
});

const SeasonSchema: Schema = new Schema({
  season: { type: String, required: true },
  episodes: [EpisodeSchema],
});

const VideoTutorialSchema: Schema = new Schema(
  {
    exclusiveContent: [SeasonSchema],
    createdAt: { type: Date, default: Date.now },
  },
  {
    collection: "VideoTutorial",
    timestamps: true,
  }
);

const VideoTutorialModel = mongoose.model<IVideoTutorial>(
  "VideoTutorial",
  VideoTutorialSchema
);

export default VideoTutorialModel;
