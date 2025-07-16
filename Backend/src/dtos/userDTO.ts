// src/dtos/userDTO.ts
import { ObjectId } from "mongoose";

export interface CreateUserDTO {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phone?: number;
  gender?: "male" | "female";
  role?: string[];
  profilePicture?: string;
  category?: "school" | "college" | "professional";
}

export interface UpdateUserDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: number;
  gender?: "male" | "female";
  profilePicture?: string;
  bio?: string;
  skills?: string[];
  selfIntro?: string;
  achievements?: string;
  isBlocked?: boolean;
  mentorActivated?: boolean;
  activated?: boolean;
}

export interface UserProfileDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: number;
  gender?: string;
  role: string[];
  profilePicture?: string;
  bio?: string;
  skills?: string[];
  activated: boolean;
  mentorActivated: boolean;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MentorProfileDTO extends UserProfileDTO {
  mentorId: string;
  achievements?: string;
  linkedinURL?: string;
  youtubeURL?: string;
  portfolio?: string;
  featuredArticle?: string;
  isApproved: string;
  topTestimonials?: any[];
  services?: any[];
  education?: {
    schoolName?: string;
    collegeName?: string;
    city?: string;
  };
  workExperience?: {
    company: string;
    jobRole: string;
    city?: string;
  };
}

export interface MenteeSearchFiltersDTO {
  role?: string;
  page?: number;
  limit?: number;
  searchQuery?: string;
}

export interface PaginatedMentorsDTO {
  mentors: MentorProfileDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface OnlineStatusDTO {
  status: boolean;
  role: "mentor" | "mentee" | null;
}

export interface UpdateOnlineStatusDTO {
  userId: string;
  isOnline: boolean;
  role: "mentor" | "mentee" | null;
}

export interface UserStatsDTO {
  totalUsers: number;
  totalMentors: number;
  totalMentees: number;
  totalBoth: number;
  approvalPending: number;
}

export interface WelcomeFormDataDTO {
  careerGoal?: string;
  interestedCareer?: string;
  selectedOptions?: string[];
  userType: string;
  bio?: string;
  skills?: string[];
  achievements?: string;
  linkedinUrl?: string;
  youtubeLink?: string;
  portfolio?: string;
  mentorMotivation?: string;
  featuredArticle?: string;
  interestedNewcareer?: string;
  imageUrl?: string;
  [key: string]: any;
}

export interface UserExperienceUpdateDTO {
  id: string;
  userType: string;
  experienceId: string;
  menteeId?: string;
  mentorId?: string;
  role: string[];
  profilePicture?: string;
}

export interface RefreshTokenDTO {
  userId: string;
  refreshToken: string;
}

export interface PasswordUpdateDTO {
  currentPassword: string;
  newPassword: string;
}

export interface GoogleAuthDTO {
  email: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
}

export interface AuthResponseDTO {
  user: UserProfileDTO;
  accessToken: string;
  refreshToken: string;
}

export interface SearchUsersDTO {
  searchQuery: string;
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface TopMentorsDTO {
  userId: string;
  mentorId: string;
  name: string;
  bio?: string;
  role: string;
  work: string;
  workRole: string;
  profileImage?: string;
  badge: string;
  isBlocked: boolean;
  isApproved: string;
  bookingCount?: number;
  averageRating?: number;
}
