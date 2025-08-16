import { userAxiosInstance } from "./instances/userInstance";
import EnhancedVideoSecurityService from "./videoSecurityService";

const api = userAxiosInstance;

interface VideoStreamingInfo {
  hasHLS: boolean;
  recommendedMethod: "hls" | "progressive";
  hlsPlaylistUrl?: string;
  legacyVideoUrl?: string;
  segmentCount?: number;
  security: "high" | "medium" | "low";
  downloadPrevention: "excellent" | "limited" | "poor";
  note?: string;
}

interface HLSProcessingStatus {
  isProcessed: boolean;
  playlistKey?: string;
  segmentCount?: number;
}

class HLSVideoPlayerService {
  private hlsPlayer: any = null;
  private currentVideoElement: HTMLVideoElement | null = null;
  private isHLSSupported: boolean = false;

  constructor() {
    // Check if HLS.js is available and HLS is supported
    this.checkHLSSupport();
  }

  /**
   * Check HLS support in browser
   */
  private checkHLSSupport(): void {
    // Check if browser natively supports HLS
    const video = document.createElement("video");
    const canPlayHLS =
      video.canPlayType("application/vnd.apple.mpegurl") !== "";

    // Check if HLS.js is available for browsers that don't support HLS natively
    const hasHLSjs = typeof window !== "undefined" && (window as any).Hls;

    this.isHLSSupported =
      canPlayHLS || (hasHLSjs && (window as any).Hls.isSupported());

    console.log("HLSVideoPlayerService: HLS support check", {
      nativeHLS: canPlayHLS,
      hlsJs: hasHLSjs,
      isSupported: this.isHLSSupported,
    });
  }

  /**
   * Get video streaming information
   */
  public async getVideoStreamingInfo(
    serviceId: string,
    episodeId?: string
  ): Promise<VideoStreamingInfo> {
    try {
      console.log("HLSVideoPlayerService: Getting streaming info", {
        serviceId,
        episodeId,
      });

      // Get session token
      const sessionInfo =
        EnhancedVideoSecurityService.getSessionInfo(serviceId);
      if (!sessionInfo) {
        throw new Error("No active video session. Please refresh the page.");
      }

      const url = `/seeker/video-streaming-info/${serviceId}${
        episodeId ? `/${episodeId}` : ""
      }`;
      const response = await api.get(url, {
        params: {
          sessionToken: sessionInfo.sessionToken,
        },
      });

      console.log(
        "HLSVideoPlayerService: Streaming info received",
        response.data.data
      );
      return response.data.data;
    } catch (error: any) {
      console.error(
        "HLSVideoPlayerService: Error getting streaming info",
        error
      );
      throw new Error(
        error.response?.data?.error || "Failed to get video streaming info"
      );
    }
  }

  /**
   * Check HLS processing status
   */
  public async checkHLSStatus(
    serviceId: string,
    episodeId?: string
  ): Promise<HLSProcessingStatus> {
    try {
      console.log("HLSVideoPlayerService: Checking HLS status", {
        serviceId,
        episodeId,
      });

      const url = `/seeker/hls-status/${serviceId}${
        episodeId ? `/${episodeId}` : ""
      }`;
      const response = await api.get(url);

      console.log(
        "HLSVideoPlayerService: HLS status received",
        response.data.data
      );
      return response.data.data;
    } catch (error: any) {
      console.error("HLSVideoPlayerService: Error checking HLS status", error);
      throw new Error(
        error.response?.data?.error || "Failed to check HLS status"
      );
    }
  }

  /**
   * Load HLS video into video element
   */
  public async loadHLSVideo(
    videoElement: HTMLVideoElement,
    serviceId: string,
    episodeId?: string
  ): Promise<string> {
    try {
      console.log("HLSVideoPlayerService: Loading HLS video", {
        serviceId,
        episodeId,
        isHLSSupported: this.isHLSSupported,
      });

      if (!this.isHLSSupported) {
        throw new Error("HLS is not supported in this browser");
      }

      // Get session token
      const sessionInfo =
        EnhancedVideoSecurityService.getSessionInfo(serviceId);
      if (!sessionInfo) {
        throw new Error("No active video session. Please refresh the page.");
      }

      // Construct HLS playlist URL
      const playlistUrl = `/seeker/hls-playlist/${serviceId}${
        episodeId ? `/${episodeId}` : ""
      }?sessionToken=${sessionInfo.sessionToken}`;
      const fullPlaylistUrl = `${window.location.origin}${playlistUrl}`;

      console.log("HLSVideoPlayerService: Loading playlist", {
        playlistUrl: fullPlaylistUrl.substring(0, 50) + "...",
      });

      this.currentVideoElement = videoElement;

      // Check if browser supports HLS natively (Safari)
      if (videoElement.canPlayType("application/vnd.apple.mpegurl") !== "") {
        console.log("HLSVideoPlayerService: Using native HLS support");
        videoElement.src = fullPlaylistUrl;
        return fullPlaylistUrl;
      }

      // Use HLS.js for other browsers
      if ((window as any).Hls && (window as any).Hls.isSupported()) {
        console.log("HLSVideoPlayerService: Using HLS.js");

        // Destroy existing player if any
        if (this.hlsPlayer) {
          this.hlsPlayer.destroy();
        }

        // Create new HLS.js instance
        this.hlsPlayer = new (window as any).Hls({
          debug: process.env.NODE_ENV === "development",
          enableWorker: true,
          lowLatencyMode: false,
          backBufferLength: 90,
        });

        // Load playlist
        this.hlsPlayer.loadSource(fullPlaylistUrl);
        this.hlsPlayer.attachMedia(videoElement);

        // Set up event listeners
        this.setupHLSEventListeners();

        console.log("HLSVideoPlayerService: HLS.js player initialized");

        // Return the HLS playlist URL
        return fullPlaylistUrl;
      } else {
        throw new Error("HLS is not supported in this browser");
      }
    } catch (error: any) {
      console.error("HLSVideoPlayerService: Error loading HLS video", error);
      throw error;
    }
  }

  /**
   * Setup HLS.js event listeners
   */
  private setupHLSEventListeners(): void {
    if (!this.hlsPlayer) return;

    const Hls = (window as any).Hls;

    // Manifest loaded
    this.hlsPlayer.on(Hls.Events.MANIFEST_PARSED, () => {
      console.log("HLSVideoPlayerService: HLS manifest parsed successfully");
    });

    // Fragment loaded
    this.hlsPlayer.on(Hls.Events.FRAG_LOADED, (event: any, data: any) => {
      console.log("HLSVideoPlayerService: HLS fragment loaded", {
        fragmentUrl: data.frag.url.substring(0, 50) + "...",
        duration: data.frag.duration,
      });
    });

    // Error handling
    this.hlsPlayer.on(Hls.Events.ERROR, (event: any, data: any) => {
      console.error("HLSVideoPlayerService: HLS error", {
        type: data.type,
        details: data.details,
        fatal: data.fatal,
      });

      if (data.fatal) {
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            console.log(
              "HLSVideoPlayerService: Fatal network error, trying to recover..."
            );
            this.hlsPlayer.startLoad();
            break;
          case Hls.ErrorTypes.MEDIA_ERROR:
            console.log(
              "HLSVideoPlayerService: Fatal media error, trying to recover..."
            );
            this.hlsPlayer.recoverMediaError();
            break;
          default:
            console.log(
              "HLSVideoPlayerService: Fatal error, destroying player"
            );
            this.destroyPlayer();
            break;
        }
      }
    });

    // Level loaded (quality level)
    this.hlsPlayer.on(Hls.Events.LEVEL_LOADED, (event: any, data: any) => {
      console.log("HLSVideoPlayerService: Quality level loaded", {
        level: data.level,
        details: data.details,
      });
    });
  }

  /**
   * Load fallback progressive video
   */
  public async loadProgressiveVideo(
    videoElement: HTMLVideoElement,
    serviceId: string,
    videoKey: string
  ): Promise<string> {
    try {
      console.log("HLSVideoPlayerService: Loading progressive video fallback", {
        serviceId,
        videoKey: videoKey.substring(0, 20) + "...",
      });

      // 🔒 SECURE PROXY: Use backend proxy instead of direct S3 URL
      const sessionInfo =
        EnhancedVideoSecurityService.getSessionInfo(serviceId);
      if (!sessionInfo) {
        throw new Error("No active video session");
      }

      // 🔒 SECURE BLOB APPROACH: Fetch video with credentials and create blob URL
      const encodedVideoKey = encodeURIComponent(videoKey);

      // Dynamic backend origin detection
      const backendOrigin = (() => {
        // Check if we're in development mode
        if (
          window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1"
        ) {
          return "http://localhost:5002"; // Development backend
        }
        // For production, use same origin with different path or environment variable
        return window.location.origin; // Production backend
      })();

      const proxyUrl = `${backendOrigin}/seeker/secure-video-proxy/${encodedVideoKey}?serviceId=${serviceId}&sessionToken=${sessionInfo.sessionToken}`;

      console.log("🔒 HLSVideoPlayerService: Using secure proxy URL", {
        proxyUrl: proxyUrl.substring(0, 80) + "...",
        sessionToken: sessionInfo.sessionToken.substring(0, 20) + "...",
      });

      // Set video properties for security
      videoElement.crossOrigin = "use-credentials";

      // 🔥 CRITICAL FIX: Don't set videoElement.src here since React will manage it
      // The React component will use this returned URL in its state
      this.currentVideoElement = videoElement;

      console.log("🔒 HLSVideoPlayerService: Progressive video URL prepared");

      // Return the secure proxy URL for React to use
      return proxyUrl;
    } catch (error: any) {
      console.error(
        "HLSVideoPlayerService: Error loading progressive video",
        error
      );
      throw error;
    }
  }

  /**
   * Automatically choose best video loading method
   */
  public async loadVideo(
    videoElement: HTMLVideoElement,
    serviceId: string,
    videoKey: string,
    episodeId?: string
  ): Promise<{ method: "hls" | "progressive"; info: any; videoUrl: string }> {
    try {
      console.log(
        "HLSVideoPlayerService: Auto-selecting video loading method",
        {
          serviceId,
          episodeId,
          isHLSSupported: this.isHLSSupported,
        }
      );

      // First, check if HLS version is available
      const streamingInfo = await this.getVideoStreamingInfo(
        serviceId,
        episodeId
      );

      if (streamingInfo.hasHLS && this.isHLSSupported) {
        console.log("HLSVideoPlayerService: Using HLS streaming");
        const hlsUrl = await this.loadHLSVideo(
          videoElement,
          serviceId,
          episodeId
        );
        return { method: "hls", info: streamingInfo, videoUrl: hlsUrl };
      } else {
        console.log("HLSVideoPlayerService: Using progressive streaming", {
          reason: !streamingInfo.hasHLS
            ? "HLS not available"
            : "HLS not supported",
        });
        const videoUrl = await this.loadProgressiveVideo(
          videoElement,
          serviceId,
          videoKey
        );
        return { method: "progressive", info: streamingInfo, videoUrl };
      }
    } catch (error: any) {
      console.error(
        "HLSVideoPlayerService: Error in auto video loading",
        error
      );
      throw error;
    }
  }

  /**
   * Get current playback stats
   */
  public getPlaybackStats(): {
    isHLS: boolean;
    currentTime: number;
    duration: number;
    buffered: number;
    quality?: string;
  } | null {
    if (!this.currentVideoElement) return null;

    const video = this.currentVideoElement;
    let buffered = 0;

    if (video.buffered.length > 0) {
      buffered = video.buffered.end(video.buffered.length - 1);
    }

    const stats = {
      isHLS: !!this.hlsPlayer,
      currentTime: video.currentTime,
      duration: video.duration,
      buffered,
    };

    // Add HLS-specific stats
    if (this.hlsPlayer) {
      (stats as any).quality =
        this.hlsPlayer.currentLevel >= 0
          ? `Level ${this.hlsPlayer.currentLevel}`
          : "Auto";
    }

    return stats;
  }

  /**
   * Destroy HLS player and cleanup
   */
  public destroyPlayer(): void {
    console.log("HLSVideoPlayerService: Destroying player");

    if (this.hlsPlayer) {
      this.hlsPlayer.destroy();
      this.hlsPlayer = null;
    }

    if (this.currentVideoElement) {
      // Don't clear src here since React manages it
      this.currentVideoElement = null;
    }

    console.log("HLSVideoPlayerService: Player destroyed");
  }

  /**
   * Check if current video is using HLS
   */
  public isUsingHLS(): boolean {
    return !!this.hlsPlayer;
  }

  /**
   * Get available quality levels (HLS only)
   */
  public getAvailableQualities(): string[] {
    if (!this.hlsPlayer) return [];

    return this.hlsPlayer.levels.map(
      (level: any, index: number) =>
        `${level.height}p (${Math.round(level.bitrate / 1000)}kbps)`
    );
  }

  /**
   * Change quality level (HLS only)
   */
  public changeQuality(levelIndex: number): void {
    if (
      this.hlsPlayer &&
      levelIndex >= -1 &&
      levelIndex < this.hlsPlayer.levels.length
    ) {
      this.hlsPlayer.currentLevel = levelIndex; // -1 for auto
      console.log(
        "HLSVideoPlayerService: Quality changed to",
        levelIndex === -1 ? "Auto" : `Level ${levelIndex}`
      );
    }
  }
}

export default new HLSVideoPlayerService();
