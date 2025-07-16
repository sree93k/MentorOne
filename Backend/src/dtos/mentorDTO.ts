import mongoose from "mongoose";

// DTO for updating mentor fields via admin or specific field updates
interface UpdateMentorFieldDTO {
  field: string;
  status: string;
  reason?: string;
}

// Comprehensive DTO for mentor updates based on your schema
export interface UpdateMentorDTO {
  // Admin approval fields
  isApproved?: "Pending" | "Approved" | "Rejected";
  approvalReason?: string;
  isBlocked?: boolean;

  // Basic mentor information
  bio?: string;
  skills?: string[];
  selfIntro?: string;
  shortIntro?: string;
  displayName?: string;
  totalExperience?: string;
  mentorMotivation?: string;

  // Profile enhancement fields (editable in editProfile)
  achievements?: string;
  linkedinURL?: string;
  youtubeURL?: string; // Note: schema uses youtubeURL, not youTubeURL
  portfolio?: string;
  featuredArticle?: string;

  // Career and interests
  interestedNewCareer?: string[];

  // References and relationships
  schedules?: mongoose.Types.ObjectId[];
  mentorPolicyId?: mongoose.Types.ObjectId;
  services?: mongoose.Types.ObjectId[];
  followers?: mongoose.Types.ObjectId[];
  topTestimonials?: mongoose.Types.ObjectId[];

  // Status fields
  isOnline?: boolean;

  // Timestamps (usually handled automatically, but can be updated if needed)
  updatedAt?: Date;
}

// Specific DTO for profile editing (subset of UpdateMentorDTO)
export interface UpdateMentorProfileDTO {
  bio?: string;
  achievements?: string;
  linkedinURL?: string;
  youtubeURL?: string;
  portfolio?: string;
  featuredArticle?: string;
  skills?: string[];
  selfIntro?: string;
  shortIntro?: string;
  displayName?: string;
  mentorMotivation?: string;
}

// Export the field update DTO as well
export { UpdateMentorFieldDTO };
