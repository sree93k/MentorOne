/**
 * 🔹 DIP COMPLIANCE: CDN Service Interface
 * Defines Content Delivery Network operations for video streaming
 */
export interface ICDNService {
  // CDN Configuration
  isEnabled(): boolean;
  
  updateConfig(config: {
    enabled?: boolean;
    workerUrl?: string;
    fallbackToOrigin?: boolean;
    cacheHeaders?: {
      segments: string;
      playlists: string;
    };
  }): void;

  // URL Generation
  getCDNUrl(
    originalUrl: string,
    options?: {
      cacheControl?: string;
      priority?: 'high' | 'normal' | 'low';
    }
  ): string;

  getVideoSegmentUrl(
    segmentPath: string,
    sessionToken: string
  ): string;

  getPlaylistUrl(
    playlistPath: string,
    sessionToken: string
  ): string;

  // Performance Metrics
  getPerformanceMetrics(): {
    cacheHitRate: number;
    averageResponseTime: number;
    bandwidthSaved: number;
    globalRequests: number;
  };

  recordRequest(
    url: string,
    responseTime: number,
    cacheHit: boolean,
    bytesServed: number
  ): void;

  // Cache Management
  invalidateCache(
    pattern: string
  ): Promise<{
    success: boolean;
    invalidatedUrls: number;
  }>;

  preloadContent(
    urls: string[]
  ): Promise<{
    success: boolean;
    preloadedUrls: number;
    errors: string[];
  }>;

  // Health Check
  checkCDNHealth(): Promise<{
    status: 'healthy' | 'degraded' | 'down';
    responseTime: number;
    regions: Array<{
      region: string;
      status: 'healthy' | 'down';
      responseTime: number;
    }>;
  }>;
}