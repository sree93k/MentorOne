/**
 * 🔹 DIP COMPLIANCE: Industry Standard Video Service Interface
 * Defines enterprise-grade video processing and management operations
 */
export interface IIndustryStandardVideoService {
  // Video Processing Pipeline
  processVideo(
    inputS3Key: string,
    processingOptions: {
      outputFormats: Array<{
        format: 'mp4' | 'webm' | 'hls' | 'dash';
        quality: string;
        resolution: string;
        bitrate: string;
      }>;
      enableThumbnails?: boolean;
      enableChapters?: boolean;
      enableCaptions?: boolean;
      watermark?: {
        enabled: boolean;
        text?: string;
        imagePath?: string;
        position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
      };
    }
  ): Promise<{
    success: boolean;
    processingId: string;
    estimatedDuration: number;
    outputKeys?: string[];
    error?: string;
  }>;

  // Quality Control
  validateVideoQuality(
    videoS3Key: string,
    standards: {
      minResolution?: string;
      maxFileSize?: number;
      allowedCodecs?: string[];
      minDuration?: number;
      maxDuration?: number;
    }
  ): Promise<{
    isValid: boolean;
    validationResults: {
      resolution: { valid: boolean; actual: string; required?: string };
      fileSize: { valid: boolean; actual: number; limit?: number };
      codec: { valid: boolean; actual: string; allowed?: string[] };
      duration: { valid: boolean; actual: number; min?: number; max?: number };
    };
    recommendations?: string[];
  }>;

  // Metadata Management
  extractVideoMetadata(
    videoS3Key: string
  ): Promise<{
    duration: number;
    resolution: { width: number; height: number };
    frameRate: number;
    bitrate: number;
    codec: string;
    audioCodec?: string;
    fileSize: number;
    format: string;
    hasAudio: boolean;
    hasVideo: boolean;
    chapters?: Array<{
      title: string;
      startTime: number;
      endTime: number;
    }>;
  }>;

  updateVideoMetadata(
    videoS3Key: string,
    metadata: {
      title?: string;
      description?: string;
      tags?: string[];
      category?: string;
      language?: string;
      chapters?: Array<{
        title: string;
        startTime: number;
        endTime: number;
      }>;
    }
  ): Promise<{
    success: boolean;
    updatedFields: string[];
    error?: string;
  }>;

  // Security & DRM
  applyDRMProtection(
    videoS3Key: string,
    drmSettings: {
      provider: 'widevine' | 'fairplay' | 'playready';
      licenseUrl: string;
      encryptionKey: string;
      keyRotationInterval?: number;
    }
  ): Promise<{
    success: boolean;
    protectedVideoKey?: string;
    licenseInfo?: any;
    error?: string;
  }>;

  // Compliance & Standards
  validateIndustryCompliance(
    videoS3Key: string,
    standards: Array<'GDPR' | 'CCPA' | 'COPPA' | 'WCAG' | 'Section508'>
  ): Promise<{
    compliant: boolean;
    complianceResults: Record<string, {
      compliant: boolean;
      issues?: string[];
      recommendations?: string[];
    }>;
  }>;

  // Performance Monitoring
  getProcessingMetrics(
    timeRange: {
      startDate: Date;
      endDate: Date;
    }
  ): Promise<{
    totalVideosProcessed: number;
    averageProcessingTime: number;
    successRate: number;
    errorBreakdown: Record<string, number>;
    resourceUtilization: {
      cpu: number;
      memory: number;
      storage: number;
    };
  }>;
}