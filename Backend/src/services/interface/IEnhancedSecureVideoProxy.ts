import { Request, Response } from "express";

/**
 * 🔹 DIP COMPLIANCE: Enhanced Secure Video Proxy Interface
 * Defines secure video streaming and proxy operations
 */
export interface IEnhancedSecureVideoProxy {
  // Video Streaming
  streamVideoSecurely(
    videoRequest: {
      s3Key: string;
      videoSecureId: string;
      userId: string;
      userAgent?: string;
      ipAddress: string;
      accessToken: string;
    },
    streamingOptions: {
      quality: string;
      startTime?: number;
      endTime?: number;
    },
    req: Request,
    res: Response
  ): Promise<void>;

  // URL Generation
  generateSecureStreamingUrl(
    videoRequest: {
      s3Key: string;
      videoSecureId: string;
      userId: string;
      userAgent?: string;
      ipAddress: string;
      accessToken: string;
    },
    urlOptions: {
      quality: string;
      expiryMinutes?: number;
    }
  ): Promise<{
    success: boolean;
    streamingUrl?: string;
    expiresAt?: Date;
    error?: string;
  }>;

  // HLS Streaming
  generateHLSManifest(
    videoId: string,
    userId: string,
    options?: any
  ): Promise<string>;

  generateHLSSegment(
    videoId: string,
    segmentIndex: number,
    userId: string,
    options?: any
  ): Promise<Buffer>;
}