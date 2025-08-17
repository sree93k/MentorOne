/**
 * 🔹 DIP COMPLIANCE: Video Analytics Service Interface
 * Defines video analytics and tracking operations
 */
export interface IVideoAnalyticsService {
  // View Tracking
  trackVideoView(
    userId: string,
    videoId: string,
    metadata: {
      duration?: number;
      quality?: string;
      timestamp: Date;
      userAgent?: string;
      ipAddress?: string;
    }
  ): Promise<void>;

  // Analytics Retrieval
  getVideoAnalytics(
    videoId: string,
    timeRange?: {
      startDate: Date;
      endDate: Date;
    }
  ): Promise<{
    totalViews: number;
    uniqueViewers: number;
    averageWatchTime: number;
    viewsByQuality: Record<string, number>;
    viewsByDate: Array<{
      date: string;
      views: number;
    }>;
  }>;

  // User Analytics
  getUserVideoAnalytics(
    userId: string,
    timeRange?: {
      startDate: Date;
      endDate: Date;
    }
  ): Promise<{
    totalWatchTime: number;
    videosWatched: number;
    averageSessionDuration: number;
    preferredQuality: string;
  }>;

  // Engagement Metrics
  getEngagementMetrics(
    videoId: string
  ): Promise<{
    completionRate: number;
    dropOffPoints: Array<{
      timestamp: number;
      dropOffPercentage: number;
    }>;
    replayRate: number;
  }>;
}