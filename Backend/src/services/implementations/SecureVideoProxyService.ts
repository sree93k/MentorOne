// services/implementations/SecureVideoProxyService.ts
import { s3 } from "../../config/awsS3";
import { Response } from "express";
import EnhancedVideoSessionService from "./VideoSessionService";

interface VideoProxyResult {
  success: boolean;
  error?: string;
  headers?: Record<string, string>;
}

class SecureVideoProxyService {
  private readonly BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
  private readonly CHUNK_SIZE = 1024 * 1024; // 1MB chunks

  /**
   * 🔒 SECURE VIDEO PROXY - Stream video through backend with session validation
   * This prevents direct S3 access and ensures session-based security
   */
  public async streamSecureVideo(
    videoKey: string,
    userId: string,
    serviceId: string,
    sessionToken: string,
    res: Response,
    range?: string
  ): Promise<VideoProxyResult> {
    try {
      console.log("🔒 SecureVideoProxy: Streaming video", {
        videoKey: videoKey.substring(0, 30) + "...",
        userId: userId.substring(0, 8) + "...",
        serviceId,
        hasRange: !!range
      });

      // 🛡️ CRITICAL: Validate session before streaming
      const isValidSession = await EnhancedVideoSessionService.validateSession(
        sessionToken,
        userId,
        serviceId
      );

      if (!isValidSession) {
        console.log("🚫 SecureVideoProxy: Invalid session");
        return { success: false, error: "Invalid session" };
      }

      // Clean the video key
      let cleanKey = videoKey;
      if (videoKey.includes("amazonaws.com/")) {
        const urlParts = videoKey.split("amazonaws.com/");
        cleanKey = urlParts[1];
      }

      // Get video metadata from S3
      const headParams = {
        Bucket: this.BUCKET_NAME!,
        Key: cleanKey
      };

      console.log("🔒 SecureVideoProxy: Looking for S3 object", {
        bucket: this.BUCKET_NAME,
        key: cleanKey,
        originalVideoKey: videoKey
      });

      let videoMetadata;
      try {
        videoMetadata = await s3.headObject(headParams).promise();
      } catch (error) {
        console.error("🔒 SecureVideoProxy: Video not found", error);
        
        // Try with videos/ prefix
        const alternativeKey = `videos/${cleanKey}`;
        console.log("🔒 SecureVideoProxy: Trying alternative key", alternativeKey);
        try {
          const altParams = { Bucket: this.BUCKET_NAME!, Key: alternativeKey };
          videoMetadata = await s3.headObject(altParams).promise();
          cleanKey = alternativeKey; // Use the working key
          console.log("✅ SecureVideoProxy: Found with videos/ prefix");
        } catch (altError) {
          console.error("🔒 SecureVideoProxy: Alternative key also failed", altError);
          return { success: false, error: "Video not found" };
        }
      }

      const videoSize = videoMetadata.ContentLength!;
      const videoType = videoMetadata.ContentType || "video/mp4";

      console.log("🔒 SecureVideoProxy: Video metadata", {
        size: videoSize,
        type: videoType,
        key: cleanKey
      });

      // Handle range requests for video seeking/progressive loading
      if (range) {
        return await this.handleRangeRequest(
          cleanKey,
          range,
          videoSize,
          videoType,
          res
        );
      } else {
        return await this.streamFullVideo(
          cleanKey,
          videoSize,
          videoType,
          res
        );
      }

    } catch (error: any) {
      console.error("🔒 SecureVideoProxy: Error streaming video", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Handle HTTP Range requests for video seeking - ENHANCED SECURITY
   */
  private async handleRangeRequest(
    videoKey: string,
    range: string,
    videoSize: number,
    videoType: string,
    res: Response
  ): Promise<VideoProxyResult> {
    console.log("🔒 SecureVideoProxy: Handling range request", { range });

    // Parse range header (e.g., "bytes=0-1023")
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : Math.min(start + this.CHUNK_SIZE - 1, videoSize - 1);

    if (start >= videoSize || end >= videoSize) {
      res.status(416).send("Range not satisfiable");
      return { success: false, error: "Invalid range" };
    }

    const chunkSize = (end - start) + 1;

    // 🔒 ENHANCED SECURITY HEADERS - Prevent URL exposure and downloads
    const headers = {
      'Content-Range': `bytes ${start}-${end}/${videoSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize.toString(),
      'Content-Type': videoType,
      // Aggressive caching prevention
      'Cache-Control': 'private, no-cache, no-store, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      // Security headers to prevent URL exposure
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-Download-Options': 'noopen',
      'Content-Security-Policy': "default-src 'none'; media-src 'self'",
      'Referrer-Policy': 'no-referrer',
      // Prevent content disposition that allows downloads
      'Content-Disposition': 'inline; filename=""',
      // Custom headers to identify secure streams
      'X-Secure-Stream': 'true',
      'X-Stream-Protection': 'enabled',
      // CORS headers for frontend access only
      'Access-Control-Allow-Origin': 'http://localhost:5173',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Headers': 'Range, Content-Type, Authorization',
      'Access-Control-Expose-Headers': 'Content-Range, Accept-Ranges, Content-Length, X-Secure-Stream'
    };

    res.writeHead(206, headers);

    // Stream the requested byte range
    const params = {
      Bucket: this.BUCKET_NAME!,
      Key: videoKey,
      Range: `bytes=${start}-${end}`
    };

    const stream = s3.getObject(params).createReadStream();
    
    stream.on('error', (error) => {
      console.error("🔒 SecureVideoProxy: Stream error", error);
      if (!res.headersSent) {
        res.status(500).send("Stream error");
      }
    });

    stream.pipe(res);

    console.log("🔒 SecureVideoProxy: Range request served", {
      start,
      end,
      chunkSize
    });

    return { success: true, headers };
  }

  /**
   * Stream full video (for browsers that don't support range requests) - ENHANCED SECURITY
   */
  private async streamFullVideo(
    videoKey: string,
    videoSize: number,
    videoType: string,
    res: Response
  ): Promise<VideoProxyResult> {
    console.log("🔒 SecureVideoProxy: Streaming full video");

    // 🔒 ENHANCED SECURITY HEADERS - Prevent URL exposure and downloads
    const headers = {
      'Content-Length': videoSize.toString(),
      'Content-Type': videoType,
      'Accept-Ranges': 'bytes',
      // Aggressive caching prevention
      'Cache-Control': 'private, no-cache, no-store, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      // Security headers to prevent URL exposure
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-Download-Options': 'noopen',
      'Content-Security-Policy': "default-src 'none'; media-src 'self'",
      'Referrer-Policy': 'no-referrer',
      // Prevent content disposition that allows downloads
      'Content-Disposition': 'inline; filename=""',
      // Custom headers to identify secure streams
      'X-Secure-Stream': 'true',
      'X-Stream-Protection': 'enabled',
      // CORS headers for frontend access only
      'Access-Control-Allow-Origin': 'http://localhost:5173',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Headers': 'Range, Content-Type, Authorization',
      'Access-Control-Expose-Headers': 'Content-Range, Accept-Ranges, Content-Length, X-Secure-Stream'
    };

    res.writeHead(200, headers);

    const params = {
      Bucket: this.BUCKET_NAME!,
      Key: videoKey
    };

    const stream = s3.getObject(params).createReadStream();
    
    stream.on('error', (error) => {
      console.error("🔒 SecureVideoProxy: Stream error", error);
      if (!res.headersSent) {
        res.status(500).send("Stream error");
      }
    });

    stream.pipe(res);

    return { success: true, headers };
  }

  /**
   * 🔒 Generate proxy URL instead of direct S3 URL
   */
  public generateProxyVideoUrl(
    videoKey: string,
    serviceId: string,
    sessionToken: string
  ): string {
    const baseUrl = process.env.BACKEND_URL || 'http://localhost:5002';
    const encodedKey = encodeURIComponent(videoKey);
    
    return `${baseUrl}/seeker/secure-video-proxy/${encodedKey}?serviceId=${serviceId}&sessionToken=${sessionToken}`;
  }

  /**
   * 🔒 NEW: Secure blob video loading - Prevents URL exposure completely
   * Returns video data as chunks for blob URL creation on frontend
   */
  public async getSecureVideoChunk(
    videoKey: string,
    userId: string,
    serviceId: string,
    sessionToken: string,
    chunkIndex: number,
    chunkSize: number = 1024 * 1024 // 1MB default
  ): Promise<{ success: boolean; data?: Buffer; error?: string; totalChunks?: number }> {
    try {
      console.log("🔒 SecureVideoProxy: Getting secure video chunk", {
        chunkIndex,
        chunkSize
      });

      // Validate session
      const isValidSession = await EnhancedVideoSessionService.validateSession(
        sessionToken,
        userId,
        serviceId
      );

      if (!isValidSession) {
        return { success: false, error: "Invalid session" };
      }

      // Clean video key
      let cleanKey = videoKey;
      if (videoKey.includes("amazonaws.com/")) {
        const urlParts = videoKey.split("amazonaws.com/");
        cleanKey = urlParts[1];
      }

      // Get video metadata
      const headParams = { Bucket: this.BUCKET_NAME!, Key: cleanKey };
      const videoMetadata = await s3.headObject(headParams).promise();
      const videoSize = videoMetadata.ContentLength!;
      const totalChunks = Math.ceil(videoSize / chunkSize);

      // Calculate chunk range
      const start = chunkIndex * chunkSize;
      const end = Math.min(start + chunkSize - 1, videoSize - 1);

      // Get chunk data
      const params = {
        Bucket: this.BUCKET_NAME!,
        Key: cleanKey,
        Range: `bytes=${start}-${end}`
      };

      const result = await s3.getObject(params).promise();
      
      return { 
        success: true, 
        data: result.Body as Buffer,
        totalChunks 
      };

    } catch (error: any) {
      console.error("🔒 SecureVideoProxy: Error getting secure chunk", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Validate that video key exists and user has access
   */
  public async validateVideoAccess(
    videoKey: string,
    userId: string,
    serviceId: string
  ): Promise<boolean> {
    try {
      // Check if video exists in S3
      let cleanKey = videoKey;
      if (videoKey.includes("amazonaws.com/")) {
        const urlParts = videoKey.split("amazonaws.com/");
        cleanKey = urlParts[1];
      }

      const params = {
        Bucket: this.BUCKET_NAME!,
        Key: cleanKey
      };

      await s3.headObject(params).promise();

      // Additional access validation could be added here
      // e.g., check if user has purchased the service, etc.

      return true;
    } catch (error) {
      console.error("🔒 SecureVideoProxy: Video access validation failed", error);
      return false;
    }
  }
}

export default new SecureVideoProxyService();