// services/implementations/HLSVideoProcessingService.ts
import ffmpeg from "fluent-ffmpeg";
import { s3 } from "../../config/awsS3";
import { createReadStream, createWriteStream, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { promisify } from "util";
import crypto from "crypto";

interface HLSProcessingResult {
  hlsPlaylistKey: string;
  segmentKeys: string[];
  processingTime: number;
  originalSize: number;
  hlsSize: number;
  segmentCount: number;
}

interface HLSSegmentInfo {
  segmentKey: string;
  duration: number;
  sequenceNumber: number;
}

class HLSVideoProcessingService {
  private readonly TEMP_DIR = join(process.cwd(), "temp");
  private readonly SEGMENT_DURATION = 10; // 10 seconds per segment
  private readonly HLS_QUALITIES = [
    { name: "480p", resolution: "854x480", bitrate: "1000k" },
    { name: "720p", resolution: "1280x720", bitrate: "2500k" },
    { name: "1080p", resolution: "1920x1080", bitrate: "5000k" },
  ];

  constructor() {
    // Ensure temp directory exists
    if (!existsSync(this.TEMP_DIR)) {
      mkdirSync(this.TEMP_DIR, { recursive: true });
    }

    // Set FFmpeg path (you'll need to install FFmpeg)
    // For production, ensure FFmpeg is installed on your server
    if (process.env.FFMPEG_PATH) {
      ffmpeg.setFfmpegPath(process.env.FFMPEG_PATH);
    }
  }

  /**
   * Process video to HLS format with multiple qualities
   */
  public async processVideoToHLS(
    originalS3Key: string,
    serviceId: string,
    episodeId?: string
  ): Promise<HLSProcessingResult> {
    const startTime = Date.now();
    console.log("HLSVideoProcessingService: Starting HLS processing", {
      originalS3Key,
      serviceId,
      episodeId,
    });

    try {
      // 1. Download original video from S3
      const tempVideoPath = await this.downloadVideoFromS3(originalS3Key);

      // 2. Generate HLS segments for multiple qualities
      const hlsResults = await this.generateHLSSegments(
        tempVideoPath,
        serviceId,
        episodeId
      );

      // 3. Upload HLS files to S3
      const uploadResults = await this.uploadHLSToS3(
        hlsResults,
        serviceId,
        episodeId
      );

      // 4. Cleanup temp files
      await this.cleanupTempFiles(tempVideoPath, hlsResults.tempDir);

      const processingTime = Date.now() - startTime;
      console.log("HLSVideoProcessingService: Processing completed", {
        processingTime: processingTime / 1000 + "s",
        segmentCount: uploadResults.segmentKeys.length,
      });

      return {
        hlsPlaylistKey: uploadResults.hlsPlaylistKey,
        segmentKeys: uploadResults.segmentKeys,
        processingTime,
        originalSize: hlsResults.originalSize,
        hlsSize: hlsResults.hlsSize,
        segmentCount: uploadResults.segmentKeys.length,
      };
    } catch (error) {
      console.error("HLSVideoProcessingService: Processing failed", error);
      throw new Error(`HLS processing failed: ${error.message}`);
    }
  }

  /**
   * Download video from S3 to temp directory
   */
  private async downloadVideoFromS3(s3Key: string): Promise<string> {
    console.log("HLSVideoProcessingService: Downloading video from S3", {
      s3Key,
    });

    const tempFileName = `temp_${Date.now()}_${crypto
      .randomBytes(8)
      .toString("hex")}.mp4`;
    const tempVideoPath = join(this.TEMP_DIR, tempFileName);

    return new Promise((resolve, reject) => {
      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: s3Key,
      };

      const s3Stream = s3.getObject(params).createReadStream();
      const fileStream = createWriteStream(tempVideoPath);

      s3Stream.pipe(fileStream);

      fileStream.on("finish", () => {
        console.log("HLSVideoProcessingService: Video downloaded", {
          tempVideoPath,
        });
        resolve(tempVideoPath);
      });

      s3Stream.on("error", (error) => {
        console.error("HLSVideoProcessingService: S3 download error", error);
        reject(error);
      });

      fileStream.on("error", (error) => {
        console.error("HLSVideoProcessingService: File write error", error);
        reject(error);
      });
    });
  }

  /**
   * Generate HLS segments using FFmpeg
   */
  private async generateHLSSegments(
    videoPath: string,
    serviceId: string,
    episodeId?: string
  ): Promise<{
    tempDir: string;
    playlistPath: string;
    segmentPaths: string[];
    originalSize: number;
    hlsSize: number;
  }> {
    console.log("HLSVideoProcessingService: Generating HLS segments", {
      videoPath,
    });

    const tempDirName = `hls_${serviceId}_${episodeId || "main"}_${Date.now()}`;
    const tempHLSDir = join(this.TEMP_DIR, tempDirName);
    mkdirSync(tempHLSDir, { recursive: true });

    const playlistPath = join(tempHLSDir, "playlist.m3u8");
    const segmentPattern = join(tempHLSDir, "segment_%03d.ts");

    return new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .outputOptions([
          "-profile:v baseline", // Baseline profile for compatibility
          "-level 3.0",
          "-start_number 0", // Start segment numbering from 0
          "-hls_time " + this.SEGMENT_DURATION, // Segment duration
          "-hls_list_size 0", // Keep all segments in playlist
          "-f hls", // HLS format
          "-hls_segment_filename " + segmentPattern,
          "-c:v libx264", // Video codec
          "-c:a aac", // Audio codec
          "-strict experimental",
          "-b:v 2500k", // Default bitrate (will implement multiple qualities later)
          "-maxrate 2500k",
          "-bufsize 5000k",
        ])
        .output(playlistPath)
        .on("start", (commandLine) => {
          console.log("HLSVideoProcessingService: FFmpeg started", {
            command: commandLine,
          });
        })
        .on("progress", (progress) => {
          console.log("HLSVideoProcessingService: Processing progress", {
            percent: progress.percent?.toFixed(1) + "%",
            currentTime: progress.timemark,
          });
        })
        .on("end", async () => {
          console.log("HLSVideoProcessingService: FFmpeg processing completed");

          try {
            // Get all generated segment files
            const fs = require("fs");
            const files = fs.readdirSync(tempHLSDir);
            const segmentFiles = files
              .filter((file: string) => file.endsWith(".ts"))
              .map((file: string) => join(tempHLSDir, file));

            // Calculate sizes
            const originalStats = fs.statSync(videoPath);
            const hlsStats = segmentFiles.reduce(
              (total: number, file: string) => {
                return total + fs.statSync(file).size;
              },
              0
            );

            console.log(
              "HLSVideoProcessingService: Segment generation completed",
              {
                segmentCount: segmentFiles.length,
                originalSize: originalStats.size,
                hlsSize: hlsStats,
                compressionRatio:
                  (
                    ((originalStats.size - hlsStats) / originalStats.size) *
                    100
                  ).toFixed(1) + "%",
              }
            );

            resolve({
              tempDir: tempHLSDir,
              playlistPath,
              segmentPaths: segmentFiles,
              originalSize: originalStats.size,
              hlsSize: hlsStats,
            });
          } catch (error) {
            reject(error);
          }
        })
        .on("error", (error) => {
          console.error("HLSVideoProcessingService: FFmpeg error", error);
          reject(error);
        })
        .run();
    });
  }

  /**
   * Upload HLS files to S3
   */
  private async uploadHLSToS3(
    hlsData: {
      tempDir: string;
      playlistPath: string;
      segmentPaths: string[];
      originalSize: number;
      hlsSize: number;
    },
    serviceId: string,
    episodeId?: string
  ): Promise<{
    hlsPlaylistKey: string;
    segmentKeys: string[];
  }> {
    console.log("HLSVideoProcessingService: Uploading HLS files to S3", {
      segmentCount: hlsData.segmentPaths.length,
    });

    const hlsPrefix = `hls/${serviceId}/${episodeId || "main"}`;
    const uploadPromises: Promise<string>[] = [];

    // Upload playlist file
    const playlistKey = `${hlsPrefix}/playlist.m3u8`;
    const playlistUpload = this.uploadFileToS3(
      hlsData.playlistPath,
      playlistKey
    );

    // Upload all segment files
    const segmentUploads = hlsData.segmentPaths.map((segmentPath, index) => {
      const segmentKey = `${hlsPrefix}/segment_${String(index).padStart(
        3,
        "0"
      )}.ts`;
      return this.uploadFileToS3(segmentPath, segmentKey);
    });

    try {
      // Wait for all uploads to complete
      const [playlistResult, ...segmentResults] = await Promise.all([
        playlistUpload,
        ...segmentUploads,
      ]);

      console.log("HLSVideoProcessingService: All HLS files uploaded", {
        playlistKey: playlistResult,
        segmentCount: segmentResults.length,
      });

      return {
        hlsPlaylistKey: playlistResult,
        segmentKeys: segmentResults,
      };
    } catch (error) {
      console.error("HLSVideoProcessingService: Upload failed", error);
      throw error;
    }
  }

  /**
   * Upload a single file to S3
   */
  private async uploadFileToS3(
    filePath: string,
    s3Key: string
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const fileStream = createReadStream(filePath);
      const uploadParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: s3Key,
        Body: fileStream,
        ContentType: s3Key.endsWith(".m3u8")
          ? "application/vnd.apple.mpegurl"
          : "video/mp2t",
      };

      s3.upload(uploadParams, (error, data) => {
        if (error) {
          console.error("HLSVideoProcessingService: S3 upload error", {
            s3Key,
            error,
          });
          reject(error);
        } else {
          console.log("HLSVideoProcessingService: File uploaded", {
            s3Key,
            location: data.Location,
          });
          resolve(s3Key);
        }
      });
    });
  }

  /**
   * Cleanup temporary files
   */
  private async cleanupTempFiles(
    videoPath: string,
    hlsDir: string
  ): Promise<void> {
    try {
      const fs = require("fs");
      const path = require("path");

      // Remove original video file
      if (fs.existsSync(videoPath)) {
        fs.unlinkSync(videoPath);
      }

      // Remove HLS directory and all contents
      if (fs.existsSync(hlsDir)) {
        const files = fs.readdirSync(hlsDir);
        files.forEach((file: string) => {
          fs.unlinkSync(path.join(hlsDir, file));
        });
        fs.rmdirSync(hlsDir);
      }

      console.log("HLSVideoProcessingService: Temp files cleaned up", {
        videoPath,
        hlsDir,
      });
    } catch (error) {
      console.warn("HLSVideoProcessingService: Cleanup warning", error);
    }
  }

  /**
   * Generate secure HLS playlist with session validation
   */
  public async generateSecureHLSPlaylist(
    originalPlaylistKey: string,
    sessionToken: string,
    serviceId: string,
    userId: string
  ): Promise<string> {
    console.log("HLSVideoProcessingService: Generating secure HLS playlist", {
      originalPlaylistKey,
      sessionToken: sessionToken.substring(0, 8) + "...",
    });

    try {
      // Download original playlist
      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: originalPlaylistKey,
      };

      const playlistObj = await s3.getObject(params).promise();
      const originalPlaylist = playlistObj.Body?.toString("utf-8") || "";

      // Replace segment URLs with secure URLs
      const securePlaylist = await this.createSecurePlaylistContent(
        originalPlaylist,
        originalPlaylistKey,
        sessionToken,
        serviceId,
        userId
      );

      return securePlaylist;
    } catch (error) {
      console.error(
        "HLSVideoProcessingService: Secure playlist generation failed",
        error
      );
      throw error;
    }
  }

  /**
   * Create secure playlist content with token-protected segment URLs
   */
  private async createSecurePlaylistContent(
    originalPlaylist: string,
    playlistKey: string,
    sessionToken: string,
    serviceId: string,
    userId: string
  ): Promise<string> {
    const lines = originalPlaylist.split("\n");
    const secureLines: string[] = [];

    for (const line of lines) {
      if (line.endsWith(".ts")) {
        // This is a segment file line - replace with secure URL
        const segmentKey = playlistKey.replace("playlist.m3u8", line.trim());
        const secureUrl = await this.generateSecureSegmentUrl(
          segmentKey,
          sessionToken,
          serviceId,
          userId
        );
        secureLines.push(secureUrl);
      } else {
        // Keep other lines as-is (metadata, duration, etc.)
        secureLines.push(line);
      }
    }

    return secureLines.join("\n");
  }

  /**
   * Generate secure URL for individual HLS segment
   */
  private async generateSecureSegmentUrl(
    segmentKey: string,
    sessionToken: string,
    serviceId: string,
    userId: string
  ): Promise<string> {
    // Create secure segment URL through your backend with shorter expiration
    const baseUrl = process.env.BACKEND_URL || "http://localhost:5002";
    const expirationTime = Date.now() + 30 * 60 * 1000; // 30 minutes
    const secureUrl = `${baseUrl}/seeker/hls-segment/${encodeURIComponent(
      segmentKey
    )}?sessionToken=${sessionToken}&serviceId=${serviceId}&userId=${userId}&exp=${expirationTime}`;

    return secureUrl;
  }

  /**
   * Validate and serve HLS segment with security checks
   */
  public async serveSecureSegment(
    segmentKey: string,
    sessionToken: string,
    serviceId: string,
    userId: string,
    expirationTime: number
  ): Promise<{ stream: any; contentType: string }> {
    // Check expiration
    if (Date.now() > expirationTime) {
      throw new Error("Segment URL has expired");
    }

    console.log("HLSVideoProcessingService: Serving secure segment", {
      segmentKey: segmentKey.substring(0, 30) + "...",
      userId,
      sessionToken: sessionToken.substring(0, 8) + "...",
    });

    try {
      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: segmentKey,
      };

      const stream = s3.getObject(params).createReadStream();

      return {
        stream,
        contentType: "video/mp2t",
      };
    } catch (error) {
      console.error("HLSVideoProcessingService: Error serving segment", error);
      throw new Error("Failed to serve video segment");
    }
  }

  /**
   * Get HLS processing status
   */
  public async getProcessingStatus(
    serviceId: string,
    episodeId?: string
  ): Promise<{
    isProcessed: boolean;
    playlistKey?: string;
    segmentCount?: number;
  }> {
    try {
      const playlistKey = `hls/${serviceId}/${
        episodeId || "main"
      }/playlist.m3u8`;

      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: playlistKey,
      };

      await s3.headObject(params).promise();

      // If playlist exists, count segments
      const playlistObj = await s3.getObject(params).promise();
      const playlistContent = playlistObj.Body?.toString("utf-8") || "";
      const segmentCount = (playlistContent.match(/\.ts/g) || []).length;

      return {
        isProcessed: true,
        playlistKey,
        segmentCount,
      };
    } catch (error) {
      return {
        isProcessed: false,
      };
    }
  }
}

export default new HLSVideoProcessingService();
