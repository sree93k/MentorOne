import mongoose from "mongoose";
import ServiceModel from "../../models/serviceModel";

interface VideoAnalyticsData {
  videoS3Key: string;
  userId: string;
  sessionId: string;
  event: 'play' | 'pause' | 'seek' | 'complete' | 'view' | 'error';
  timestamp: Date;
  metadata: {
    watchTime?: number; // seconds watched
    totalDuration?: number; // total video duration
    quality?: string; // video quality
    userAgent?: string;
    ipAddress?: string;
    referrer?: string;
    seekPosition?: number; // for seek events
    errorCode?: string; // for error events
    deviceType?: 'desktop' | 'mobile' | 'tablet';
    platform?: 'web' | 'mobile_app';
    browser?: string;
    networkSpeed?: string;
  };
}

interface ViewSession {
  sessionId: string;
  userId: string;
  videoS3Key: string;
  startTime: Date;
  endTime?: Date;
  totalWatchTime: number;
  completion: number; // percentage
  quality: string;
  events: VideoAnalyticsData[];
}

interface VideoMetrics {
  videoS3Key: string;
  totalViews: number;
  uniqueViewers: number;
  averageWatchTime: number;
  completionRate: number;
  dropOffPoints: number[]; // percentage points where users drop off
  popularityScore: number;
  engagement: {
    likes: number;
    dislikes: number;
    comments: number;
    shares: number;
    bookmarks: number;
  };
  demographics: {
    deviceTypes: Record<string, number>;
    browsers: Record<string, number>;
    countries: Record<string, number>;
    timeZones: Record<string, number>;
  };
  performance: {
    averageLoadTime: number;
    bufferingEvents: number;
    errorRate: number;
    qualityDistribution: Record<string, number>;
  };
}

interface AnalyticsQuery {
  videoS3Key?: string;
  userId?: string;
  serviceId?: string;
  mentorId?: string;
  startDate?: Date;
  endDate?: Date;
  event?: string;
  deviceType?: string;
  quality?: string;
}

class VideoAnalyticsService {
  private sessions: Map<string, ViewSession> = new Map();
  private readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

  /**
   * 📊 TRACK VIDEO EVENT
   * Record comprehensive video analytics
   */
  public async trackVideoEvent(data: VideoAnalyticsData): Promise<void> {
    try {
      console.log("📊 Tracking video event", {
        event: data.event,
        videoS3Key: data.videoS3Key.split('/').pop(),
        userId: data.userId.substring(0, 8) + "...",
        watchTime: data.metadata.watchTime
      });

      // Update or create session
      await this.updateSession(data);

      // Process specific events
      switch (data.event) {
        case 'view':
          await this.handleViewEvent(data);
          break;
        case 'play':
          await this.handlePlayEvent(data);
          break;
        case 'pause':
          await this.handlePauseEvent(data);
          break;
        case 'seek':
          await this.handleSeekEvent(data);
          break;
        case 'complete':
          await this.handleCompleteEvent(data);
          break;
        case 'error':
          await this.handleErrorEvent(data);
          break;
      }

      // Update real-time metrics
      await this.updateVideoMetrics(data);

    } catch (error) {
      console.error("🚫 Failed to track video event:", error);
    }
  }

  /**
   * 🎬 UPDATE SESSION
   * Manage user viewing sessions
   */
  private async updateSession(data: VideoAnalyticsData): Promise<void> {
    let session = this.sessions.get(data.sessionId);

    if (!session) {
      // Create new session
      session = {
        sessionId: data.sessionId,
        userId: data.userId,
        videoS3Key: data.videoS3Key,
        startTime: data.timestamp,
        totalWatchTime: 0,
        completion: 0,
        quality: data.metadata.quality || 'auto',
        events: []
      };
      this.sessions.set(data.sessionId, session);
    }

    // Update session data
    session.endTime = data.timestamp;
    session.events.push(data);

    // Calculate watch time and completion
    if (data.metadata.watchTime) {
      session.totalWatchTime = data.metadata.watchTime;
    }

    if (data.metadata.totalDuration && data.metadata.watchTime) {
      session.completion = Math.min(100, (data.metadata.watchTime / data.metadata.totalDuration) * 100);
    }

    // Clean up old sessions
    this.cleanupSessions();
  }

  /**
   * 👁️ HANDLE VIEW EVENT
   * Process video view initiation
   */
  private async handleViewEvent(data: VideoAnalyticsData): Promise<void> {
    try {
      // Find the service and episode
      const updateResult = await ServiceModel.updateOne(
        {
          "exclusiveContent.episodes.videoS3Key": data.videoS3Key
        },
        {
          $inc: {
            "exclusiveContent.$[season].episodes.$[episode].analytics.totalViews": 1,
            "stats.views": 1
          },
          $set: {
            "exclusiveContent.$[season].episodes.$[episode].analytics.lastViewedAt": data.timestamp
          }
        },
        {
          arrayFilters: [
            { "season.episodes.videoS3Key": data.videoS3Key },
            { "episode.videoS3Key": data.videoS3Key }
          ]
        }
      );

      console.log("👁️ View event processed", { 
        videoS3Key: data.videoS3Key.split('/').pop(),
        updated: updateResult.modifiedCount > 0 
      });

    } catch (error) {
      console.error("🚫 Failed to handle view event:", error);
    }
  }

  /**
   * ▶️ HANDLE PLAY EVENT
   * Track video play events
   */
  private async handlePlayEvent(data: VideoAnalyticsData): Promise<void> {
    console.log("▶️ Play event tracked", {
      videoS3Key: data.videoS3Key.split('/').pop(),
      quality: data.metadata.quality
    });
  }

  /**
   * ⏸️ HANDLE PAUSE EVENT
   * Track video pause events
   */
  private async handlePauseEvent(data: VideoAnalyticsData): Promise<void> {
    console.log("⏸️ Pause event tracked", {
      videoS3Key: data.videoS3Key.split('/').pop(),
      watchTime: data.metadata.watchTime
    });
  }

  /**
   * ⏩ HANDLE SEEK EVENT
   * Track video seeking behavior
   */
  private async handleSeekEvent(data: VideoAnalyticsData): Promise<void> {
    console.log("⏩ Seek event tracked", {
      videoS3Key: data.videoS3Key.split('/').pop(),
      seekPosition: data.metadata.seekPosition
    });
  }

  /**
   * ✅ HANDLE COMPLETE EVENT
   * Track video completion
   */
  private async handleCompleteEvent(data: VideoAnalyticsData): Promise<void> {
    try {
      await ServiceModel.updateOne(
        {
          "exclusiveContent.episodes.videoS3Key": data.videoS3Key
        },
        {
          $inc: {
            "exclusiveContent.$[season].episodes.$[episode].analytics.engagement.completions": 1
          },
          $set: {
            "exclusiveContent.$[season].episodes.$[episode].analytics.completionRate": 
              await this.calculateCompletionRate(data.videoS3Key)
          }
        },
        {
          arrayFilters: [
            { "season.episodes.videoS3Key": data.videoS3Key },
            { "episode.videoS3Key": data.videoS3Key }
          ]
        }
      );

      console.log("✅ Complete event processed", {
        videoS3Key: data.videoS3Key.split('/').pop()
      });

    } catch (error) {
      console.error("🚫 Failed to handle complete event:", error);
    }
  }

  /**
   * ❌ HANDLE ERROR EVENT
   * Track video errors
   */
  private async handleErrorEvent(data: VideoAnalyticsData): Promise<void> {
    console.error("❌ Video error tracked", {
      videoS3Key: data.videoS3Key.split('/').pop(),
      errorCode: data.metadata.errorCode,
      userAgent: data.metadata.userAgent
    });

    // TODO: Store error data for analysis
  }

  /**
   * 📈 UPDATE VIDEO METRICS
   * Update real-time video metrics
   */
  private async updateVideoMetrics(data: VideoAnalyticsData): Promise<void> {
    try {
      const session = this.sessions.get(data.sessionId);
      if (!session) return;

      // Calculate average watch time
      const avgWatchTime = await this.calculateAverageWatchTime(data.videoS3Key);
      
      // Update metrics
      await ServiceModel.updateOne(
        {
          "exclusiveContent.episodes.videoS3Key": data.videoS3Key
        },
        {
          $set: {
            "exclusiveContent.$[season].episodes.$[episode].analytics.averageWatchTime": avgWatchTime,
            "exclusiveContent.$[season].episodes.$[episode].analytics.popularityScore": 
              await this.calculatePopularityScore(data.videoS3Key)
          }
        },
        {
          arrayFilters: [
            { "season.episodes.videoS3Key": data.videoS3Key },
            { "episode.videoS3Key": data.videoS3Key }
          ]
        }
      );

    } catch (error) {
      console.error("🚫 Failed to update video metrics:", error);
    }
  }

  /**
   * 📊 GET VIDEO ANALYTICS
   * Retrieve comprehensive video analytics
   */
  public async getVideoAnalytics(query: AnalyticsQuery): Promise<VideoMetrics | null> {
    try {
      console.log("📊 Getting video analytics", query);

      let matchQuery: any = {};

      if (query.videoS3Key) {
        matchQuery["exclusiveContent.episodes.videoS3Key"] = query.videoS3Key;
      }

      if (query.serviceId) {
        matchQuery["_id"] = new mongoose.Types.ObjectId(query.serviceId);
      }

      if (query.mentorId) {
        matchQuery["mentorId"] = new mongoose.Types.ObjectId(query.mentorId);
      }

      const services = await ServiceModel.find(matchQuery).lean();

      if (services.length === 0) {
        return null;
      }

      // Find the specific episode
      let targetEpisode: any = null;
      for (const service of services) {
        for (const season of service.exclusiveContent || []) {
          for (const episode of season.episodes || []) {
            if (!query.videoS3Key || episode.videoS3Key === query.videoS3Key) {
              targetEpisode = episode;
              break;
            }
          }
          if (targetEpisode) break;
        }
        if (targetEpisode) break;
      }

      if (!targetEpisode) {
        return null;
      }

      // Return analytics data
      const metrics: VideoMetrics = {
        videoS3Key: targetEpisode.videoS3Key || '',
        totalViews: targetEpisode.analytics?.totalViews || 0,
        uniqueViewers: targetEpisode.analytics?.uniqueViewers || 0,
        averageWatchTime: targetEpisode.analytics?.averageWatchTime || 0,
        completionRate: targetEpisode.analytics?.completionRate || 0,
        dropOffPoints: [],
        popularityScore: targetEpisode.analytics?.popularityScore || 0,
        engagement: targetEpisode.analytics?.engagement || {
          likes: 0,
          dislikes: 0,
          comments: 0,
          shares: 0,
          bookmarks: 0
        },
        demographics: {
          deviceTypes: {},
          browsers: {},
          countries: {},
          timeZones: {}
        },
        performance: {
          averageLoadTime: 0,
          bufferingEvents: 0,
          errorRate: 0,
          qualityDistribution: {}
        }
      };

      return metrics;

    } catch (error) {
      console.error("🚫 Failed to get video analytics:", error);
      return null;
    }
  }

  /**
   * 📈 GET DASHBOARD ANALYTICS
   * Get analytics for mentor dashboard
   */
  public async getDashboardAnalytics(mentorId: string): Promise<{
    totalViews: number;
    totalWatchTime: number;
    averageEngagement: number;
    topVideos: Array<{
      title: string;
      views: number;
      engagement: number;
    }>;
    recentActivity: Array<{
      date: Date;
      views: number;
      watchTime: number;
    }>;
  }> {
    try {
      const services = await ServiceModel.find({
        mentorId: new mongoose.Types.ObjectId(mentorId),
        type: "DigitalProducts",
        digitalProductType: "videoTutorials"
      }).lean();

      let totalViews = 0;
      let totalWatchTime = 0;
      const topVideos: any[] = [];

      for (const service of services) {
        for (const season of service.exclusiveContent || []) {
          for (const episode of season.episodes || []) {
            const analytics = episode.analytics;
            if (analytics) {
              totalViews += analytics.totalViews || 0;
              totalWatchTime += analytics.averageWatchTime || 0;
              
              topVideos.push({
                title: episode.title,
                views: analytics.totalViews || 0,
                engagement: analytics.popularityScore || 0
              });
            }
          }
        }
      }

      // Sort top videos by views
      topVideos.sort((a, b) => b.views - a.views);

      return {
        totalViews,
        totalWatchTime,
        averageEngagement: topVideos.length > 0 
          ? topVideos.reduce((sum, video) => sum + video.engagement, 0) / topVideos.length
          : 0,
        topVideos: topVideos.slice(0, 10),
        recentActivity: [] // TODO: Implement recent activity tracking
      };

    } catch (error) {
      console.error("🚫 Failed to get dashboard analytics:", error);
      throw error;
    }
  }

  /**
   * 🧮 CALCULATE COMPLETION RATE
   * Calculate video completion rate
   */
  private async calculateCompletionRate(videoS3Key: string): Promise<number> {
    // TODO: Implement based on session data
    return 0;
  }

  /**
   * ⏱️ CALCULATE AVERAGE WATCH TIME
   * Calculate average watch time for a video
   */
  private async calculateAverageWatchTime(videoS3Key: string): Promise<number> {
    // TODO: Implement based on session data
    return 0;
  }

  /**
   * ⭐ CALCULATE POPULARITY SCORE
   * Calculate video popularity score
   */
  private async calculatePopularityScore(videoS3Key: string): Promise<number> {
    // TODO: Implement popularity algorithm
    return 0;
  }

  /**
   * 🧹 CLEANUP SESSIONS
   * Remove expired sessions
   */
  private cleanupSessions(): void {
    const now = Date.now();
    for (const [sessionId, session] of this.sessions.entries()) {
      if (now - session.startTime.getTime() > this.SESSION_TIMEOUT) {
        this.sessions.delete(sessionId);
      }
    }
  }

  /**
   * 💾 FLUSH SESSION DATA
   * Persist session data to database
   */
  public async flushSessionData(): Promise<void> {
    try {
      console.log(`💾 Flushing ${this.sessions.size} active sessions`);
      
      for (const [sessionId, session] of this.sessions.entries()) {
        // TODO: Store session data to database
        console.log(`💾 Session ${sessionId}: ${session.totalWatchTime}s watched`);
      }

      // Clear sessions after flushing
      this.sessions.clear();

    } catch (error) {
      console.error("🚫 Failed to flush session data:", error);
    }
  }
}

export default new VideoAnalyticsService();