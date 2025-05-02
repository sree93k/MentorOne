import { required, string } from "joi";
import { EMentor } from "../entities/mentorEntity";
import mongoose, { Schema } from "mongoose";

const MentorSchema: Schema<EMentor> = new Schema(
  {
    bio: {
      type: String,
      required: true,
    },
    skills: {
      type: [String],
      required: true,
    },
    selfIntro: {
      type: String,
      required: false,
    },
    shortIntro: {
      type: String,
      required: false,
    },
    displayName: {
      type: String,
      required: false,
    },
    achievements: {
      type: [String],
      required: false,
    },
    // services: {
    //   type: [{ type: Schema.Types.ObjectId, ref: "Services" }],
    //   required: false,
    // },
    linkedinURL: {
      type: String,
      required: false,
    },
    youtubeURL: {
      type: String,
      required: false,
    },
    portfolio: {
      type: String,
      required: false,
    },
    mentorMotivation: {
      type: String,
      required: false,
    },
    featuredArticle: {
      type: String,
      required: false,
    },
    isApproved: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
      required: false,
    },
    isBlocked: {
      type: Boolean,
      required: false,
    },
    totalExperience: {
      type: String,
      required: false,
    },
    interestedNewCareer: { type: [String], required: false },
    schedules: [
      {
        type: Schema.Types.ObjectId,
        ref: "Schedule",
      },
    ],
    mentorPolicyId: {
      type: Schema.Types.ObjectId,
      ref: "MentorPolicy",
      default: null,
    },
    services: [
      {
        type: Schema.Types.ObjectId,
        ref: "Service",
      },
    ],
    followers: {
      type: [Schema.Types.ObjectId],
      required: false,
    },
    topTestimonials: {
      type: [Schema.Types.ObjectId],
      required: false,
    },
    isOnline: { type: Boolean, default: false },
  },

  {
    timestamps: true,
  }
);

const Mentor = mongoose.model<EMentor>("Mentor", MentorSchema);

export default Mentor;
