// services/AdaptiveVideoPlayerService.ts (Frontend)
import { userAxiosInstance } from "./instances/userInstance";
import EnhancedVideoSecurityService from "./videoSecurityService";

const api = userAxiosInstance;

interface QualityLevel {
  name: string;
  resolution: string;
  bitrate: string;
  bandwidth: number;
}

interface AdaptiveStreamingInfo {
  hasAdaptive: boolean;
  masterPlaylistUrl?: string;
  qualityLevels: QualityLevel[];
  recommendedStartQuality: string;
}

interface VideoAnalyticsEvent {
  type: 'play' | 'pause' | 'seek' | 'quality_change' | 'buffering' | 'complete';
  timestamp: number;
  data?: any;
}

class AdaptiveVideoPlayerService {
  private hlsPlayer: any = null;
  private currentVideoElement: HTMLVideoElement | null = null;
  private currentQuality: string = 'Auto';
  private availableQualities: string[] = [];
  private analyticsBuffer: VideoAnalyticsEvent[] = [];
  private viewStartTime: number = 0;

  constructor() {
    console.log('🎬 AdaptiveVideoPlayerService: Initialized');
  }

  /**
   * 🎯 PHASE 5: Load adaptive video with multiple quality support
   */
  public async loadAdaptiveVideo(
    videoElement: HTMLVideoElement,
    serviceId: string,
    videoKey: string,
    episodeId?: string
  ): Promise<{
    method: 'adaptive-hls' | 'hls' | 'progressive';
    info: any;
    qualityLevels: string[];
  }> {
    try {
      console.log('🎬 Loading adaptive video:', {
        serviceId,
        episodeId,
        videoKey: videoKey.substring(0, 20) + '...'
      });

      this.currentVideoElement = videoElement;
      this.viewStartTime = Date.now();

      // Check for adaptive streaming support
      const adaptiveInfo = await this.getAdaptiveStreamingInfo(serviceId, episodeId);

      if (adaptiveInfo.hasAdaptive && this.isHLSSupported()) {
        console.log('🎬 Using adaptive HLS streaming');
        await this.loadAdaptiveHLS(videoElement, serviceId, episodeId, adaptiveInfo);
        
        return {
          method: 'adaptive-hls',
          info: adaptiveInfo,
          qualityLevels: adaptiveInfo.qualityLevels.map(q => q.name)
        };
      } else {
        console.log('🎬 Falling back to standard HLS/Progressive');
        // Fallback to your existing HLS/Progressive logic
        const fallbackResult = await this.loadFallbackVideo(videoElement, serviceId, videoKey, episodeId);
        
        return {
          method: fallbackResult.method,
          info: fallbackResult.info,
          qualityLevels: this.getBasicQualityLevels()
        };
      }
    } catch (error: any) {
      console.error('🎬 Error loading adaptive video:', error);
      throw error;
    }
  }

  /**
   * Get adaptive streaming information
   */
  private async getAdaptiveStreamingInfo(
    serviceId: string,
    episodeId?: string
  ): Promise<AdaptiveStreamingInfo> {
    try {
      const sessionInfo = EnhancedVideoSecurityService.getSessionInfo(serviceId);
      if (!sessionInfo) {
        throw new Error('No active video session');
      }

      const url = `/seeker/adaptive-streaming-info/${serviceId}${episodeId ? `/${episodeId}` : ''}`;
      const response = await api.get(url, {
        params: { sessionToken: sessionInfo.sessionToken }
      });

      return response.data.data;
    } catch (error: any) {
      console.error('🎬 Error getting adaptive streaming info:', error);
      return {
        hasAdaptive: false,
        qualityLevels: [],
        recommendedStartQuality: '480p'
      };
    }
  }

  /**
   * Load adaptive HLS with multiple quality levels
   */
  private async loadAdaptiveHLS(
    videoElement: HTMLVideoElement,
    serviceId: string,
    episodeId: string | undefined,
    adaptiveInfo: AdaptiveStreamingInfo
  ): Promise<void> {
    if (!adaptiveInfo.masterPlaylistUrl) {
      throw new Error('No master playlist URL provided');
    }

    const sessionInfo = EnhancedVideoSecurityService.getSessionInfo(serviceId);
    if (!sessionInfo) {
      throw new Error('No active video session');
    }

    const fullPlaylistUrl = `${window.location.origin}${adaptiveInfo.masterPlaylistUrl}?sessionToken=${sessionInfo.sessionToken}`;

    // Check browser HLS support
    if (videoElement.canPlayType('application/vnd.apple.mpegurl') !== '') {
      console.log('🎬 Using native adaptive HLS support');
      videoElement.src = fullPlaylistUrl;
      this.setupNativeQualityControl(adaptiveInfo.qualityLevels);
    } else if ((window as any).Hls && (window as any).Hls.isSupported()) {
      console.log('🎬 Using HLS.js for adaptive streaming');
      await this.setupHLSjsAdaptive(videoElement, fullPlaylistUrl, adaptiveInfo);
    } else {
      throw new Error('Adaptive HLS not supported in this browser');
    }

    this.trackAnalytics('play', { quality: this.currentQuality });
  }

  /**
   * Setup HLS.js with adaptive streaming
   */
  private async setupHLSjsAdaptive(
    videoElement: HTMLVideoElement,
    playlistUrl: string,
    adaptiveInfo: AdaptiveStreamingInfo
  ): Promise<void> {
    // Destroy existing player
    if (this.hlsPlayer) {
      this.hlsPlayer.destroy();
    }

    // Create HLS.js instance with adaptive bitrate
    this.hlsPlayer = new (window as any).Hls({
      debug: process.env.NODE_ENV === 'development',
      enableWorker: true,
      lowLatencyMode: false,
      backBufferLength: 90,
      
      // 🎯 Adaptive bitrate configuration
      abrEwmaDefaultEstimate: 1000000, // Start with 1Mbps estimate
      abrEwmaSlowVoD: 0.95,
      abrEwmaFastVoD: 0.99,
      abrMaxWithRealBitrate: false,
      maxMaxBufferLength: 30,
      
      // 🎯 Quality switching
      startLevel: this.getStartLevelIndex(adaptiveInfo),
      capLevelToPlayerSize: true
    });

    // Load and attach
    this.hlsPlayer.loadSource(playlistUrl);
    this.hlsPlayer.attachMedia(videoElement);

    // Setup event listeners for adaptive features
    this.setupAdaptiveEventListeners(adaptiveInfo.qualityLevels);
  }

  /**
   * Setup event listeners for adaptive features
   */
  private setupAdaptiveEventListeners(qualityLevels: QualityLevel[]): void {
    if (!this.hlsPlayer) return;

    const Hls = (window as any).Hls;

    // Manifest loaded - extract available qualities
    this.hlsPlayer.on(Hls.Events.MANIFEST_PARSED, () => {
      this.availableQualities = this.hlsPlayer.levels.map((level: any, index: number) => 
        `${level.height}p (${Math.round(level.bitrate / 1000)}kbps)`
      );
      this.availableQualities.unshift('Auto'); // Add auto option
      
      console.log('🎬 Available qualities:', this.availableQualities);
    });

    // Level switched (quality changed)
    this.hlsPlayer.on(Hls.Events.LEVEL_SWITCHED, (event: any, data: any) => {
      const oldQuality = this.currentQuality;
      this.currentQuality = data.level >= 0 ? 
        `${this.hlsPlayer.levels[data.level].height}p` : 'Auto';
      
      if (oldQuality !== this.currentQuality) {
        console.log('🎬 Quality switched:', { from: oldQuality, to: this.currentQuality });
        this.trackAnalytics('quality_change', {
          from: oldQuality,
          to: this.currentQuality,
          reason: 'adaptive'
        });
      }
    });

    // Buffer empty (potential buffering)
    this.hlsPlayer.on(Hls.Events.BUFFER_EMPTY, () => {
      this.trackAnalytics('buffering', {
        quality: this.currentQuality,
        timestamp: Date.now()
      });
    });

    // Error handling
    this.hlsPlayer.on(Hls.Events.ERROR, (event: any, data: any) => {
      console.error('🎬 Adaptive HLS error:', data);
      
      if (data.fatal) {
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            this.hlsPlayer.startLoad();
            break;
          case Hls.ErrorTypes.MEDIA_ERROR:
            this.hlsPlayer.recoverMediaError();
            break;
          default:
            this.destroyPlayer();
            break;
        }
      }
    });
  }

  /**
   * 🎯 PHASE 5.2: Manual quality selection
   */
  public changeQuality(qualityName: string): void {
    if (!this.hlsPlayer) return;

    const oldQuality = this.currentQuality;

    if (qualityName === 'Auto') {
      this.hlsPlayer.currentLevel = -1; // Enable ABR
      this.currentQuality = 'Auto';
    } else {
      const levelIndex = this.hlsPlayer.levels.findIndex((level: any) => 
        `${level.height}p` === qualityName.split(' ')[0]
      );
      
      if (levelIndex >= 0) {
        this.hlsPlayer.currentLevel = levelIndex;
        this.currentQuality = qualityName;
      }
    }

    console.log('🎬 Manual quality change:', { from: oldQuality, to: this.currentQuality });
    this.trackAnalytics('quality_change', {
      from: oldQuality,
      to: this.currentQuality,
      reason: 'user'
    });
  }

  /**
   * 🎯 PHASE 5.3: Get available quality options
   */
  public getAvailableQualities(): string[] {
    return [...this.availableQualities];
  }

  /**
   * Get current quality
   */
  public getCurrentQuality(): string {
    return this.currentQuality;
  }

  /**
   * 🎯 PHASE 5.4: Track video analytics
   */
  private trackAnalytics(eventType: VideoAnalyticsEvent['type'], data?: any): void {
    const event: VideoAnalyticsEvent = {
      type: eventType,
      timestamp: Date.now(),
      data
    };

    this.analyticsBuffer.push(event);

    // Send analytics every 30 seconds or when buffer is full
    if (this.analyticsBuffer.length >= 10 || 
        (this.analyticsBuffer.length > 0 && Date.now() - this.viewStartTime > 30000)) {
      this.flushAnalytics();
    }
  }

  /**
   * Send analytics to backend
   */
  private async flushAnalytics(): Promise<void> {
    if (this.analyticsBuffer.length === 0) return;

    try {
      const analytics = [...this.analyticsBuffer];
      this.analyticsBuffer = [];

      await api.post('/seeker/video-analytics', {
        events: analytics,
        sessionInfo: this.getSessionInfo()
      });

      console.log('📊 Analytics sent:', analytics.length, 'events');
    } catch (error) {
      console.error('📊 Analytics error:', error);
    }
  }

  /**
   * Get start level for adaptive streaming
   */
  private getStartLevelIndex(adaptiveInfo: AdaptiveStreamingInfo): number {
    const recommended = adaptiveInfo.recommendedStartQuality;
    const levelIndex = adaptiveInfo.qualityLevels.findIndex(q => q.name === recommended);
    return Math.max(0, levelIndex);
  }

  /**
   * Setup quality control for native HLS
   */
  private setupNativeQualityControl(qualityLevels: QualityLevel[]): void {
    this.availableQualities = qualityLevels.map(q => q.name);
    this.currentQuality = 'Auto';
  }

  /**
   * Check HLS support
   */
  private isHLSSupported(): boolean {
    const video = document.createElement('video');
    const hasNativeHLS = video.canPlayType('application/vnd.apple.mpegurl') !== '';
    const hasHLSjs = typeof window !== 'undefined' && (window as any).Hls?.isSupported();
    
    return hasNativeHLS || hasHLSjs;
  }

  /**
   * Fallback to existing video loading
   */
  private async loadFallbackVideo(
    videoElement: HTMLVideoElement,
    serviceId: string,
    videoKey: string,
    episodeId?: string
  ): Promise<{ method: 'hls' | 'progressive'; info: any }> {
    // Import and use your existing HLSVideoPlayerService
    const HLSVideoPlayerService = (await import('./HLSVideoPlayerService')).default;
    return await HLSVideoPlayerService.loadVideo(videoElement, serviceId, videoKey, episodeId);
  }

  /**
   * Get basic quality levels for fallback
   */
  private getBasicQualityLevels(): string[] {
    return ['Auto', '480p', '720p', '1080p'];
  }

  /**
   * Get session info for analytics
   */
  private getSessionInfo(): any {
    return {
      currentQuality: this.currentQuality,
      totalWatchTime: Date.now() - this.viewStartTime,
      bufferingEvents: this.analyticsBuffer.filter(e => e.type === 'buffering').length
    };
  }

  /**
   * Destroy player and send final analytics
   */
  public destroyPlayer(): void {
    if (this.hlsPlayer) {
      this.hlsPlayer.destroy();
      this.hlsPlayer = null;
    }

    if (this.currentVideoElement) {
      this.currentVideoElement.removeAttribute('src');
      this.currentVideoElement.load();
      this.currentVideoElement = null;
    }

    // Send final analytics
    this.trackAnalytics('complete', this.getSessionInfo());
    this.flushAnalytics();

    console.log('🎬 AdaptiveVideoPlayerService: Player destroyed');
  }

  /**
   * Check if using adaptive streaming
   */
  public isUsingAdaptiveStreaming(): boolean {
    return !!this.hlsPlayer && this.availableQualities.length > 1;
  }
}

export default new AdaptiveVideoPlayerService();