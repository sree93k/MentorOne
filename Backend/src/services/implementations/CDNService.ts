// services/implementations/CDNService.ts
import { EnhancedVideoSessionService } from "./EnhancedVideoSessionService";

interface CDNConfig {
  enabled: boolean;
  workerUrl: string;
  fallbackToOrigin: boolean;
  cacheHeaders: {
    segments: string;
    playlists: string;
  };
}

interface CDNPerformanceMetrics {
  cacheHitRate: number;
  averageResponseTime: number;
  bandwidthSaved: number;
  globalRequests: number;
}

class CDNService {
  private config: CDNConfig;
  private metrics: CDNPerformanceMetrics;

  constructor() {
    this.config = {
      enabled: process.env.CDN_ENABLED === 'true',
      workerUrl: process.env.CDN_WORKER_URL || '',
      fallbackToOrigin: true,
      cacheHeaders: {
        segments: 'public, max-age=3600, s-maxage=3600', // 1 hour for segments
        playlists: 'public, max-age=60, s-maxage=60'     // 1 minute for playlists
      }
    };

    this.metrics = {
      cacheHitRate: 0,
      averageResponseTime: 0,
      bandwidthSaved: 0,
      globalRequests: 0
    };

    console.log('🌍 CDNService: Initialized', {
      enabled: this.config.enabled,
      workerUrl: this.config.workerUrl ? 'configured' : 'not set'
    });
  }

  /**
   * Get CDN URL for HLS playlist
   */
  public getHLSPlaylistURL(serviceId: string, episodeId?: string, sessionToken?: string): string {
    if (!this.config.enabled || !this.config.workerUrl) {
      return this.getOriginPlaylistURL(serviceId, episodeId, sessionToken);
    }

    const path = `/cdn/hls-playlist/${serviceId}${episodeId ? `/${episodeId}` : ''}`;
    const params = sessionToken ? `?sessionToken=${sessionToken}` : '';
    
    return `${this.config.workerUrl}${path}${params}`;
  }

  /**
   * Get CDN URL for HLS segment
   */
  public getHLSSegmentURL(segmentKey: string, sessionToken?: string): string {
    if (!this.config.enabled || !this.config.workerUrl) {
      return this.getOriginSegmentURL(segmentKey, sessionToken);
    }

    const path = `/cdn/hls-segment/${segmentKey}`;
    const params = sessionToken ? `?sessionToken=${sessionToken}` : '';
    
    return `${this.config.workerUrl}${path}${params}`;
  }

  /**
   * Get CDN URL for video info
   */
  public getVideoInfoURL(serviceId: string, episodeId?: string): string {
    if (!this.config.enabled || !this.config.workerUrl) {
      return this.getOriginVideoInfoURL(serviceId, episodeId);
    }

    const path = `/cdn/video-info/${serviceId}${episodeId ? `/${episodeId}` : ''}`;
    
    return `${this.config.workerUrl}${path}`;
  }

  /**
   * Fallback to origin server URLs
   */
  private getOriginPlaylistURL(serviceId: string, episodeId?: string, sessionToken?: string): string {
    const baseUrl = process.env.BACKEND_URL || 'http://localhost:5002';
    const path = `/seeker/hls-playlist/${serviceId}${episodeId ? `/${episodeId}` : ''}`;
    const params = sessionToken ? `?sessionToken=${sessionToken}` : '';
    
    return `${baseUrl}${path}${params}`;
  }

  private getOriginSegmentURL(segmentKey: string, sessionToken?: string): string {
    const baseUrl = process.env.BACKEND_URL || 'http://localhost:5002';
    const path = `/seeker/hls-segment/${segmentKey}`;
    const params = sessionToken ? `?sessionToken=${sessionToken}` : '';
    
    return `${baseUrl}${path}${params}`;
  }

  private getOriginVideoInfoURL(serviceId: string, episodeId?: string): string {
    const baseUrl = process.env.BACKEND_URL || 'http://localhost:5002';
    const path = `/seeker/video-streaming-info/${serviceId}${episodeId ? `/${episodeId}` : ''}`;
    
    return `${baseUrl}${path}`;
  }

  /**
   * Check CDN health and performance
   */
  public async checkCDNHealth(): Promise<{
    status: 'healthy' | 'degraded' | 'down';
    responseTime: number;
    cacheStatus: string;
  }> {
    if (!this.config.enabled || !this.config.workerUrl) {
      return {
        status: 'down',
        responseTime: 0,
        cacheStatus: 'disabled'
      };
    }

    try {
      const startTime = Date.now();
      const response = await fetch(`${this.config.workerUrl}/health`);
      const responseTime = Date.now() - startTime;

      const status = response.ok ? 'healthy' : 'degraded';
      const cacheStatus = response.headers.get('CDN-Cache-Status') || 'unknown';

      return {
        status,
        responseTime,
        cacheStatus
      };
    } catch (error) {
      console.error('🌍 CDNService: Health check failed', error);
      return {
        status: 'down',
        responseTime: 0,
        cacheStatus: 'error'
      };
    }
  }

  /**
   * Get CDN performance metrics
   */
  public getCDNMetrics(): CDNPerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Update CDN performance metrics
   */
  public updateMetrics(metrics: Partial<CDNPerformanceMetrics>): void {
    this.metrics = { ...this.metrics, ...metrics };
  }

  /**
   * Generate CDN-aware HLS playlist content
   */
  public generateCDNPlaylistContent(
    segments: Array<{ key: string; duration: number }>,
    sessionToken: string
  ): string {
    const playlistHeader = `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-TARGETDURATION:${this.getMaxSegmentDuration(segments)}
#EXT-X-MEDIA-SEQUENCE:0
#EXT-X-PLAYLIST-TYPE:VOD`;

    const segmentLines = segments.map(segment => {
      const segmentUrl = this.getHLSSegmentURL(segment.key, sessionToken);
      return `#EXTINF:${segment.duration.toFixed(6)},\n${segmentUrl}`;
    }).join('\n');

    const playlistFooter = '#EXT-X-ENDLIST';

    return `${playlistHeader}\n${segmentLines}\n${playlistFooter}`;
  }

  /**
   * Get maximum segment duration for HLS playlist
   */
  private getMaxSegmentDuration(segments: Array<{ duration: number }>): number {
    return Math.ceil(Math.max(...segments.map(s => s.duration), 10));
  }

  /**
   * Enable/disable CDN
   */
  public setCDNEnabled(enabled: boolean): void {
    this.config.enabled = enabled;
    console.log(`🌍 CDNService: CDN ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Update CDN worker URL
   */
  public setCDNWorkerUrl(url: string): void {
    this.config.workerUrl = url;
    console.log('🌍 CDNService: Worker URL updated');
  }

  /**
   * Check if CDN is enabled and configured
   */
  public isEnabled(): boolean {
    return this.config.enabled && !!this.config.workerUrl;
  }

  /**
   * Get CDN configuration
   */
  public getConfig(): CDNConfig {
    return { ...this.config };
  }
}

export default new CDNService();