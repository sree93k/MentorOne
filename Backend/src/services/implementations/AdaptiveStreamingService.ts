// services/implementations/AdaptiveStreamingService.ts
import ffmpeg from "fluent-ffmpeg";
import { s3 } from "../../config/awsS3";
import { createReadStream, createWriteStream, existsSync, mkdirSync } from "fs";
import { join } from "path";
import crypto from "crypto";

interface QualityLevel {
  name: string;
  resolution: string;
  bitrate: string;
  bandwidth: number;
  codecs: string;
}

interface AdaptiveManifest {
  masterPlaylistKey: string;
  qualityLevels: QualityLevel[];
  segmentDuration: number;
  totalDuration: number;
}

interface VideoAnalytics {
  viewerId: string;
  videoId: string;
  qualityChanges: Array<{
    timestamp: number;
    from: string;
    to: string;
    reason: 'user' | 'adaptive' | 'bandwidth';
  }>;
  bufferingEvents: Array<{
    timestamp: number;
    duration: number;
    quality: string;
  }>;
  totalWatchTime: number;
  completionRate: number;
}

class AdaptiveStreamingService {
  private readonly TEMP_DIR = join(process.cwd(), "temp");
  private readonly SEGMENT_DURATION = 10;
  
  // 🎯 Multiple Quality Levels for Professional Streaming
  private readonly QUALITY_LEVELS: QualityLevel[] = [
    {
      name: "240p",
      resolution: "426x240",
      bitrate: "400k",
      bandwidth: 500000,
      codecs: "avc1.42001e,mp4a.40.2"
    },
    {
      name: "360p", 
      resolution: "640x360",
      bitrate: "800k",
      bandwidth: 900000,
      codecs: "avc1.42001f,mp4a.40.2"
    },
    {
      name: "480p",
      resolution: "854x480", 
      bitrate: "1200k",
      bandwidth: 1400000,
      codecs: "avc1.4d001f,mp4a.40.2"
    },
    {
      name: "720p",
      resolution: "1280x720",
      bitrate: "2500k", 
      bandwidth: 2800000,
      codecs: "avc1.4d001f,mp4a.40.2"
    },
    {
      name: "1080p",
      resolution: "1920x1080",
      bitrate: "5000k",
      bandwidth: 5500000,
      codecs: "avc1.640028,mp4a.40.2"
    }
  ];

  private analytics: Map<string, VideoAnalytics> = new Map();

  constructor() {
    if (!existsSync(this.TEMP_DIR)) {
      mkdirSync(this.TEMP_DIR, { recursive: true });
    }
    console.log('🎬 AdaptiveStreamingService: Initialized with quality levels:', 
      this.QUALITY_LEVELS.map(q => q.name).join(', '));
  }

  /**
   * 🎯 PHASE 5.1: Process video to multiple quality levels
   */
  public async processVideoToAdaptiveHLS(
    originalS3Key: string,
    serviceId: string,
    episodeId?: string
  ): Promise<AdaptiveManifest> {
    const processingId = crypto.randomUUID();
    const tempDir = join(this.TEMP_DIR, processingId);
    
    try {
      console.log('🎬 Processing video to adaptive HLS:', {
        originalS3Key: originalS3Key.substring(0, 30) + '...',
        serviceId,
        episodeId,
        qualities: this.QUALITY_LEVELS.length
      });

      if (!existsSync(tempDir)) {
        mkdirSync(tempDir, { recursive: true });
      }

      // Download original video
      const originalPath = join(tempDir, 'original.mp4');
      await this.downloadFromS3(originalS3Key, originalPath);

      // Process each quality level
      const qualityPromises = this.QUALITY_LEVELS.map(quality => 
        this.processQualityLevel(originalPath, tempDir, quality, serviceId, episodeId)
      );

      const qualityResults = await Promise.all(qualityPromises);

      // Generate master playlist
      const masterPlaylistContent = this.generateMasterPlaylist(qualityResults);
      const masterPlaylistKey = `hls/${serviceId}${episodeId ? `/${episodeId}` : ''}/master.m3u8`;
      
      await this.uploadToS3(masterPlaylistKey, masterPlaylistContent, 'application/x-mpegURL');

      // Get video duration
      const duration = await this.getVideoDuration(originalPath);

      console.log('🎬 Adaptive HLS processing completed:', {
        masterPlaylistKey,
        qualityLevels: qualityResults.length,
        totalDuration: duration
      });

      return {
        masterPlaylistKey,
        qualityLevels: qualityResults,
        segmentDuration: this.SEGMENT_DURATION,
        totalDuration: duration
      };

    } finally {
      // Cleanup temp files
      this.cleanupTempDirectory(tempDir);
    }
  }

  /**
   * Process individual quality level
   */
  private async processQualityLevel(
    originalPath: string,
    tempDir: string,
    quality: QualityLevel,
    serviceId: string,
    episodeId?: string
  ): Promise<QualityLevel & { playlistKey: string }> {
    return new Promise((resolve, reject) => {
      const qualityDir = join(tempDir, quality.name);
      if (!existsSync(qualityDir)) {
        mkdirSync(qualityDir, { recursive: true });
      }

      const outputPath = join(qualityDir, 'playlist.m3u8');
      const segmentPattern = join(qualityDir, 'segment_%03d.ts');

      ffmpeg(originalPath)
        .outputOptions([
          '-c:v libx264',
          '-c:a aac',
          '-preset medium',
          '-crf 23',
          `-s ${quality.resolution}`,
          `-b:v ${quality.bitrate}`,
          '-maxrate 1.5M',
          '-bufsize 2M',
          '-f hls',
          `-hls_time ${this.SEGMENT_DURATION}`,
          '-hls_list_size 0',
          '-hls_segment_filename', segmentPattern
        ])
        .output(outputPath)
        .on('end', async () => {
          try {
            // Upload playlist and segments to S3
            const playlistKey = await this.uploadQualityToS3(
              qualityDir, 
              quality.name, 
              serviceId, 
              episodeId
            );

            resolve({
              ...quality,
              playlistKey
            });
          } catch (error) {
            reject(error);
          }
        })
        .on('error', (error) => {
          console.error(`🎬 Error processing ${quality.name}:`, error);
          reject(error);
        })
        .run();
    });
  }

  /**
   * Upload quality level to S3
   */
  private async uploadQualityToS3(
    qualityDir: string,
    qualityName: string,
    serviceId: string,
    episodeId?: string
  ): Promise<string> {
    const fs = require('fs').promises;
    const files = await fs.readdir(qualityDir);
    
    const baseKey = `hls/${serviceId}${episodeId ? `/${episodeId}` : ''}/${qualityName}`;
    
    // Upload playlist
    const playlistFile = files.find(f => f.endsWith('.m3u8'));
    if (!playlistFile) {
      throw new Error(`No playlist file found for ${qualityName}`);
    }
    
    const playlistPath = join(qualityDir, playlistFile);
    const playlistContent = await fs.readFile(playlistPath, 'utf-8');
    const playlistKey = `${baseKey}/playlist.m3u8`;
    
    await this.uploadToS3(playlistKey, playlistContent, 'application/x-mpegURL');
    
    // Upload segments
    const segmentFiles = files.filter(f => f.endsWith('.ts'));
    const segmentPromises = segmentFiles.map(async (segmentFile) => {
      const segmentPath = join(qualityDir, segmentFile);
      const segmentBuffer = await fs.readFile(segmentPath);
      const segmentKey = `${baseKey}/${segmentFile}`;
      
      await this.uploadToS3(segmentKey, segmentBuffer, 'video/mp2t');
    });
    
    await Promise.all(segmentPromises);
    
    console.log(`🎬 Uploaded ${qualityName}: playlist + ${segmentFiles.length} segments`);
    return playlistKey;
  }

  /**
   * Generate HLS master playlist for adaptive streaming
   */
  private generateMasterPlaylist(qualityLevels: Array<QualityLevel & { playlistKey: string }>): string {
    let masterPlaylist = '#EXTM3U\n#EXT-X-VERSION:6\n\n';
    
    qualityLevels.forEach(quality => {
      masterPlaylist += `#EXT-X-STREAM-INF:BANDWIDTH=${quality.bandwidth},RESOLUTION=${quality.resolution},CODECS="${quality.codecs}"\n`;
      masterPlaylist += `${quality.name}/playlist.m3u8\n\n`;
    });
    
    return masterPlaylist;
  }

  /**
   * 🎯 PHASE 5.2: Get adaptive streaming info for client
   */
  public async getAdaptiveStreamingInfo(
    serviceId: string,
    episodeId?: string
  ): Promise<{
    hasAdaptive: boolean;
    masterPlaylistUrl?: string;
    qualityLevels: QualityLevel[];
    recommendedStartQuality: string;
  }> {
    try {
      const masterPlaylistKey = `hls/${serviceId}${episodeId ? `/${episodeId}` : ''}/master.m3u8`;
      
      // Check if adaptive version exists
      const exists = await this.checkS3ObjectExists(masterPlaylistKey);
      
      if (exists) {
        return {
          hasAdaptive: true,
          masterPlaylistUrl: `/seeker/adaptive-playlist/${serviceId}${episodeId ? `/${episodeId}` : ''}`,
          qualityLevels: this.QUALITY_LEVELS,
          recommendedStartQuality: this.getRecommendedStartQuality()
        };
      }
      
      return {
        hasAdaptive: false,
        qualityLevels: [],
        recommendedStartQuality: '480p'
      };
    } catch (error) {
      console.error('🎬 Error getting adaptive streaming info:', error);
      return {
        hasAdaptive: false,
        qualityLevels: [],
        recommendedStartQuality: '480p'
      };
    }
  }

  /**
   * 🎯 PHASE 5.3: Track video analytics
   */
  public trackVideoAnalytics(
    viewerId: string,
    videoId: string,
    event: {
      type: 'play' | 'pause' | 'seek' | 'quality_change' | 'buffering' | 'complete';
      timestamp: number;
      data?: any;
    }
  ): void {
    const sessionKey = `${viewerId}_${videoId}`;
    
    if (!this.analytics.has(sessionKey)) {
      this.analytics.set(sessionKey, {
        viewerId,
        videoId,
        qualityChanges: [],
        bufferingEvents: [],
        totalWatchTime: 0,
        completionRate: 0
      });
    }
    
    const analytics = this.analytics.get(sessionKey)!;
    
    switch (event.type) {
      case 'quality_change':
        analytics.qualityChanges.push({
          timestamp: event.timestamp,
          from: event.data.from,
          to: event.data.to,
          reason: event.data.reason || 'user'
        });
        break;
        
      case 'buffering':
        analytics.bufferingEvents.push({
          timestamp: event.timestamp,
          duration: event.data.duration,
          quality: event.data.quality
        });
        break;
        
      case 'complete':
        analytics.completionRate = event.data.completionRate;
        analytics.totalWatchTime = event.data.totalWatchTime;
        break;
    }
    
    console.log('📊 Video analytics tracked:', {
      viewerId: viewerId.substring(0, 8) + '...',
      videoId: videoId.substring(0, 8) + '...',
      eventType: event.type
    });
  }

  /**
   * 🎯 PHASE 5.4: Add video watermark
   */
  public async addVideoWatermark(
    videoPath: string,
    watermarkText: string,
    userId: string
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const outputPath = videoPath.replace('.mp4', '_watermarked.mp4');
      
      // Create dynamic watermark with user info and timestamp
      const watermarkFilter = `drawtext=text='${watermarkText} | ${userId} | ${new Date().toISOString()}':fontcolor=white@0.8:fontsize=20:x=10:y=10:box=1:boxcolor=black@0.5`;
      
      ffmpeg(videoPath)
        .outputOptions([
          '-vf', watermarkFilter,
          '-c:a copy'
        ])
        .output(outputPath)
        .on('end', () => {
          console.log('🎨 Video watermark added:', {
            watermarkText,
            userId: userId.substring(0, 8) + '...'
          });
          resolve(outputPath);
        })
        .on('error', (error) => {
          console.error('🎨 Watermark error:', error);
          reject(error);
        })
        .run();
    });
  }

  /**
   * Get recommended starting quality based on connection
   */
  private getRecommendedStartQuality(): string {
    // Could be enhanced with client-side connection detection
    return '480p'; // Safe default for most connections
  }

  /**
   * Utility methods
   */
  private async downloadFromS3(key: string, localPath: string): Promise<void> {
    const params = { Bucket: process.env.AWS_S3_BUCKET_NAME!, Key: key };
    const stream = s3.getObject(params).createReadStream();
    const writeStream = createWriteStream(localPath);
    
    return new Promise((resolve, reject) => {
      stream.pipe(writeStream);
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });
  }

  private async uploadToS3(key: string, content: string | Buffer, contentType: string): Promise<void> {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: key,
      Body: content,
      ContentType: contentType,
    };
    
    await s3.upload(params).promise();
  }

  private async checkS3ObjectExists(key: string): Promise<boolean> {
    try {
      await s3.headObject({ 
        Bucket: process.env.AWS_S3_BUCKET_NAME!, 
        Key: key 
      }).promise();
      return true;
    } catch {
      return false;
    }
  }

  private async getVideoDuration(videoPath: string): Promise<number> {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(videoPath, (err, metadata) => {
        if (err) reject(err);
        else resolve(metadata.format.duration || 0);
      });
    });
  }

  private cleanupTempDirectory(dirPath: string): void {
    try {
      require('fs').rmSync(dirPath, { recursive: true, force: true });
    } catch (error) {
      console.error('🧹 Cleanup error:', error);
    }
  }

  /**
   * Get analytics for admin dashboard
   */
  public getAnalytics(): Map<string, VideoAnalytics> {
    return new Map(this.analytics);
  }

  /**
   * Get available quality levels
   */
  public getQualityLevels(): QualityLevel[] {
    return [...this.QUALITY_LEVELS];
  }
}

export default new AdaptiveStreamingService();