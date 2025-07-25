import mongoose, { Schema, model, Document } from "mongoose";
import { EUsers } from "../entities/userEntity";
import { required } from "joi";

// Define the schema
const UsersSchema: Schema<EUsers> = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: false,
    },
    phone: {
      type: Number,
      required: false,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: false,
    },
    role: {
      type: [String],
      enum: ["mentee", "mentor"],
      validate: {
        validator: (value: string[]) => value.length <= 2,
        message: "Role array cannot have more than 2 elements.",
      },
      default: ["mentee"],
    },
    activated: {
      type: Boolean,
      default: false,
    },
    mentorActivated: {
      type: Boolean,
      default: false,
    },
    profilePicture: {
      type: String,
      default: function (this: EUsers) {
        return this.gender === "male"
          ? "https://www.svgrepo.com/show/192247/man-user.svg"
          : "https://www.svgrepo.com/show/384671/account-avatar-profile-user-14.svg";
      },
    },
    profilePicturePublicId: { type: String, default: null },
    category: {
      type: String,
      enum: ["school", "college", "professional"],
      required: false,
    },
    schoolDetails: {
      type: Schema.Types.ObjectId,
      ref: "SchoolExperience",
      required: function (this: EUsers) {
        return this.category === "school";
      },
    },
    collegeDetails: {
      type: Schema.Types.ObjectId,
      ref: "CollegeExperience",
      required: function (this: EUsers) {
        return this.category === "college";
      },
    },
    professionalDetails: {
      type: Schema.Types.ObjectId,
      ref: "WorkExperience", // Fixed from "CollegeExperience"
      required: function (this: EUsers) {
        return this.category === "professional";
      },
    },
    currentType: {
      type: Map,
      of: Schema.Types.ObjectId,
      validate: {
        validator: function (value: Map<string, mongoose.Types.ObjectId>) {
          const allowedKeys = ["school", "college", "fresher", "professional"];
          return Array.from(value.keys()).every((key) =>
            allowedKeys.includes(key)
          );
        },
        message:
          "currentType keys must be either school, college, fresher, or professional",
      },
      required: false,
    },
    bio: {
      type: String,
      required: function (this: EUsers) {
        return this.role?.includes("mentor") && this.mentorActivated === true;
      },
    },
    skills: {
      type: [{ type: String }],
      required: function (this: EUsers) {
        return this.role?.includes("mentor") && this.mentorActivated === true;
      },
    },
    selfIntro: {
      type: String,
      required: function (this: EUsers) {
        return this.role?.includes("mentor") && this.mentorActivated === true;
      },
    },
    achievements: {
      type: String,
      required: function (this: EUsers) {
        return this.role?.includes("mentor") && this.mentorActivated === true;
      },
    },
    mentorId: {
      type: Schema.Types.ObjectId,
      ref: "Mentor",
      required: false,
    },
    menteeId: {
      type: Schema.Types.ObjectId,
      ref: "Mentee",
      required: false,
    },
    bookings: {
      type: Schema.Types.Mixed,
      required: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: [String],
      default: [],
    },
    isOnline: {
      type: {
        status: {
          type: Boolean,
          default: false,
          required: false,
        },
        role: {
          type: String,
          enum: ["mentor", "mentee"],
          default: null,
          required: false,
        },
      },
      default: { status: false, role: null },
      required: false,
    },
  },
  {
    collection: "Users",
    timestamps: true,
  }
);

const Users = model<EUsers>("Users", UsersSchema);

export default Users;
