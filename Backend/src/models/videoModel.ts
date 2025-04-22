import mongoose, { Schema } from "mongoose";

const EpisodeSchema = new Schema({
  episode: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  videoUrl: { type: String, required: true }, // Store the URL after upload
});

const SeasonSchema = new Schema({
  season: { type: String, required: true },
  episodes: [EpisodeSchema],
});

const VideoTutorialSchema = new Schema({
  exclusiveContent: [SeasonSchema],
  createdAt: { type: Date, default: Date.now },
});
