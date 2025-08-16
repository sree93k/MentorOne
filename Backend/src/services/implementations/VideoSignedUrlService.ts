// 🔒 VIDEO SIGNED URL SERVICE - Generate secure, short-lived video URLs
import { s3 } from "../../config/awsS3";
import EnhancedVideoSessionService from "./VideoSessionService";

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

interface SignedUrlOptions {
  sessionToken?: string;
  userId?: string;
  serviceId?: string;
  expirationMinutes?: number;
}

class VideoSignedUrlService {
  
  /**
   * 🔒 Generate signed URL for video playback with session validation
   */
  public async generateSecureVideoSignedUrl(
    videoKey: string,
    options: SignedUrlOptions = {}
  ): Promise<{ signedUrl: string; expiresAt: string; sessionValid?: boolean }> {
    try {
      const {
        sessionToken,
        userId,
        serviceId,
        expirationMinutes = 5 // Default 5 minutes
      } = options;

      console.log("🔒 VideoSignedUrl: Generating signed URL", {
        videoKey: videoKey.substring(0, 30) + "...",
        userId: userId?.substring(0, 8) + "...",
        serviceId,
        expirationMinutes
      });

      // 🛡️ Validate session if provided
      let sessionValid = true;
      if (sessionToken && userId && serviceId) {
        sessionValid = await EnhancedVideoSessionService.validateSession(
          sessionToken,
          userId,
          serviceId
        );
        
        if (!sessionValid) {
          console.log("🚫 VideoSignedUrl: Invalid session");
          throw new Error("Invalid or expired session");
        }
      }

      // Clean video key (remove URL if provided)
      let cleanKey = videoKey;
      if (videoKey.includes("amazonaws.com/")) {
        const urlParts = videoKey.split("amazonaws.com/");
        cleanKey = urlParts[1];
      }

      // Calculate expiration
      const expiresInSeconds = expirationMinutes * 60;
      const expiresAt = new Date(Date.now() + (expiresInSeconds * 1000)).toISOString();

      // Generate signed URL parameters
      const params = {
        Bucket: BUCKET_NAME!,
        Key: cleanKey,
        Expires: expiresInSeconds,
        ResponseContentDisposition: 'inline', // Prevent downloads
        ResponseContentType: 'video/mp4'
      };

      // Generate signed URL
      const signedUrl = await s3.getSignedUrlPromise("getObject", params);

      console.log("🔒 VideoSignedUrl: Generated successfully", {
        keyLength: cleanKey.length,
        expiresAt,
        urlLength: signedUrl.length
      });

      return {
        signedUrl,
        expiresAt,
        sessionValid
      };

    } catch (error: any) {
      console.error("🔒 VideoSignedUrl: Error generating signed URL:", error);
      throw new Error(`Failed to generate signed video URL: ${error.message}`);
    }
  }

  /**
   * 🔒 Generate signed URL with rate limiting
   */
  public async generateRateLimitedSignedUrl(
    videoKey: string,
    userId: string,
    serviceId: string,
    sessionToken: string
  ): Promise<{ signedUrl: string; expiresAt: string; requestsRemaining: number }> {
    try {
      // Check rate limit (max 10 requests per hour per user)
      const rateLimitKey = `video_requests:${userId}:${serviceId}`;
      const requestCount = await this.getRequestCount(rateLimitKey);
      
      if (requestCount >= 10) {
        throw new Error("Rate limit exceeded. Maximum 10 video requests per hour.");
      }

      // Generate signed URL
      const result = await this.generateSecureVideoSignedUrl(videoKey, {
        sessionToken,
        userId,
        serviceId,
        expirationMinutes: 10 // Longer expiration for rate-limited requests
      });

      // Increment request count
      await this.incrementRequestCount(rateLimitKey);

      return {
        ...result,
        requestsRemaining: 10 - (requestCount + 1)
      };

    } catch (error: any) {
      console.error("🔒 VideoSignedUrl: Rate limited request failed:", error);
      throw error;
    }
  }

  /**
   * 🔒 Bulk generate signed URLs for episode list
   */
  public async generateBulkSignedUrls(
    episodes: Array<{ videoKey?: string; videoUrl?: string; _id: string }>,
    userId: string,
    serviceId: string,
    sessionToken: string
  ): Promise<Array<{ episodeId: string; signedUrl: string; expiresAt: string }>> {
    try {
      console.log("🔒 VideoSignedUrl: Generating bulk signed URLs", {
        episodeCount: episodes.length,
        userId: userId.substring(0, 8) + "...",
        serviceId
      });

      const results = [];

      for (const episode of episodes) {
        try {
          // Use videoKey if available, otherwise extract from videoUrl
          const videoKey = episode.videoKey || this.extractKeyFromUrl(episode.videoUrl || '');
          
          if (!videoKey) {
            console.warn(`🔒 VideoSignedUrl: No valid key found for episode ${episode._id}`);
            continue;
          }

          const result = await this.generateSecureVideoSignedUrl(videoKey, {
            sessionToken,
            userId,
            serviceId,
            expirationMinutes: 15 // Longer for bulk requests
          });

          results.push({
            episodeId: episode._id,
            signedUrl: result.signedUrl,
            expiresAt: result.expiresAt
          });

        } catch (episodeError) {
          console.error(`🔒 VideoSignedUrl: Failed to generate URL for episode ${episode._id}:`, episodeError);
          // Continue with other episodes
        }
      }

      console.log("🔒 VideoSignedUrl: Bulk generation completed", {
        requested: episodes.length,
        generated: results.length
      });

      return results;

    } catch (error: any) {
      console.error("🔒 VideoSignedUrl: Bulk generation failed:", error);
      throw new Error(`Failed to generate bulk signed URLs: ${error.message}`);
    }
  }

  /**
   * Extract S3 key from full URL
   */
  private extractKeyFromUrl(url: string): string | null {
    if (!url) return null;
    
    if (url.includes("amazonaws.com/")) {
      const urlParts = url.split("amazonaws.com/");
      return urlParts[1];
    }
    
    // If it's already a key (no URL prefix)
    if (url.includes("/") && !url.includes("http")) {
      return url;
    }
    
    return null;
  }

  /**
   * Get request count for rate limiting (using in-memory cache for simplicity)
   */
  private requestCounts = new Map<string, { count: number; resetTime: number }>();
  
  private async getRequestCount(key: string): Promise<number> {
    const now = Date.now();
    const hourInMs = 60 * 60 * 1000;
    
    const entry = this.requestCounts.get(key);
    if (!entry || now > entry.resetTime) {
      return 0;
    }
    
    return entry.count;
  }

  private async incrementRequestCount(key: string): Promise<void> {
    const now = Date.now();
    const hourInMs = 60 * 60 * 1000;
    const resetTime = now + hourInMs;
    
    const entry = this.requestCounts.get(key);
    if (!entry || now > entry.resetTime) {
      this.requestCounts.set(key, { count: 1, resetTime });
    } else {
      this.requestCounts.set(key, { count: entry.count + 1, resetTime: entry.resetTime });
    }
  }

  /**
   * 🔒 Validate if signed URL is still valid
   */
  public isSignedUrlValid(expiresAt: string): boolean {
    const expirationTime = new Date(expiresAt).getTime();
    const currentTime = Date.now();
    const bufferTime = 30 * 1000; // 30 second buffer
    
    return currentTime < (expirationTime - bufferTime);
  }

  /**
   * 🔒 Generate fresh signed URL if current one is expiring soon
   */
  public async refreshSignedUrlIfNeeded(
    currentSignedUrl: string,
    expiresAt: string,
    videoKey: string,
    options: SignedUrlOptions
  ): Promise<{ signedUrl: string; expiresAt: string; refreshed: boolean }> {
    
    if (this.isSignedUrlValid(expiresAt)) {
      return {
        signedUrl: currentSignedUrl,
        expiresAt,
        refreshed: false
      };
    }

    console.log("🔒 VideoSignedUrl: Refreshing expired URL");
    const result = await this.generateSecureVideoSignedUrl(videoKey, options);
    
    return {
      signedUrl: result.signedUrl,
      expiresAt: result.expiresAt,
      refreshed: true
    };
  }
}

export default new VideoSignedUrlService();