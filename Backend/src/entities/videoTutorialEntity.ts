import { Document, ObjectId } from "mongoose";

export interface IEpisode {
  episode: string;
  title: string;
  description: string;
  videoUrl: string;
}

export interface ISeason {
  season: string;
  episodes: IEpisode[];
}

export interface IVideoTutorial extends Document {
  _id: ObjectId;
  exclusiveContent: ISeason[];
  createdAt: Date;
}
