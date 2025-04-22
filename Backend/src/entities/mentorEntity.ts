import { Document, Schema, ObjectId } from "mongoose";

export interface EMentor extends Document {
  _id: ObjectId | null;
  bio: string | null;
  skills: string[] | null;
  selfIntro: string | null;
  shortIntro: string | null;
  displayName: string | null;
  achievements: string[] | null;
  services: ObjectId[] | null;
  linkedinURL: string | null;
  youtubeURL: string | null;
  portfolio: string | null;
  mentorMotivation: string | null;
  interestedNewCareer: string[] | null;
  featuredArticle: string | null;
  totalExperience: string | null;
  isApproved: string | null;
  isBlocked: boolean | null;
  schedules: ObjectId[] | null;
  mentorPolicyId: ObjectId | null;
  followers: ObjectId[] | null;
  topTestimonials: ObjectId[] | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}
