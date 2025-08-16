import mongoose, { Document } from "mongoose";

// 📊 Video Metadata Interface
export interface VideoMetadata {
  originalName: string;
  fileSize: number;
  mimeType: string;
  duration?: number; // in seconds
  resolution?: string; // e.g., "1920x1080"
  bitrate?: number; // in kbps
  checksum: string; // SHA-256 hash
  uploadedAt: Date;
  lastAccessed?: Date;
  environment: 'development' | 'staging' | 'production';
}

// 🛡️ Content Protection Interface
export interface ContentProtection {
  securityLevel: 'public' | 'private' | 'restricted';
  enableWatermark: boolean;
  watermarkText?: string;
  enableDRM: boolean;
  allowDownload: boolean;
  maxViewsPerUser: number;
  expiryDate?: Date;
  restrictedDomains?: string[]; // Domain whitelist
  allowedCountries?: string[]; // Country codes
}

// 📈 Analytics Interface
export interface VideoAnalytics {
  totalViews: number;
  uniqueViewers: number;
  averageWatchTime: number; // in seconds
  completionRate: number; // percentage
  lastViewedAt?: Date;
  popularityScore: number;
  engagement: {
    likes: number;
    dislikes: number;
    comments: number;
    shares: number;
  };
}

// 🔄 Migration Status Interface
export interface MigrationStatus {
  isLegacy: boolean;
  migrationCompleted: boolean;
  migrationDate?: Date;
  legacyBackupUrl?: string;
}

// 🎬 Enhanced Episode Interface
export interface Episode {
  episode: string;
  title: string;
  description: string;
  
  // 🔄 LEGACY SUPPORT (Deprecated)
  videoUrl?: string; // Legacy - full S3 URLs (deprecated)
  videoURL?: string; // Legacy - database inconsistency fix
  
  // 🎬 INDUSTRY STANDARD VIDEO SYSTEM
  videoS3Key?: string; // Secure S3 key path
  videoSecureId?: string; // Unique secure identifier
  videoAccessToken?: string; // Encrypted access token
  
  // 📊 VIDEO METADATA
  videoMetadata?: VideoMetadata;
  
  // 🛡️ CONTENT PROTECTION
  contentProtection?: ContentProtection;
  
  // 📈 ANALYTICS
  analytics?: VideoAnalytics;
  
  // 🔄 MIGRATION STATUS
  migrationStatus?: MigrationStatus;
}

// 🏗️ Enhanced Service Interface
export interface EService extends Document {
  _id: string;
  mentorId: mongoose.Types.ObjectId;
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
    episodes: Episode[];
  }[];
  stats?: {
    views: number;
    bookings: number;
    earnings: number;
    conversions: string;
  };
  slot?: mongoose.Types.ObjectId;
}
