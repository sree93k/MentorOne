import { s3 } from "../../config/awsS3";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import path from "path";

interface VideoMetadata {
  originalName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: Date;
  checksum: string;
  duration?: number;
  resolution?: string;
  bitrate?: number;
}

interface VideoUploadConfig {
  userId: string;
  serviceId: string;
  contentType: 'video-tutorials' | 'course-content' | 'live-recordings';
  environment: 'development' | 'staging' | 'production';
  securityLevel: 'public' | 'private' | 'restricted';
}

interface VideoUploadResult {
  success: boolean;
  videoS3Key?: string;
  videoSecureId?: string;
  metadata?: VideoMetadata;
  accessToken?: string;
  error?: string;
}

interface ContentProtectionOptions {
  enableWatermark: boolean;
  watermarkText?: string;
  enableDRM: boolean;
  allowDownload: boolean;
  maxViewsPerUser?: number;
  expiryDate?: Date;
}

class IndustryStandardVideoService {
  private readonly BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
  private readonly ENCRYPTION_KEY = process.env.VIDEO_ENCRYPTION_KEY || 'default-key-change-in-production';

  /**
   * 🏗️ INDUSTRY-STANDARD FILE NAMING CONVENTION
   * Format: {environment}/{content_type}/{user_id}/{service_id}/{uuid}_{sanitized_name}.{ext}
   * Example: production/video-tutorials/user123/service456/550e8400-e29b-41d4-a716-446655440000_react_fundamentals.mp4
   */
  private generateSecureFileName(
    file: Express.Multer.File,
    config: VideoUploadConfig
  ): { s3Key: string; secureId: string } {
    // Generate unique identifier
    const uuid = uuidv4();
    const timestamp = Date.now();
    
    // Sanitize original filename
    const originalName = path.parse(file.originalname).name;
    const extension = path.parse(file.originalname).ext;
    const sanitizedName = originalName
      .toLowerCase()
      .replace(/[^a-z0-9\-_]/g, '_')
      .replace(/_{2,}/g, '_')
      .replace(/^_|_$/g, '');

    // Create secure filename
    const secureId = `${uuid}_${timestamp}`;
    const fileName = `${secureId}_${sanitizedName}${extension}`;

    // Build hierarchical path
    const s3Key = [
      config.environment,
      config.contentType,
      config.userId,
      config.serviceId,
      fileName
    ].join('/');

    return { s3Key, secureId };
  }

  /**
   * 🔐 GENERATE FILE CHECKSUM
   * Create SHA-256 hash for file integrity verification
   */
  private generateChecksum(buffer: Buffer): string {
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  /**
   * 🛡️ ENCRYPT SENSITIVE DATA
   * Encrypt video metadata for secure storage
   */
  private encryptMetadata(data: string): string {
    const cipher = crypto.createCipher('aes-256-cbc', this.ENCRYPTION_KEY);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  /**
   * 🔓 DECRYPT SENSITIVE DATA
   * Decrypt video metadata for access
   */
  private decryptMetadata(encryptedData: string): string {
    const decipher = crypto.createDecipher('aes-256-cbc', this.ENCRYPTION_KEY);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  /**
   * 📊 EXTRACT VIDEO METADATA
   * Get comprehensive file information
   */
  private extractVideoMetadata(file: Express.Multer.File): VideoMetadata {
    return {
      originalName: file.originalname,
      fileSize: file.size,
      mimeType: file.mimetype,
      uploadedAt: new Date(),
      checksum: this.generateChecksum(file.buffer),
      // TODO: Add video analysis for duration, resolution, bitrate
      duration: undefined,
      resolution: undefined,
      bitrate: undefined
    };
  }

  /**
   * 🎬 UPLOAD VIDEO WITH INDUSTRY STANDARDS
   * Complete video upload with security, metadata, and organization
   */
  public async uploadVideoFile(
    file: Express.Multer.File,
    config: VideoUploadConfig,
    protectionOptions: ContentProtectionOptions = {
      enableWatermark: true,
      enableDRM: false,
      allowDownload: false
    }
  ): Promise<VideoUploadResult> {
    try {
      console.log("🎬 IndustryStandardVideoService: Starting upload", {
        fileName: file.originalname,
        fileSize: file.size,
        contentType: config.contentType,
        userId: config.userId.substring(0, 8) + "...",
        serviceId: config.serviceId.substring(0, 8) + "..."
      });

      // 1. Generate secure file naming
      const { s3Key, secureId } = this.generateSecureFileName(file, config);
      
      // 2. Extract metadata
      const metadata = this.extractVideoMetadata(file);
      
      // 3. Create upload parameters with security headers
      const uploadParams = {
        Bucket: this.BUCKET_NAME!,
        Key: s3Key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ServerSideEncryption: 'AES256',
        Metadata: {
          'original-name': file.originalname,
          'uploaded-by': config.userId,
          'service-id': config.serviceId,
          'content-type': config.contentType,
          'secure-id': secureId,
          'checksum': metadata.checksum,
          'upload-timestamp': metadata.uploadedAt.toISOString(),
          'protection-level': config.securityLevel,
          'allow-download': protectionOptions.allowDownload.toString(),
          'enable-watermark': protectionOptions.enableWatermark.toString()
        },
        CacheControl: 'private, max-age=31536000', // 1 year cache for authenticated users
        ContentDisposition: protectionOptions.allowDownload ? 'inline' : 'inline; filename="protected-content"'
      };

      // 4. Set ACL based on security level
      if (config.securityLevel === 'private') {
        (uploadParams as any).ACL = 'private';
      } else if (config.securityLevel === 'restricted') {
        (uploadParams as any).ACL = 'private';
        // Add additional encryption
        (uploadParams as any).ServerSideEncryption = 'aws:kms';
      }

      console.log("🎬 IndustryStandardVideoService: Uploading to S3", {
        s3Key,
        securityLevel: config.securityLevel,
        bucket: this.BUCKET_NAME
      });

      // 5. Upload to S3
      const uploadResult = await s3.upload(uploadParams).promise();

      // 6. Generate access token for secure access
      const accessToken = this.generateAccessToken(secureId, config.userId, protectionOptions);

      const result: VideoUploadResult = {
        success: true,
        videoS3Key: s3Key,
        videoSecureId: secureId,
        metadata,
        accessToken
      };

      console.log("✅ IndustryStandardVideoService: Upload successful", {
        s3Key,
        secureId,
        location: uploadResult.Location
      });

      return result;

    } catch (error: any) {
      console.error("🚫 IndustryStandardVideoService: Upload failed", error);
      return {
        success: false,
        error: error.message || "Failed to upload video"
      };
    }
  }

  /**
   * 🎟️ GENERATE ACCESS TOKEN
   * Create secure token for video access
   */
  private generateAccessToken(
    secureId: string, 
    userId: string, 
    protection: ContentProtectionOptions
  ): string {
    const tokenData = {
      secureId,
      userId,
      issuedAt: Date.now(),
      expiresAt: protection.expiryDate?.getTime() || (Date.now() + 24 * 60 * 60 * 1000), // 24 hours default
      maxViews: protection.maxViewsPerUser || 100,
      allowDownload: protection.allowDownload,
      watermark: protection.enableWatermark
    };

    return this.encryptMetadata(JSON.stringify(tokenData));
  }

  /**
   * 🔍 VALIDATE ACCESS TOKEN
   * Verify token and extract permissions
   */
  public validateAccessToken(token: string): any {
    try {
      const decryptedData = this.decryptMetadata(token);
      const tokenData = JSON.parse(decryptedData);
      
      // Check expiry
      if (Date.now() > tokenData.expiresAt) {
        throw new Error('Token expired');
      }

      return tokenData;
    } catch (error) {
      console.error("🚫 Invalid access token:", error);
      return null;
    }
  }

  /**
   * 🔗 GENERATE SECURE SIGNED URL
   * Create time-limited, secure access URL
   */
  public async generateSecureSignedUrl(
    s3Key: string,
    userId: string,
    accessToken?: string,
    options: {
      expiresIn?: number;
      responseHeaders?: Record<string, string>;
      userAgent?: string;
      ipAddress?: string;
    } = {}
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      // Validate access token if provided
      if (accessToken) {
        const tokenData = this.validateAccessToken(accessToken);
        if (!tokenData || tokenData.userId !== userId) {
          return { success: false, error: 'Invalid or expired access token' };
        }
      }

      // Generate signed URL with security headers
      const params = {
        Bucket: this.BUCKET_NAME!,
        Key: s3Key,
        Expires: options.expiresIn || 3600, // 1 hour default
        ResponseCacheControl: 'private, no-cache, no-store, must-revalidate',
        ResponseContentDisposition: 'inline',
        ...options.responseHeaders
      };

      const signedUrl = await s3.getSignedUrlPromise('getObject', params);

      console.log("🔗 Generated secure signed URL", {
        s3Key,
        userId: userId.substring(0, 8) + "...",
        expiresIn: options.expiresIn || 3600
      });

      return { success: true, url: signedUrl };

    } catch (error: any) {
      console.error("🚫 Failed to generate secure signed URL:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * 📈 LOG VIDEO ACCESS
   * Track video access for analytics
   */
  public async logVideoAccess(
    s3Key: string,
    userId: string,
    metadata: {
      userAgent?: string;
      ipAddress?: string;
      duration?: number;
      quality?: string;
    }
  ): Promise<void> {
    try {
      console.log("📈 Logging video access", {
        s3Key,
        userId: userId.substring(0, 8) + "...",
        timestamp: new Date().toISOString(),
        metadata
      });

      // TODO: Store in analytics database
      // await AnalyticsService.logVideoAccess({
      //   s3Key,
      //   userId,
      //   timestamp: new Date(),
      //   ...metadata
      // });

    } catch (error) {
      console.error("🚫 Failed to log video access:", error);
    }
  }

  /**
   * 🗑️ DELETE VIDEO SECURELY
   * Remove video and associated metadata
   */
  public async deleteVideoSecurely(s3Key: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log("🗑️ IndustryStandardVideoService: Deleting video", { s3Key });

      const deleteParams = {
        Bucket: this.BUCKET_NAME!,
        Key: s3Key
      };

      await s3.deleteObject(deleteParams).promise();

      console.log("✅ IndustryStandardVideoService: Video deleted successfully", { s3Key });
      return { success: true };

    } catch (error: any) {
      console.error("🚫 IndustryStandardVideoService: Delete failed", error);
      return {
        success: false,
        error: error.message || "Failed to delete video"
      };
    }
  }

  /**
   * 🔍 GET VIDEO METADATA
   * Retrieve comprehensive video information
   */
  public async getVideoMetadata(s3Key: string): Promise<{
    success: boolean;
    metadata?: any;
    error?: string;
  }> {
    try {
      const params = {
        Bucket: this.BUCKET_NAME!,
        Key: s3Key
      };

      const result = await s3.headObject(params).promise();
      
      return {
        success: true,
        metadata: {
          size: result.ContentLength,
          contentType: result.ContentType,
          lastModified: result.LastModified,
          serverSideEncryption: result.ServerSideEncryption,
          customMetadata: result.Metadata
        }
      };

    } catch (error: any) {
      console.error("🚫 Failed to get video metadata:", error);
      return { success: false, error: error.message };
    }
  }
}

export default new IndustryStandardVideoService();