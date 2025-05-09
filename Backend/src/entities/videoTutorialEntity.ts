import { Document, ObjectId } from "mongoose";

export interface EEpisode {
  episode: string;
  title: string;
  description: string;
  videoUrl: string;
}

export interface ISeason {
  season: string;
  episodes: EEpisode[];
}

export interface EVideoTutorial extends Document {
  _id: ObjectId;
  exclusiveContent: ISeason[];
  createdAt: Date;
}
