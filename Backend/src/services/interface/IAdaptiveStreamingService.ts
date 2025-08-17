/**
 * 🔹 DIP COMPLIANCE: Adaptive Streaming Service Interface
 * Defines adaptive bitrate streaming operations
 */
export interface IAdaptiveStreamingService {
  // Adaptive Stream Generation
  generateAdaptiveStream(
    inputVideoS3Key: string,
    outputPrefix: string,
    options?: {
      qualities?: Array<{
        resolution: string;
        bitrate: string;
        name: string;
      }>;
      segmentDuration?: number;
      enableEncryption?: boolean;
    }
  ): Promise<{
    success: boolean;
    masterPlaylistKey?: string;
    variantPlaylists?: Array<{
      quality: string;
      playlistKey: string;
      segmentKeys: string[];
    }>;
    processingTime?: number;
    error?: string;
  }>;

  // Quality Detection
  detectOptimalQualities(
    videoS3Key: string
  ): Promise<{
    recommendedQualities: Array<{
      resolution: string;
      bitrate: string;
      name: string;
      suitable: boolean;
    }>;
    originalResolution: string;
    originalBitrate: string;
    duration: number;
  }>;

  // Bandwidth Adaptation
  getBandwidthRecommendation(
    userBandwidth: number,
    deviceType?: 'mobile' | 'tablet' | 'desktop'
  ): {
    recommendedQuality: string;
    fallbackQualities: string[];
    bufferSettings: {
      initialBuffer: number;
      maxBuffer: number;
      rebufferThreshold: number;
    };
  };

  // Stream Validation
  validateAdaptiveStream(
    masterPlaylistKey: string
  ): Promise<{
    isValid: boolean;
    availableQualities: string[];
    totalSegments: number;
    estimatedDuration: number;
    errors?: string[];
  }>;

  // Performance Optimization
  optimizeStreamForDevice(
    deviceCapabilities: {
      maxResolution: string;
      supportedCodecs: string[];
      networkType: '2g' | '3g' | '4g' | '5g' | 'wifi';
    },
    availableQualities: Array<{
      resolution: string;
      bitrate: string;
      codec: string;
    }>
  ): Array<{
    resolution: string;
    bitrate: string;
    priority: number;
  }>;

  // Analytics
  trackQualitySwitches(
    sessionId: string,
    fromQuality: string,
    toQuality: string,
    reason: 'bandwidth' | 'buffer' | 'user_preference',
    timestamp: Date
  ): Promise<void>;

  getStreamingAnalytics(
    timeRange: {
      startDate: Date;
      endDate: Date;
    }
  ): Promise<{
    qualityDistribution: Record<string, number>;
    averageStartupTime: number;
    bufferRatio: number;
    qualitySwitchFrequency: number;
  }>;
}