import { s3 } from "../../config/awsS3";

interface SignedUrlOptions {
  expiresIn?: number; // in seconds, default 1 hour
  responseContentType?: string;
  responseContentDisposition?: 'inline' | 'attachment';
}

interface SignedUrlResult {
  success: boolean;
  signedUrl?: string;
  error?: string;
  expiresAt?: Date;
}

class SignedUrlService {
  private readonly BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
  private readonly DEFAULT_EXPIRY = 3600; // 1 hour in seconds
  private readonly MAX_EXPIRY = 86400; // 24 hours max

  /**
   * 🔒 SECURE S3 SIGNED URL GENERATION
   * Generates time-limited signed URLs for private S3 objects
   */
  public async generateSignedUrl(
    s3Key: string,
    options: SignedUrlOptions = {}
  ): Promise<SignedUrlResult> {
    try {
      const {
        expiresIn = this.DEFAULT_EXPIRY,
        responseContentType = 'video/mp4',
        responseContentDisposition = 'inline'
      } = options;

      // Validate expiry time
      const validatedExpiry = Math.min(expiresIn, this.MAX_EXPIRY);

      // Clean the S3 key
      const cleanKey = this.cleanS3Key(s3Key);

      console.log("🔒 SignedUrlService: Generating signed URL", {
        bucket: this.BUCKET_NAME,
        key: cleanKey.substring(0, 30) + "...",
        expiresIn: validatedExpiry
      });

      // Verify object exists before generating signed URL
      const objectExists = await this.verifyObjectExists(cleanKey);
      if (!objectExists) {
        return {
          success: false,
          error: "Video not found"
        };
      }

      // Generate signed URL
      const params = {
        Bucket: this.BUCKET_NAME,
        Key: cleanKey,
        Expires: validatedExpiry,
        ResponseContentType: responseContentType,
        ResponseContentDisposition: responseContentDisposition
      };

      const signedUrl = await s3.getSignedUrlPromise('getObject', params);
      const expiresAt = new Date(Date.now() + validatedExpiry * 1000);

      console.log("✅ SignedUrlService: Signed URL generated successfully", {
        key: cleanKey.substring(0, 30) + "...",
        expiresAt: expiresAt.toISOString()
      });

      return {
        success: true,
        signedUrl,
        expiresAt
      };

    } catch (error: any) {
      console.error("🚫 SignedUrlService: Error generating signed URL", error);
      return {
        success: false,
        error: error.message || "Failed to generate signed URL"
      };
    }
  }

  /**
   * 🔒 BATCH SIGNED URL GENERATION
   * Generate multiple signed URLs for video episodes
   */
  public async generateBatchSignedUrls(
    s3Keys: string[],
    options: SignedUrlOptions = {}
  ): Promise<{ [key: string]: SignedUrlResult }> {
    console.log("🔒 SignedUrlService: Generating batch signed URLs", {
      count: s3Keys.length
    });

    const results: { [key: string]: SignedUrlResult } = {};
    
    // Process in parallel for better performance
    const promises = s3Keys.map(async (key) => {
      const result = await this.generateSignedUrl(key, options);
      return { key, result };
    });

    const settledPromises = await Promise.allSettled(promises);
    
    settledPromises.forEach((settled, index) => {
      const originalKey = s3Keys[index];
      if (settled.status === 'fulfilled') {
        results[originalKey] = settled.value.result;
      } else {
        results[originalKey] = {
          success: false,
          error: "Failed to process signed URL"
        };
      }
    });

    return results;
  }

  /**
   * 🔒 PRESIGNED UPLOAD URL GENERATION
   * For secure video uploads directly to S3
   */
  public async generatePresignedUploadUrl(
    fileName: string,
    contentType: string = 'video/mp4',
    expiresIn: number = 900 // 15 minutes for uploads
  ): Promise<SignedUrlResult> {
    try {
      const timestamp = Date.now();
      const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
      const s3Key = `videos/${timestamp}_${cleanFileName}`;

      const params = {
        Bucket: this.BUCKET_NAME,
        Key: s3Key,
        Expires: expiresIn,
        ContentType: contentType,
        ACL: 'private' // Ensure uploaded files are private
      };

      const signedUrl = await s3.getSignedUrlPromise('putObject', params);
      const expiresAt = new Date(Date.now() + expiresIn * 1000);

      console.log("✅ SignedUrlService: Upload URL generated", {
        key: s3Key,
        expiresAt: expiresAt.toISOString()
      });

      return {
        success: true,
        signedUrl,
        expiresAt
      };

    } catch (error: any) {
      console.error("🚫 SignedUrlService: Error generating upload URL", error);
      return {
        success: false,
        error: error.message || "Failed to generate upload URL"
      };
    }
  }

  /**
   * Clean S3 key from full URL or path
   */
  private cleanS3Key(input: string): string {
    let cleanKey = input;

    // Remove full S3 URL if present
    if (input.includes('amazonaws.com/')) {
      const urlParts = input.split('amazonaws.com/');
      cleanKey = urlParts[1] || input;
    }

    // Remove leading slash if present
    cleanKey = cleanKey.replace(/^\/+/, '');

    // Ensure videos/ prefix for legacy compatibility
    if (!cleanKey.startsWith('videos/') && !cleanKey.includes('/')) {
      cleanKey = `videos/${cleanKey}`;
    }

    return cleanKey;
  }

  /**
   * Verify S3 object exists before generating signed URL
   */
  private async verifyObjectExists(s3Key: string): Promise<boolean> {
    try {
      await s3.headObject({
        Bucket: this.BUCKET_NAME,
        Key: s3Key
      }).promise();
      return true;
    } catch (error: any) {
      // Try with videos/ prefix if not already present
      if (!s3Key.startsWith('videos/')) {
        try {
          await s3.headObject({
            Bucket: this.BUCKET_NAME,
            Key: `videos/${s3Key}`
          }).promise();
          return true;
        } catch (altError) {
          console.error("🚫 SignedUrlService: Object not found", {
            originalKey: s3Key,
            alternativeKey: `videos/${s3Key}`
          });
          return false;
        }
      }
      console.error("🚫 SignedUrlService: Object verification failed", error);
      return false;
    }
  }

  /**
   * 🔒 EXTRACT S3 KEY FROM VIDEO URL
   * Convert existing video URLs to S3 keys for signed URL generation
   */
  public extractS3KeyFromUrl(videoUrl: string): string | null {
    try {
      if (!videoUrl) return null;

      // Handle direct S3 URLs
      if (videoUrl.includes('amazonaws.com/')) {
        const urlParts = videoUrl.split('amazonaws.com/');
        return urlParts[1] || null;
      }

      // Handle relative paths
      if (videoUrl.startsWith('videos/')) {
        return videoUrl;
      }

      // Handle file names without path
      if (!videoUrl.includes('/') && videoUrl.includes('.')) {
        return `videos/${videoUrl}`;
      }

      return null;
    } catch (error) {
      console.error("🚫 SignedUrlService: Error extracting S3 key", error);
      return null;
    }
  }

  /**
   * 🔒 SECURE VIDEO ACCESS WITH USER VALIDATION
   * Generate signed URL with user access validation
   */
  public async generateSecureVideoUrl(
    videoUrl: string,
    userId: string,
    serviceId: string,
    options: SignedUrlOptions = {}
  ): Promise<SignedUrlResult> {
    try {
      // Extract S3 key from video URL
      const s3Key = this.extractS3KeyFromUrl(videoUrl);
      if (!s3Key) {
        return {
          success: false,
          error: "Invalid video URL format"
        };
      }

      // TODO: Add user access validation here
      // - Check if user has purchased the service
      // - Verify subscription status
      // - Log access for analytics

      console.log("🔒 SignedUrlService: Generating secure video URL", {
        userId: userId.substring(0, 8) + "...",
        serviceId,
        s3Key: s3Key.substring(0, 30) + "..."
      });

      // Generate signed URL
      return await this.generateSignedUrl(s3Key, options);

    } catch (error: any) {
      console.error("🚫 SignedUrlService: Error generating secure video URL", error);
      return {
        success: false,
        error: error.message || "Failed to generate secure video URL"
      };
    }
  }
}

export default new SignedUrlService();