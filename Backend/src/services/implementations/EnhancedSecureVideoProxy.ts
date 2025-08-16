import { s3 } from "../../config/awsS3";
import IndustryStandardVideoService from "./IndustryStandardVideoService";
import { Response } from "express";

interface VideoAccessRequest {
  s3Key?: string;
  videoSecureId?: string;
  userId: string;
  userAgent?: string;
  ipAddress?: string;
  accessToken?: string;
}

interface StreamingOptions {
  quality?: 'auto' | '240p' | '360p' | '480p' | '720p' | '1080p';
  startTime?: number; // in seconds
  endTime?: number; // in seconds
  enableAnalytics?: boolean;
}

interface SecurityValidation {
  isValid: boolean;
  reason?: string;
  allowedOperations?: string[];
  restrictions?: {
    maxViews?: number;
    expiryDate?: Date;
    allowDownload?: boolean;
    restrictedDomains?: string[];
  };
}

class EnhancedSecureVideoProxy {
  private readonly BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
  private readonly MAX_STREAM_SIZE = 1024 * 1024 * 100; // 100MB chunks
  private readonly RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
  private readonly RATE_LIMIT_MAX_REQUESTS = 30; // 30 requests per minute

  // Rate limiting storage (in production, use Redis)
  private rateLimitStore = new Map<string, { count: number; resetTime: number }>();

  /**
   * 🔍 ENHANCED S3 KEY RESOLUTION
   * Intelligently resolve video location with multiple fallback strategies
   */
  private async resolveVideoLocation(request: VideoAccessRequest): Promise<{
    success: boolean;
    s3Key?: string;
    metadata?: any;
    error?: string;
  }> {
    try {
      console.log("🔍 Enhanced key resolution starting", {
        hasS3Key: !!request.s3Key,
        hasSecureId: !!request.videoSecureId,
        userId: request.userId.substring(0, 8) + "..."
      });

      let candidateKeys: string[] = [];

      // Strategy 1: Direct S3 key provided
      if (request.s3Key) {
        candidateKeys.push(request.s3Key);
        
        // Extract key from full URL if needed
        if (request.s3Key.includes('amazonaws.com')) {
          const extractedKey = this.extractS3KeyFromUrl(request.s3Key);
          if (extractedKey) candidateKeys.push(extractedKey);
        }
        
        // Add extension variants
        if (!request.s3Key.includes('.')) {
          candidateKeys.push(`${request.s3Key}.mp4`);
          candidateKeys.push(`${request.s3Key}.webm`);
          candidateKeys.push(`${request.s3Key}.mov`);
        }
      }

      // Strategy 2: Secure ID provided - search in organized structure
      if (request.videoSecureId) {
        const searchPaths = [
          `production/video-tutorials/${request.userId}/*/${request.videoSecureId}*`,
          `development/video-tutorials/${request.userId}/*/${request.videoSecureId}*`,
          `videos/${request.videoSecureId}*`, // Legacy path
        ];
        
        for (const searchPath of searchPaths) {
          try {
            const objects = await this.searchS3Objects(searchPath);
            candidateKeys.push(...objects);
          } catch (error) {
            console.warn("🔍 Search path failed:", searchPath, error);
          }
        }
      }

      // Strategy 3: Try each candidate key
      for (const key of candidateKeys) {
        try {
          console.log("🔍 Trying S3 key:", key);
          
          const metadata = await s3.headObject({
            Bucket: this.BUCKET_NAME!,
            Key: key
          }).promise();

          console.log("✅ Found video at:", key);
          return {
            success: true,
            s3Key: key,
            metadata: {
              size: metadata.ContentLength,
              contentType: metadata.ContentType,
              lastModified: metadata.LastModified,
              customMetadata: metadata.Metadata
            }
          };

        } catch (error: any) {
          console.log("❌ Key not found:", key, error.code);
          continue;
        }
      }

      return {
        success: false,
        error: `Video not found. Tried ${candidateKeys.length} locations.`
      };

    } catch (error: any) {
      console.error("🚫 Enhanced key resolution failed:", error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 🔍 EXTRACT S3 KEY FROM URL
   * Handle various URL formats
   */
  private extractS3KeyFromUrl(url: string): string | null {
    try {
      // Handle different S3 URL formats
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

      return null;
    } catch (error) {
      console.error("🚫 Failed to extract S3 key from URL:", error);
      return null;
    }
  }

  /**
   * 🔍 SEARCH S3 OBJECTS
   * Search for objects matching pattern
   */
  private async searchS3Objects(searchPattern: string): Promise<string[]> {
    try {
      // Simple implementation - in production, use more sophisticated search
      const prefix = searchPattern.split('*')[0];
      
      const objects = await s3.listObjectsV2({
        Bucket: this.BUCKET_NAME!,
        Prefix: prefix,
        MaxKeys: 10
      }).promise();

      return objects.Contents?.map(obj => obj.Key!) || [];
      
    } catch (error) {
      console.error("🚫 S3 search failed:", error);
      return [];
    }
  }

  /**
   * 🛡️ VALIDATE VIDEO ACCESS
   * Comprehensive security validation
   */
  private async validateVideoAccess(request: VideoAccessRequest): Promise<SecurityValidation> {
    try {
      // Rate limiting check
      const rateLimitKey = `${request.userId}:${request.ipAddress}`;
      if (!this.checkRateLimit(rateLimitKey)) {
        return {
          isValid: false,
          reason: 'Rate limit exceeded. Please try again later.'
        };
      }

      // Access token validation
      if (request.accessToken) {
        const tokenData = IndustryStandardVideoService.validateAccessToken(request.accessToken);
        if (!tokenData) {
          return {
            isValid: false,
            reason: 'Invalid or expired access token'
          };
        }

        // Check user permissions
        if (tokenData.userId !== request.userId) {
          return {
            isValid: false,
            reason: 'Access token does not match user'
          };
        }

        // Check view limits
        if (tokenData.maxViews <= 0) {
          return {
            isValid: false,
            reason: 'View limit exceeded'
          };
        }

        return {
          isValid: true,
          restrictions: {
            maxViews: tokenData.maxViews,
            expiryDate: new Date(tokenData.expiresAt),
            allowDownload: tokenData.allowDownload
          }
        };
      }

      // Default validation for legacy content
      return {
        isValid: true,
        allowedOperations: ['stream'],
        restrictions: {
          allowDownload: false
        }
      };

    } catch (error: any) {
      console.error("🚫 Video access validation failed:", error);
      return {
        isValid: false,
        reason: 'Security validation failed'
      };
    }
  }

  /**
   * ⏱️ CHECK RATE LIMIT
   * Prevent abuse with rate limiting
   */
  private checkRateLimit(key: string): boolean {
    const now = Date.now();
    const record = this.rateLimitStore.get(key);

    if (!record || now > record.resetTime) {
      // Reset window
      this.rateLimitStore.set(key, {
        count: 1,
        resetTime: now + this.RATE_LIMIT_WINDOW
      });
      return true;
    }

    if (record.count >= this.RATE_LIMIT_MAX_REQUESTS) {
      return false;
    }

    record.count++;
    return true;
  }

  /**
   * 🎬 STREAM VIDEO SECURELY
   * Enhanced streaming with range support and security
   */
  public async streamVideoSecurely(
    request: VideoAccessRequest,
    res: Response,
    options: StreamingOptions = {}
  ): Promise<void> {
    try {
      console.log("🎬 Enhanced secure video streaming request", {
        hasS3Key: !!request.s3Key,
        hasSecureId: !!request.videoSecureId,
        userId: request.userId.substring(0, 8) + "...",
        quality: options.quality || 'auto'
      });

      // 1. Validate access
      const validation = await this.validateVideoAccess(request);
      if (!validation.isValid) {
        res.status(403).json({
          success: false,
          error: validation.reason || 'Access denied'
        });
        return;
      }

      // 2. Resolve video location
      const resolution = await this.resolveVideoLocation(request);
      if (!resolution.success) {
        res.status(404).json({
          success: false,
          error: resolution.error || 'Video not found'
        });
        return;
      }

      // 3. Set security headers
      this.setSecurityHeaders(res, validation.restrictions);

      // 4. Handle range requests for streaming
      const range = res.req.headers.range;
      if (range) {
        await this.handleRangeRequest(resolution.s3Key!, range, res, resolution.metadata);
      } else {
        await this.handleFullRequest(resolution.s3Key!, res, resolution.metadata);
      }

      // 5. Log access for analytics
      if (options.enableAnalytics !== false) {
        await IndustryStandardVideoService.logVideoAccess(
          resolution.s3Key!,
          request.userId,
          {
            userAgent: request.userAgent,
            ipAddress: request.ipAddress,
            quality: options.quality
          }
        );
      }

    } catch (error: any) {
      console.error("🚫 Enhanced video streaming failed:", error);
      res.status(500).json({
        success: false,
        error: 'Streaming failed'
      });
    }
  }

  /**
   * 🛡️ SET SECURITY HEADERS
   * Apply content protection headers
   */
  private setSecurityHeaders(res: Response, restrictions?: any): void {
    // Prevent caching of sensitive content
    res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    // Content security
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    
    // Prevent download if restricted
    if (restrictions && !restrictions.allowDownload) {
      res.setHeader('Content-Disposition', 'inline');
    }
    
    // CORS headers for video streaming
    res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Headers', 'Range, Content-Type, Authorization');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Range, Accept-Ranges, Content-Length');
  }

  /**
   * 📹 HANDLE RANGE REQUEST
   * Support video seeking and progressive download
   */
  private async handleRangeRequest(
    s3Key: string,
    range: string,
    res: Response,
    metadata: any
  ): Promise<void> {
    try {
      const contentLength = metadata.size;
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : Math.min(start + this.MAX_STREAM_SIZE - 1, contentLength - 1);
      
      const chunkSize = (end - start) + 1;

      console.log("📹 Streaming range request", {
        s3Key,
        start,
        end,
        chunkSize,
        contentLength
      });

      const stream = s3.getObject({
        Bucket: this.BUCKET_NAME!,
        Key: s3Key,
        Range: `bytes=${start}-${end}`
      }).createReadStream();

      res.status(206);
      res.setHeader('Content-Range', `bytes ${start}-${end}/${contentLength}`);
      res.setHeader('Accept-Ranges', 'bytes');
      res.setHeader('Content-Length', chunkSize);
      res.setHeader('Content-Type', metadata.contentType || 'video/mp4');

      stream.pipe(res);

    } catch (error: any) {
      console.error("🚫 Range request failed:", error);
      res.status(500).json({ success: false, error: 'Range request failed' });
    }
  }

  /**
   * 📹 HANDLE FULL REQUEST
   * Stream complete video file
   */
  private async handleFullRequest(
    s3Key: string,
    res: Response,
    metadata: any
  ): Promise<void> {
    try {
      console.log("📹 Streaming full request", { s3Key });

      const stream = s3.getObject({
        Bucket: this.BUCKET_NAME!,
        Key: s3Key
      }).createReadStream();

      res.setHeader('Content-Length', metadata.size);
      res.setHeader('Content-Type', metadata.contentType || 'video/mp4');
      res.setHeader('Accept-Ranges', 'bytes');

      stream.pipe(res);

    } catch (error: any) {
      console.error("🚫 Full request failed:", error);
      res.status(500).json({ success: false, error: 'Streaming failed' });
    }
  }

  /**
   * 🔗 GENERATE SECURE STREAMING URL
   * Create time-limited streaming URLs
   */
  public async generateSecureStreamingUrl(
    request: VideoAccessRequest,
    options: {
      expiresIn?: number;
      quality?: string;
      analytics?: boolean;
    } = {}
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      // Validate access first
      const validation = await this.validateVideoAccess(request);
      if (!validation.isValid) {
        return { success: false, error: validation.reason };
      }

      // Resolve video location
      const resolution = await this.resolveVideoLocation(request);
      if (!resolution.success) {
        return { success: false, error: resolution.error };
      }

      // Generate secure signed URL
      const urlResult = await IndustryStandardVideoService.generateSecureSignedUrl(
        resolution.s3Key!,
        request.userId,
        request.accessToken,
        {
          expiresIn: options.expiresIn || 3600,
          userAgent: request.userAgent,
          ipAddress: request.ipAddress
        }
      );

      return urlResult;

    } catch (error: any) {
      console.error("🚫 Failed to generate secure streaming URL:", error);
      return { success: false, error: error.message };
    }
  }
}

export default new EnhancedSecureVideoProxy();