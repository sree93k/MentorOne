/**
 * 🔹 DIP COMPLIANCE: Video Migration Service Interface
 * Defines video migration and data transfer operations
 */
export interface IVideoMigrationService {
  // Migration Planning
  createMigrationPlan(
    sourceConfig: {
      provider: 'aws' | 'gcp' | 'azure' | 'local';
      credentials: any;
      bucketName?: string;
      region?: string;
    },
    targetConfig: {
      provider: 'aws' | 'gcp' | 'azure' | 'local';
      credentials: any;
      bucketName?: string;
      region?: string;
    },
    migrationOptions: {
      batchSize?: number;
      preserveMetadata?: boolean;
      enableCompression?: boolean;
      validateIntegrity?: boolean;
    }
  ): Promise<{
    planId: string;
    estimatedDuration: number;
    estimatedCost: number;
    totalFiles: number;
    totalSize: number;
    migrationSteps: Array<{
      step: string;
      estimatedTime: number;
      dependencies: string[];
    }>;
  }>;

  // Migration Execution
  executeMigration(
    planId: string,
    options?: {
      dryRun?: boolean;
      resumeFromStep?: string;
      parallelTransfers?: number;
    }
  ): Promise<{
    success: boolean;
    migrationId: string;
    status: 'queued' | 'running' | 'paused' | 'completed' | 'failed';
    error?: string;
  }>;

  // Progress Monitoring
  getMigrationProgress(
    migrationId: string
  ): Promise<{
    status: 'queued' | 'running' | 'paused' | 'completed' | 'failed';
    progress: {
      percentage: number;
      filesTransferred: number;
      totalFiles: number;
      bytesTransferred: number;
      totalBytes: number;
      currentStep: string;
      estimatedTimeRemaining: number;
    };
    errors: Array<{
      file: string;
      error: string;
      timestamp: Date;
      retryCount: number;
    }>;
  }>;

  // Migration Control
  pauseMigration(migrationId: string): Promise<{ success: boolean; error?: string }>;
  
  resumeMigration(migrationId: string): Promise<{ success: boolean; error?: string }>;
  
  cancelMigration(migrationId: string): Promise<{ success: boolean; error?: string }>;

  // Data Integrity
  validateMigrationIntegrity(
    migrationId: string,
    options?: {
      checkChecksums?: boolean;
      validateMetadata?: boolean;
      samplePercentage?: number;
    }
  ): Promise<{
    valid: boolean;
    totalChecked: number;
    integrityResults: {
      checksumMatches: number;
      checksumMismatches: number;
      metadataMatches: number;
      metadataMismatches: number;
      missingFiles: number;
    };
    issues: Array<{
      file: string;
      issue: 'checksum_mismatch' | 'metadata_mismatch' | 'missing_file';
      details: string;
    }>;
  }>;

  // Rollback Operations
  createRollbackPlan(
    migrationId: string
  ): Promise<{
    rollbackPlanId: string;
    affectedFiles: number;
    estimatedDuration: number;
    rollbackSteps: Array<{
      step: string;
      action: 'restore' | 'delete' | 'update';
      files: string[];
    }>;
  }>;

  executeRollback(
    rollbackPlanId: string
  ): Promise<{
    success: boolean;
    rollbackId: string;
    status: 'running' | 'completed' | 'failed';
    error?: string;
  }>;

  // Migration History
  getMigrationHistory(
    filters?: {
      status?: string;
      dateRange?: {
        startDate: Date;
        endDate: Date;
      };
      source?: string;
      target?: string;
    }
  ): Promise<Array<{
    migrationId: string;
    planId: string;
    status: string;
    startTime: Date;
    endTime?: Date;
    filesTransferred: number;
    totalFiles: number;
    success: boolean;
    errors: number;
  }>>;
}