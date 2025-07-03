import { EService } from "../entities/serviceEntity";

export interface WelcomeFormData {
  careerGoal: string;
  interestedCareer: string;
  selectedOptions: string[];
  userType: string;
  bio?: string;
  skills?: string[];
  achievements?: string[];
  linkedinUrl?: string;
  youtubeLink?: string;
  portfolio?: string;
  mentorMotivation?: string;
  featuredArticle?: string;
  interestedNewcareer?: string;
  imageUrl?: string;
  [key: string]: any;
}

export interface GetAllServicesParams {
  page: number;
  limit: number;
  search: string;
  type?: string;
}

export interface GetAllServicesResponse {
  services: EService[];
  totalPages: number;
  currentPage: number;
}
