/**
 * 🔹 DIP COMPLIANCE: Migration Service Interface
 * Defines video URL to S3 key migration operations
 */
export interface IMigrationService {
  // Video URL Migration
  migrateVideoUrlsToS3Keys(): Promise<{
    success: boolean;
    migratedServices: number;
    migratedEpisodes: number;
    errors: string[];
  }>;

  // Migration Status Check
  checkMigrationStatus(): Promise<{
    totalServices: number;
    servicesWithVideoUrls: number;
    servicesWithS3Keys: number;
    needsMigration: number;
  }>;

  // Migration Rollback
  rollbackMigration(): Promise<{
    success: boolean;
    migratedServices: number;
    migratedEpisodes: number;
    errors: string[];
  }>;
}