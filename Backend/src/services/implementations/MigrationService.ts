import ServiceModel from "../../models/serviceModel";
import SignedUrlService from "./SignedUrlService";

interface MigrationResult {
  success: boolean;
  migratedServices: number;
  migratedEpisodes: number;
  errors: string[];
}

class MigrationService {
  /**
   * 🔄 MIGRATE VIDEO URLS TO S3 KEYS
   * Convert existing videoUrl fields to videoS3Key fields for signed URL support
   */
  public async migrateVideoUrlsToS3Keys(): Promise<MigrationResult> {
    const result: MigrationResult = {
      success: false,
      migratedServices: 0,
      migratedEpisodes: 0,
      errors: []
    };

    try {
      console.log("🔄 MigrationService: Starting video URL to S3 key migration");

      // Find all services with exclusive content
      const services = await ServiceModel.find({
        "exclusiveContent.episodes.videoUrl": { $exists: true, $ne: "" }
      });

      console.log(`🔄 MigrationService: Found ${services.length} services to migrate`);

      for (const service of services) {
        let serviceModified = false;
        let episodesMigrated = 0;

        if (service.exclusiveContent) {
          for (const season of service.exclusiveContent) {
            if (season.episodes) {
              for (const episode of season.episodes) {
                if (episode.videoUrl && !episode.videoS3Key) {
                  // Extract S3 key from existing video URL
                  const s3Key = SignedUrlService.extractS3KeyFromUrl(episode.videoUrl);
                  
                  if (s3Key) {
                    episode.videoS3Key = s3Key;
                    serviceModified = true;
                    episodesMigrated++;
                    
                    console.log(`✅ MigrationService: Migrated episode ${episode.episode} - S3 Key: ${s3Key}`);
                  } else {
                    const error = `Failed to extract S3 key from URL: ${episode.videoUrl}`;
                    result.errors.push(error);
                    console.error(`🚫 MigrationService: ${error}`);
                  }
                }
              }
            }
          }
        }

        // Save the service if modified
        if (serviceModified) {
          try {
            await service.save();
            result.migratedServices++;
            result.migratedEpisodes += episodesMigrated;
            console.log(`✅ MigrationService: Saved service ${service._id} with ${episodesMigrated} migrated episodes`);
          } catch (saveError: any) {
            const error = `Failed to save service ${service._id}: ${saveError.message}`;
            result.errors.push(error);
            console.error(`🚫 MigrationService: ${error}`);
          }
        }
      }

      result.success = result.errors.length === 0;
      
      console.log("🎉 MigrationService: Migration completed", {
        success: result.success,
        migratedServices: result.migratedServices,
        migratedEpisodes: result.migratedEpisodes,
        errors: result.errors.length
      });

      return result;

    } catch (error: any) {
      console.error("🚫 MigrationService: Migration failed", error);
      result.errors.push(`Migration failed: ${error.message}`);
      return result;
    }
  }

  /**
   * 🔍 CHECK MIGRATION STATUS
   * Check how many services need migration
   */
  public async checkMigrationStatus(): Promise<{
    totalServices: number;
    servicesWithVideoUrls: number;
    servicesWithS3Keys: number;
    needsMigration: number;
  }> {
    try {
      const [
        totalServices,
        servicesWithVideoUrls,
        servicesWithS3Keys
      ] = await Promise.all([
        ServiceModel.countDocuments({ "exclusiveContent.episodes": { $exists: true } }),
        ServiceModel.countDocuments({ "exclusiveContent.episodes.videoUrl": { $exists: true, $ne: "" } }),
        ServiceModel.countDocuments({ "exclusiveContent.episodes.videoS3Key": { $exists: true, $ne: "" } })
      ]);

      const needsMigration = await ServiceModel.countDocuments({
        "exclusiveContent.episodes.videoUrl": { $exists: true, $ne: "" },
        "exclusiveContent.episodes.videoS3Key": { $exists: false }
      });

      console.log("🔍 MigrationService: Migration status", {
        totalServices,
        servicesWithVideoUrls,
        servicesWithS3Keys,
        needsMigration
      });

      return {
        totalServices,
        servicesWithVideoUrls,
        servicesWithS3Keys,
        needsMigration
      };

    } catch (error: any) {
      console.error("🚫 MigrationService: Error checking migration status", error);
      throw new Error(`Failed to check migration status: ${error.message}`);
    }
  }

  /**
   * 🔄 ROLLBACK MIGRATION
   * Remove S3 keys if needed (for testing purposes)
   */
  public async rollbackMigration(): Promise<MigrationResult> {
    const result: MigrationResult = {
      success: false,
      migratedServices: 0,
      migratedEpisodes: 0,
      errors: []
    };

    try {
      console.log("🔄 MigrationService: Starting migration rollback");

      const services = await ServiceModel.find({
        "exclusiveContent.episodes.videoS3Key": { $exists: true }
      });

      console.log(`🔄 MigrationService: Found ${services.length} services to rollback`);

      for (const service of services) {
        let serviceModified = false;
        let episodesRolledBack = 0;

        if (service.exclusiveContent) {
          for (const season of service.exclusiveContent) {
            if (season.episodes) {
              for (const episode of season.episodes) {
                if (episode.videoS3Key) {
                  episode.videoS3Key = undefined;
                  serviceModified = true;
                  episodesRolledBack++;
                }
              }
            }
          }
        }

        if (serviceModified) {
          await service.save();
          result.migratedServices++;
          result.migratedEpisodes += episodesRolledBack;
        }
      }

      result.success = true;
      console.log("🎉 MigrationService: Rollback completed", result);
      return result;

    } catch (error: any) {
      console.error("🚫 MigrationService: Rollback failed", error);
      result.errors.push(`Rollback failed: ${error.message}`);
      return result;
    }
  }
}

export default new MigrationService();