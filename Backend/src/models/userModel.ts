import mongoose, { Schema, model, Document, ObjectId } from "mongoose";
import { EUsers } from "../entities/userEntity";

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
      required: [false, "Password is required"],
    },
    phone: {
      type: Number,
      required: false,
    },
    dob: {
      type: Date,
      required: false,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: [false, "Gender is required"],
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
    profilePicture: {
      type: String,
      default: function (this: EUsers) {
        return this.gender === "male"
          ? "https://www.svgrepo.com/show/192247/man-user.svg"
          : "https://www.svgrepo.com/show/384671/account-avatar-profile-user-14.svg";
      },
    },
    category: {
      type: String,
      enum: ["school", "college", "professional"],
      required: [false, "Category is required"],
    },
    schoolDetails: {
      type: Schema.Types.ObjectId,
      required: function (this: EUsers) {
        return this.category === "school";
      },
    },
    collegeDetails: {
      type: Schema.Types.ObjectId,
      required: function (this: EUsers) {
        return this.category === "college";
      },
    },
    professionalDetails: {
      type: Schema.Types.ObjectId,
      required: function (this: EUsers) {
        return this.category === "professional";
      },
    },
    previousSchools: {
      type: [Schema.Types.ObjectId],
      required: false,
    },
    previousColleges: {
      type: [Schema.Types.ObjectId],
      required: false,
    },
    workHistory: {
      type: [Schema.Types.ObjectId],
      required: false,
    },
    bio: {
      type: String,
      required: function (this: EUsers) {
        return this.role?.includes("mentor") || false;
      },
    },
    skills: {
      type: String,
      required: function (this: EUsers) {
        return this.role?.includes("mentor") || false;
      },
    },
    selfIntro: {
      type: String,
      required: function (this: EUsers) {
        return this.role?.includes("mentor") || false;
      },
    },
    achievements: {
      type: String,
      required: function (this: EUsers) {
        return this.role?.includes("mentor") || false;
      },
    },
    mentorId: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "Users",
    },
    bookings: {
      type: Schema.Types.Mixed, // To be defined later
      required: false,
    },
    subscription: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "Subscription",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: [String],
      default: [],
    },
  },
  {
    collection: "Users",
    timestamps: true,
  }
);

// Create the model
const Users = model<EUsers>("Users", UsersSchema);

export default Users;
