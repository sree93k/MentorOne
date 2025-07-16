import mongoose from "mongoose";

export interface CreateServiceDTO {
  mentorId: mongoose.Types.ObjectId | string;
  type: "1-1Call" | "priorityDM" | "DigitalProducts";
  title: string;
  amount: number;
  shortDescription: string;
  duration?: number;
  longDescription?: string;
  oneToOneType?: "chat" | "video";
  digitalProductType?: "documents" | "videoTutorials";
  fileUrl?: string;
  exclusiveContent?: {
    season: string;
    episodes: {
      episode: string;
      title: string;
      description: string;
      videoUrl: string;
    }[];
  }[];
  slot?: mongoose.Types.ObjectId | string;
}

export interface UpdateServiceDTO {
  title?: string;
  amount?: number;
  shortDescription?: string;
  duration?: number;
  longDescription?: string;
  oneToOneType?: "chat" | "video";
  digitalProductType?: "documents" | "videoTutorials";
  fileUrl?: string;
  exclusiveContent?: {
    season: string;
    episodes: {
      episode: string;
      title: string;
      description: string;
      videoUrl: string;
    }[];
  }[];
  slot?: mongoose.Types.ObjectId | string;
  stats?: {
    views?: number;
    bookings?: number;
    earnings?: number;
    conversions?: string;
  };
}

export interface ServiceFilterDTO {
  mentorId?: mongoose.Types.ObjectId | string;
  type?: "1-1Call" | "priorityDM" | "DigitalProducts";
  oneToOneType?: "chat" | "video";
  digitalProductType?: "documents" | "videoTutorials";
  minAmount?: number;
  maxAmount?: number;
  search?: string;
}

export interface ServiceStatsDTO {
  views: number;
  bookings: number;
  earnings: number;
  conversions: string;
}

export interface VideoTutorialFilterDTO {
  type?: string;
  searchQuery?: string;
  page?: number;
  limit?: number;
}

export interface ServiceValidationDTO {
  mentorId: string;
  type: string;
  title: string;
  amount: number;
  shortDescription: string;
  duration?: number;
  longDescription?: string;
  oneToOneType?: string;
  digitalProductType?: string;
  fileUrl?: string;
  exclusiveContent?: any[];
}
