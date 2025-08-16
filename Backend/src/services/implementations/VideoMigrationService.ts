import ServiceModel from "../../models/serviceModel";
import IndustryStandardVideoService from "./IndustryStandardVideoService";
import { s3 } from "../../config/awsS3";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";

interface MigrationResult {
  success: boolean;
  totalServices: number;
  totalEpisodes: number;
  migratedEpisodes: number;
  failedEpisodes: number;
  errors: string[];
  summary: {
    byService: Array<{
      serviceId: string;
      title: string;
      episodes: number;
      migrated: number;
      failed: number;
    }>;
  };
}

interface MigrationOptions {
  dryRun?: boolean;
  batchSize?: number;
  onlyFailedMigrations?: boolean;
  backupOriginals?: boolean;
  updateAnalytics?: boolean;
}

class VideoMigrationService {
  private readonly BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

  /**
   * 🔄 MIGRATE ALL VIDEOS TO NEW SYSTEM
   * Comprehensive migration with safety checks
   */
  public async migrateAllVideos(options: MigrationOptions = {}): Promise<MigrationResult> {
    const result: MigrationResult = {
      success: true,
      totalServices: 0,
      totalEpisodes: 0,
      migratedEpisodes: 0,
      failedEpisodes: 0,
      errors: [],
      summary: { byService: [] }
    };

    try {
      console.log("🔄 Starting comprehensive video migration", {
        dryRun: options.dryRun || false,
        batchSize: options.batchSize || 10,
        onlyFailed: options.onlyFailedMigrations || false,
        backup: options.backupOriginals || true
      });

      // Get all services with video tutorials
      const query: any = {
        type: "DigitalProducts",
        digitalProductType: "videoTutorials",
        "exclusiveContent.episodes": { $exists: true, $ne: [] }
      };

      if (options.onlyFailedMigrations) {
        query["exclusiveContent.episodes.migrationStatus.migrationCompleted"] = { $ne: true };
      }

      const services = await ServiceModel.find(query).lean();
      result.totalServices = services.length;

      console.log(`📊 Found ${services.length} services to migrate`);

      // Process services in batches
      const batchSize = options.batchSize || 10;
      for (let i = 0; i < services.length; i += batchSize) {
        const batch = services.slice(i, i + batchSize);
        await this.processBatch(batch, result, options);
      }

      // Calculate success rate
      const successRate = result.totalEpisodes > 0 
        ? ((result.migratedEpisodes / result.totalEpisodes) * 100).toFixed(2)
        : "0";

      console.log(`✅ Migration completed: ${result.migratedEpisodes}/${result.totalEpisodes} episodes (${successRate}%)`);

      if (result.failedEpisodes > 0) {
        result.success = false;
        console.warn(`⚠️ ${result.failedEpisodes} episodes failed to migrate`);
      }

      return result;

    } catch (error: any) {
      console.error("🚫 Migration failed:", error);
      result.success = false;
      result.errors.push(`Migration failed: ${error.message}`);
      return result;
    }
  }

  /**
   * 📦 PROCESS MIGRATION BATCH
   * Process services in manageable batches
   */
  private async processBatch(
    services: any[],
    result: MigrationResult,
    options: MigrationOptions
  ): Promise<void> {
    for (const service of services) {
      try {
        const serviceResult = await this.migrateService(service, options);
        
        result.totalEpisodes += serviceResult.totalEpisodes;
        result.migratedEpisodes += serviceResult.migratedEpisodes;
        result.failedEpisodes += serviceResult.failedEpisodes;
        result.errors.push(...serviceResult.errors);
        
        result.summary.byService.push({
          serviceId: service._id.toString(),
          title: service.title,
          episodes: serviceResult.totalEpisodes,
          migrated: serviceResult.migratedEpisodes,
          failed: serviceResult.failedEpisodes
        });

      } catch (error: any) {
        console.error(`🚫 Service migration failed: ${service._id}`, error);
        result.errors.push(`Service ${service._id}: ${error.message}`);
      }
    }
  }

  /**
   * 🎬 MIGRATE SINGLE SERVICE
   * Migrate all episodes in a service
   */
  private async migrateService(service: any, options: MigrationOptions): Promise<{
    totalEpisodes: number;
    migratedEpisodes: number;
    failedEpisodes: number;
    errors: string[];
  }> {
    const serviceResult = {
      totalEpisodes: 0,
      migratedEpisodes: 0,
      failedEpisodes: 0,
      errors: []
    };

    console.log(`🎬 Migrating service: ${service.title} (${service._id})`);

    const updates: any = {};
    let hasUpdates = false;

    for (let seasonIndex = 0; seasonIndex < service.exclusiveContent.length; seasonIndex++) {
      const season = service.exclusiveContent[seasonIndex];
      
      for (let episodeIndex = 0; episodeIndex < season.episodes.length; episodeIndex++) {
        const episode = season.episodes[episodeIndex];
        serviceResult.totalEpisodes++;

        try {
          // Skip if already migrated (unless forcing retry)
          if (episode.migrationStatus?.migrationCompleted && !options.onlyFailedMigrations) {
            console.log(`⏭️ Episode already migrated: ${episode.title}`);
            serviceResult.migratedEpisodes++;
            continue;
          }

          const migrationResult = await this.migrateEpisode(episode, service, options);
          
          if (migrationResult.success) {
            // Update episode with new data
            const episodeUpdatePath = `exclusiveContent.${seasonIndex}.episodes.${episodeIndex}`;
            Object.entries(migrationResult.updates).forEach(([key, value]) => {
              updates[`${episodeUpdatePath}.${key}`] = value;
            });
            
            hasUpdates = true;
            serviceResult.migratedEpisodes++;
            console.log(`✅ Episode migrated: ${episode.title}`);
          } else {
            serviceResult.failedEpisodes++;
            serviceResult.errors.push(`Episode ${episode.title}: ${migrationResult.error}` as never);
            console.error(`❌ Episode migration failed: ${episode.title}`);
          }

        } catch (error: any) {
          serviceResult.failedEpisodes++;
          serviceResult.errors.push(`Episode ${episode.title}: ${error.message}` as never);
          console.error(`❌ Episode error: ${episode.title}`, error);
        }
      }
    }

    // Apply updates to database
    if (hasUpdates && !options.dryRun) {
      await ServiceModel.updateOne({ _id: service._id }, { $set: updates });
      console.log(`💾 Service updates saved: ${service._id}`);
    }

    return serviceResult;
  }

  /**
   * 📺 MIGRATE SINGLE EPISODE
   * Convert legacy episode to new format
   */
  private async migrateEpisode(episode: any, service: any, options: MigrationOptions): Promise<{
    success: boolean;
    updates?: any;
    error?: string;
  }> {
    try {
      console.log(`📺 Migrating episode: ${episode.title}`);

      // Extract legacy video URL/path
      const legacyUrl = episode.videoURL || episode.videoUrl;
      if (!legacyUrl) {
        return { success: false, error: "No legacy video URL found" };
      }

      // Extract S3 key from legacy URL
      const legacyS3Key = this.extractS3KeyFromUrl(legacyUrl);
      if (!legacyS3Key) {
        return { success: false, error: "Could not extract S3 key from legacy URL" };
      }

      // Verify source file exists
      const sourceExists = await this.verifyS3Object(legacyS3Key);
      if (!sourceExists) {
        return { success: false, error: `Source file not found: ${legacyS3Key}` };
      }

      // Generate new industry-standard path
      const newPath = this.generateNewVideoPath(service, episode, legacyS3Key);
      
      // Create video metadata
      const metadata = await this.extractVideoMetadata(legacyS3Key);
      
      // Copy to new location (if different)
      let finalS3Key = legacyS3Key;
      if (newPath.s3Key !== legacyS3Key && !options.dryRun) {
        const copyResult = await this.copyVideoToNewLocation(legacyS3Key, newPath.s3Key);
        if (copyResult.success) {
          finalS3Key = newPath.s3Key;
        } else {
          console.warn(`⚠️ Copy failed, using original location: ${copyResult.error}`);
        }
      }

      // Generate access token
      const accessToken = IndustryStandardVideoService['generateAccessToken'](
        newPath.secureId,
        service.mentorId.toString(),
        {
          enableWatermark: true,
          enableDRM: false,
          allowDownload: false,
          maxViewsPerUser: 1000,
          expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
        }
      );

      // Prepare episode updates
      const updates = {
        // New industry standard fields
        videoS3Key: finalS3Key,
        videoSecureId: newPath.secureId,
        videoAccessToken: accessToken,
        
        // Metadata
        videoMetadata: {
          originalName: metadata.originalName,
          fileSize: metadata.fileSize,
          mimeType: metadata.mimeType,
          checksum: metadata.checksum,
          uploadedAt: metadata.uploadedAt,
          environment: 'production'
        },
        
        // Content protection
        contentProtection: {
          securityLevel: 'private',
          enableWatermark: true,
          enableDRM: false,
          allowDownload: false,
          maxViewsPerUser: 1000
        },
        
        // Analytics initialization
        analytics: {
          totalViews: 0,
          uniqueViewers: 0,
          averageWatchTime: 0,
          completionRate: 0,
          popularityScore: 0,
          engagement: {
            likes: 0,
            dislikes: 0,
            comments: 0,
            shares: 0
          }
        },
        
        // Migration status
        migrationStatus: {
          isLegacy: true,
          migrationCompleted: true,
          migrationDate: new Date(),
          legacyBackupUrl: options.backupOriginals ? legacyUrl : undefined
        }
      };

      console.log(`✅ Episode migration prepared: ${episode.title}`);
      return { success: true, updates };

    } catch (error: any) {
      console.error(`🚫 Episode migration failed: ${episode.title}`, error);
      return { success: false, error: error.message };
    }
  }

  /**
   * 🔍 EXTRACT S3 KEY FROM URL
   * Handle various legacy URL formats
   */
  private extractS3KeyFromUrl(url: string): string | null {
    try {
      if (url.includes('amazonaws.com')) {
        const patterns = [
          /amazonaws\.com\/(.+)$/,
          /s3\.[\w-]+\.amazonaws\.com\/[\w-]+\/(.+)$/,
          /[\w-]+\.s3\.[\w-]+\.amazonaws\.com\/(.+)$/
        ];

        for (const pattern of patterns) {
          const match = url.match(pattern);
          if (match) {
            return decodeURIComponent(match[1]);
          }
        }
      }
      
      // If it's already just a key
      if (!url.includes('http')) {
        return url;
      }

      return null;
    } catch (error) {
      console.error("🚫 Failed to extract S3 key:", error);
      return null;
    }
  }

  /**
   * ✅ VERIFY S3 OBJECT EXISTS
   * Check if source file exists
   */
  private async verifyS3Object(s3Key: string): Promise<boolean> {
    try {
      await s3.headObject({
        Bucket: this.BUCKET_NAME!,
        Key: s3Key
      }).promise();
      return true;
    } catch (error) {
      // Try with .mp4 extension if missing
      if (!s3Key.includes('.')) {
        try {
          await s3.headObject({
            Bucket: this.BUCKET_NAME!,
            Key: `${s3Key}.mp4`
          }).promise();
          return true;
        } catch (error2) {
          return false;
        }
      }
      return false;
    }
  }

  /**
   * 🏗️ GENERATE NEW VIDEO PATH
   * Create industry-standard path for migrated video
   */
  private generateNewVideoPath(service: any, episode: any, legacyS3Key: string): {
    s3Key: string;
    secureId: string;
  } {
    const secureId = uuidv4();
    const timestamp = Date.now();
    
    // Extract file extension
    const extension = legacyS3Key.includes('.') 
      ? '.' + legacyS3Key.split('.').pop()
      : '.mp4';
    
    // Sanitize episode title
    const sanitizedTitle = episode.title
      .toLowerCase()
      .replace(/[^a-z0-9\-_]/g, '_')
      .replace(/_{2,}/g, '_')
      .replace(/^_|_$/g, '');

    const fileName = `${secureId}_${timestamp}_${sanitizedTitle}${extension}`;
    
    const s3Key = [
      'production',
      'video-tutorials',
      service.mentorId.toString(),
      service._id.toString(),
      fileName
    ].join('/');

    return { s3Key, secureId };
  }

  /**
   * 📊 EXTRACT VIDEO METADATA
   * Get metadata from existing S3 object
   */
  private async extractVideoMetadata(s3Key: string): Promise<any> {
    try {
      const metadata = await s3.headObject({
        Bucket: this.BUCKET_NAME!,
        Key: s3Key
      }).promise();

      // Generate checksum from ETag (remove quotes)
      const checksum = metadata.ETag?.replace(/"/g, '') || crypto.randomBytes(32).toString('hex');

      return {
        originalName: metadata.Metadata?.['original-name'] || s3Key.split('/').pop(),
        fileSize: metadata.ContentLength || 0,
        mimeType: metadata.ContentType || 'video/mp4',
        checksum,
        uploadedAt: metadata.LastModified || new Date()
      };

    } catch (error) {
      console.error("🚫 Failed to extract metadata:", error);
      return {
        originalName: s3Key.split('/').pop(),
        fileSize: 0,
        mimeType: 'video/mp4',
        checksum: crypto.randomBytes(32).toString('hex'),
        uploadedAt: new Date()
      };
    }
  }

  /**
   * 📁 COPY VIDEO TO NEW LOCATION
   * Copy video to industry-standard location
   */
  private async copyVideoToNewLocation(sourceKey: string, targetKey: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      console.log(`📁 Copying video: ${sourceKey} → ${targetKey}`);

      await s3.copyObject({
        Bucket: this.BUCKET_NAME!,
        CopySource: `${this.BUCKET_NAME}/${sourceKey}`,
        Key: targetKey,
        ServerSideEncryption: 'AES256',
        Metadata: {
          'migrated-from': sourceKey,
          'migration-date': new Date().toISOString(),
          'migration-version': '2.0'
        },
        MetadataDirective: 'REPLACE'
      }).promise();

      console.log(`✅ Video copied successfully: ${targetKey}`);
      return { success: true };

    } catch (error: any) {
      console.error(`🚫 Video copy failed: ${sourceKey} → ${targetKey}`, error);
      return { success: false, error: error.message };
    }
  }

  /**
   * 📈 MIGRATION PROGRESS REPORT
   * Get detailed migration status
   */
  public async getMigrationProgress(): Promise<{
    totalServices: number;
    totalEpisodes: number;
    migratedEpisodes: number;
    pendingEpisodes: number;
    failedEpisodes: number;
    migrationPercentage: number;
  }> {
    try {
      const allServices = await ServiceModel.find({
        type: "DigitalProducts",
        digitalProductType: "videoTutorials",
        "exclusiveContent.episodes": { $exists: true, $ne: [] }
      }).lean();

      let totalEpisodes = 0;
      let migratedEpisodes = 0;
      let failedEpisodes = 0;

      for (const service of allServices) {
        for (const season of service.exclusiveContent || []) {
          for (const episode of season.episodes || []) {
            totalEpisodes++;
            
            if (episode.migrationStatus?.migrationCompleted) {
              migratedEpisodes++;
            } else if (episode.migrationStatus?.isLegacy === false) {
              failedEpisodes++;
            }
          }
        }
      }

      const pendingEpisodes = totalEpisodes - migratedEpisodes - failedEpisodes;
      const migrationPercentage = totalEpisodes > 0 
        ? (migratedEpisodes / totalEpisodes) * 100 
        : 0;

      return {
        totalServices: allServices.length,
        totalEpisodes,
        migratedEpisodes,
        pendingEpisodes,
        failedEpisodes,
        migrationPercentage: Math.round(migrationPercentage * 100) / 100
      };

    } catch (error: any) {
      console.error("🚫 Failed to get migration progress:", error);
      throw error;
    }
  }
}

export default new VideoMigrationService();