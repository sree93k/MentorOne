/**
 * 🔹 DIP COMPLIANCE: HLS Video Processing Service Interface
 * Defines HTTP Live Streaming video processing operations
 */
export interface IHLSVideoProcessingService {
  // Video Processing
  processVideoToHLS(
    inputS3Key: string,
    outputPrefix: string,
    options?: {
      qualities?: Array<{
        name: string;
        resolution: string;
        bitrate: string;
      }>;
      segmentDuration?: number;
      enableEncryption?: boolean;
    }
  ): Promise<{
    hlsPlaylistKey: string;
    segmentKeys: string[];
    processingTime: number;
    originalSize: number;
    hlsSize: number;
    segmentCount: number;
  }>;

  // Segment Management
  generateHLSSegments(
    inputFile: string,
    outputDir: string,
    options?: {
      segmentDuration?: number;
      quality?: string;
    }
  ): Promise<{
    segmentKeys: string[];
    playlistContent: string;
    totalDuration: number;
  }>;

  uploadSegmentsToS3(
    segments: Array<{
      localPath: string;
      s3Key: string;
    }>,
    playlistContent: string,
    playlistKey: string
  ): Promise<{
    uploadedSegments: number;
    playlistUploaded: boolean;
    errors: string[];
  }>;

  // Playlist Operations
  generateMasterPlaylist(
    variants: Array<{
      quality: string;
      resolution: string;
      bitrate: string;
      playlistUrl: string;
    }>
  ): string;

  generateVariantPlaylist(
    segments: Array<{
      segmentKey: string;
      duration: number;
      sequenceNumber: number;
    }>
  ): string;

  // Quality Management
  getAvailableQualities(): Array<{
    name: string;
    resolution: string;
    bitrate: string;
  }>;

  validateVideoForHLS(s3Key: string): Promise<{
    isValid: boolean;
    duration?: number;
    resolution?: string;
    bitrate?: string;
    codec?: string;
    errors?: string[];
  }>;

  // Cleanup
  cleanupTempFiles(sessionId: string): Promise<void>;

  // Progress Tracking
  getProcessingProgress(sessionId: string): {
    status: 'queued' | 'processing' | 'completed' | 'error';
    progress: number;
    currentStep: string;
    estimatedTimeRemaining?: number;
  };
}