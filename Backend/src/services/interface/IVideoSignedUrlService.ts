/**
 * 🔹 DIP COMPLIANCE: Video Signed URL Service Interface
 * Defines video-specific signed URL operations with enhanced security
 */
export interface IVideoSignedUrlService {
  // Video URL Generation
  generateVideoStreamingUrl(
    videoS3Key: string,
    userId: string,
    options?: {
      expiresIn?: number;
      quality?: string;
      sessionToken?: string;
      allowDownload?: boolean;
    }
  ): Promise<{
    success: boolean;
    streamingUrl?: string;
    error?: string;
    expiresAt?: Date;
    sessionId?: string;
  }>;

  generateVideoThumbnailUrl(
    thumbnailS3Key: string,
    options?: {
      expiresIn?: number;
      size?: 'small' | 'medium' | 'large';
    }
  ): Promise<{
    success: boolean;
    thumbnailUrl?: string;
    error?: string;
    expiresAt?: Date;
  }>;

  // HLS Streaming URLs
  generateHLSPlaylistUrl(
    playlistS3Key: string,
    userId: string,
    sessionToken: string,
    options?: {
      expiresIn?: number;
    }
  ): Promise<{
    success: boolean;
    playlistUrl?: string;
    error?: string;
    expiresAt?: Date;
  }>;

  generateHLSSegmentUrls(
    segmentKeys: string[],
    userId: string,
    sessionToken: string,
    options?: {
      expiresIn?: number;
      batchSize?: number;
    }
  ): Promise<{
    success: boolean;
    segmentUrls?: Array<{
      segmentKey: string;
      signedUrl: string;
      sequenceNumber: number;
    }>;
    error?: string;
  }>;

  // Secure Video Access
  validateVideoAccess(
    userId: string,
    videoId: string,
    serviceId?: string
  ): Promise<{
    hasAccess: boolean;
    accessType?: 'owner' | 'purchased' | 'subscription' | 'free';
    expiresAt?: Date;
    restrictions?: string[];
  }>;

  generateSecureVideoToken(
    userId: string,
    videoId: string,
    options?: {
      expiresIn?: number;
      allowDownload?: boolean;
      qualityLimit?: string;
      ipRestriction?: string;
    }
  ): Promise<{
    success: boolean;
    videoToken?: string;
    error?: string;
    expiresAt?: Date;
  }>;

  // Analytics Integration
  trackVideoUrlGeneration(
    userId: string,
    videoId: string,
    urlType: 'streaming' | 'download' | 'thumbnail' | 'hls',
    metadata?: {
      quality?: string;
      userAgent?: string;
      ipAddress?: string;
    }
  ): Promise<void>;

  // URL Revocation
  revokeVideoUrls(
    userId: string,
    videoId?: string
  ): Promise<{
    success: boolean;
    revokedUrls: number;
    error?: string;
  }>;
}