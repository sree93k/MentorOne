import mongoose, { Schema } from "mongoose";
import { EService } from "../entities/serviceEntity";

const ServiceSchema: Schema = new Schema(
  {
    mentorId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    type: {
      type: String,
      enum: ["1-1Call", "priorityDM", "DigitalProducts"],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    technology: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    duration: {
      type: Number,
      min: 5,
    },
    longDescription: {
      type: String,
      trim: true,
      minlength: 20,
    },
    oneToOneType: {
      type: String,
      enum: ["chat", "video"],
    },
    digitalProductType: {
      type: String,
      enum: ["documents", "videoTutorials"],
    },
    fileUrl: {
      type: String,
    },
    exclusiveContent: [
      {
        season: { type: String },
        episodes: [
          {
            episode: { type: String },
            title: { type: String },
            description: { type: String },
            
            // 🔄 LEGACY SUPPORT (Deprecated)
            videoUrl: { type: String }, // Legacy - full S3 URLs (deprecated)
            videoURL: { type: String }, // Legacy - database inconsistency fix
            
            // 🎬 INDUSTRY STANDARD VIDEO SYSTEM
            videoS3Key: { type: String }, // Secure S3 key path
            videoSecureId: { type: String }, // Unique secure identifier
            videoAccessToken: { type: String }, // Encrypted access token
            
            // 📊 VIDEO METADATA
            videoMetadata: {
              originalName: { type: String },
              fileSize: { type: Number },
              mimeType: { type: String },
              duration: { type: Number }, // in seconds
              resolution: { type: String }, // e.g., "1920x1080"
              bitrate: { type: Number }, // in kbps
              checksum: { type: String }, // SHA-256 hash
              uploadedAt: { type: Date },
              lastAccessed: { type: Date },
              environment: { 
                type: String, 
                enum: ['development', 'staging', 'production'],
                default: 'production'
              }
            },
            
            // 🛡️ CONTENT PROTECTION
            contentProtection: {
              securityLevel: { 
                type: String, 
                enum: ['public', 'private', 'restricted'],
                default: 'private'
              },
              enableWatermark: { type: Boolean, default: true },
              watermarkText: { type: String },
              enableDRM: { type: Boolean, default: false },
              allowDownload: { type: Boolean, default: false },
              maxViewsPerUser: { type: Number, default: 100 },
              expiryDate: { type: Date },
              restrictedDomains: [{ type: String }], // Domain whitelist
              allowedCountries: [{ type: String }], // Country codes
            },
            
            // 📈 ANALYTICS
            analytics: {
              totalViews: { type: Number, default: 0 },
              uniqueViewers: { type: Number, default: 0 },
              averageWatchTime: { type: Number, default: 0 }, // in seconds
              completionRate: { type: Number, default: 0 }, // percentage
              lastViewedAt: { type: Date },
              popularityScore: { type: Number, default: 0 },
              engagement: {
                likes: { type: Number, default: 0 },
                dislikes: { type: Number, default: 0 },
                comments: { type: Number, default: 0 },
                shares: { type: Number, default: 0 }
              }
            },
            
            // 🔄 MIGRATION STATUS
            migrationStatus: {
              isLegacy: { type: Boolean, default: false },
              migrationCompleted: { type: Boolean, default: false },
              migrationDate: { type: Date },
              legacyBackupUrl: { type: String }
            }
          },
        ],
      },
    ],
    stats: {
      views: { type: Number, default: 0 },
      bookings: { type: Number, default: 0 },
      earnings: { type: Number, default: 0 },
      conversions: { type: String, default: "0%" },
    },
    slot: {
      type: Schema.Types.ObjectId,
      ref: "Schedule",
      required: false,
    },
  },
  {
    collection: "Service",
    timestamps: true,
  }
);

const ServiceModel = mongoose.model<EService>("Service", ServiceSchema);

export default ServiceModel;
