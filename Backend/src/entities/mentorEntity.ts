import { Document, ObjectId } from "mongoose";

export interface EMentor extends Document {
  _id: ObjectId;
  bio: string;
  skills: string[];
  selfIntro?: string;
  shortIntro?: string;
  displayName?: string;
  achievements?: string;
  services?: ObjectId[];
  linkedinURL?: string;
  youtubeURL?: string;
  portfolio?: string;
  mentorMotivation?: string;
  interestedNewCareer?: string[];
  featuredArticle?: string;
  totalExperience?: string;
  isApproved?: "Pending" | "Approved" | "Rejected";
  approvalReason?: string;
  isBlocked?: boolean;
  schedules?: ObjectId[];
  mentorPolicyId?: ObjectId;
  followers?: ObjectId[];
  topTestimonials?: ObjectId[];
  isOnline?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
