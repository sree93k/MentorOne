import { Document, Schema, ObjectId } from "mongoose";
import { ESchoolExperience } from "../entities/schoolEntity";
import { ECollegeExperience } from "./collegeEntity";
import { EWorkExperience } from "./professionalEnitity";
export interface EUsers extends Document {
  _id: ObjectId | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  password: string | null;
  phone: Number | null;
  gender: string | null;
  role: string[] | null;
  activated: boolean | null;
  mentorActivated: boolean | null;
  profilePicture: string | null;
  profilePicturePublicId: string | null;
  // Category-specific details
  category: "school" | "college" | "professional" | null;
  currentType: object | null;
  schoolDetails?: ESchoolExperience | null; // For school students
  collegeDetails?: ECollegeExperience | null; // For college students/freshers
  professionalDetails?: EWorkExperience | null; // For professionals
  // Mentor-specific fields
  bio?: string | null;
  skills?: string | null;
  selfIntro?: string | null;
  achievements?: string | null;
  // Relationships
  mentorId?: ObjectId | null;
  menteeId?: ObjectId | null; // If a mentee, references their mentor
  bookings?: object | null; // To be defined later
  isBlocked?: boolean | null;
  refreshToken?: string[] | null;
  isOnline: {
    status: boolean;
    role: "mentor" | "mentee" | null;
  } | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}
