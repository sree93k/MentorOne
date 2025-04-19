import mongoose from "mongoose";

const EpisodeSchema = new mongoose.Schema({
  episode: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  videoUrl: { type: String, required: true }, // Store the URL after upload
});

const SeasonSchema = new mongoose.Schema({
  season: { type: String, required: true },
  episodes: [EpisodeSchema],
});

const ServiceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  exclusiveContent: [SeasonSchema],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Service ||
  mongoose.model("Service", ServiceSchema);
