// Enhanced Security Features for Video Protection

// 1. Add to your main App.tsx or VideoTutorial.tsx
// Disable developer tools and right-click protection
const setupVideoSecurity = () => {
  // 🔒 Disable right-click context menu
  document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    return false;
  });

  // 🔒 Disable F12, Ctrl+Shift+I, Ctrl+U, Ctrl+S
  document.addEventListener("keydown", (e) => {
    // F12 - Developer Tools
    if (e.key === "F12") {
      e.preventDefault();
      return false;
    }

    // Ctrl+Shift+I - Developer Tools
    if (e.ctrlKey && e.shiftKey && e.key === "I") {
      e.preventDefault();
      return false;
    }

    // Ctrl+Shift+C - Element Inspector
    if (e.ctrlKey && e.shiftKey && e.key === "C") {
      e.preventDefault();
      return false;
    }

    // Ctrl+U - View Source
    if (e.ctrlKey && e.key === "u") {
      e.preventDefault();
      return false;
    }

    // Ctrl+S - Save Page
    if (e.ctrlKey && e.key === "s") {
      e.preventDefault();
      return false;
    }

    // Ctrl+Shift+J - Console
    if (e.ctrlKey && e.shiftKey && e.key === "J") {
      e.preventDefault();
      return false;
    }
  });

  // 🔒 Detect if developer tools are open
  let devtools = {
    open: false,
    orientation: null,
  };

  setInterval(() => {
    if (
      window.outerHeight - window.innerHeight > 200 ||
      window.outerWidth - window.innerWidth > 200
    ) {
      if (!devtools.open) {
        devtools.open = true;
        // console.clear();
        console.log(
          "%c🚫 Developer tools detected. Video access may be restricted.",
          "color: red; font-size: 20px; font-weight: bold;"
        );
      }
    } else {
      devtools.open = false;
    }
  }, 500);

  // 🔒 Disable text selection on video elements
  const style = document.createElement("style");
  style.textContent = `
    video {
      -webkit-user-select: none !important;
      -moz-user-select: none !important;
      -ms-user-select: none !important;
      user-select: none !important;
      -webkit-touch-callout: none !important;
      -webkit-tap-highlight-color: transparent !important;
      pointer-events: auto !important;
    }
    
    video::-webkit-media-controls-download-button {
      display: none !important;
    }
    
    video::-webkit-media-controls-enclosure {
      overflow: hidden;
    }
    
    /* Hide download option in controls */
    video::-webkit-media-controls-panel {
      background: transparent;
    }
  `;
  document.head.appendChild(style);

  // 🔒 Clear console periodically
  setInterval(() => {
    // console.clear();
  }, 1000);

  console.log(
    "%c🔒 Video Security Enabled",
    "color: green; font-weight: bold;"
  );
};

// 2. Network Request Monitoring Service
class NetworkSecurityService {
  private blockedRequests: Set<string> = new Set();

  constructor() {
    this.setupNetworkMonitoring();
  }

  private setupNetworkMonitoring(): void {
    // Override fetch to monitor video requests
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const url = args[0] as string;

      // Block direct video file downloads
      if (this.isVideoRequest(url) && !this.isAuthorizedRequest(url)) {
        console.warn("🚫 Unauthorized video request blocked:", url);
        throw new Error("Unauthorized video access");
      }

      return originalFetch.apply(window, args);
    };

    // Override XMLHttpRequest
    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (
      method: string,
      url: string,
      ...args: any[]
    ) {
      if (
        NetworkSecurityService.prototype.isVideoRequest(url) &&
        !NetworkSecurityService.prototype.isAuthorizedRequest(url)
      ) {
        console.warn("🚫 Unauthorized XHR video request blocked:", url);
        throw new Error("Unauthorized video access");
      }

      return originalXHROpen.call(this, method, url, ...args);
    };
  }

  private isVideoRequest(url: string): boolean {
    const videoExtensions = [
      ".mp4",
      ".webm",
      ".ogg",
      ".avi",
      ".mov",
      ".m3u8",
      ".ts",
    ];
    return videoExtensions.some((ext) => url.toLowerCase().includes(ext));
  }

  private isAuthorizedRequest(url: string): boolean {
    // Only allow requests through your secure proxy
    return (
      url.includes("/seeker/secure-video-proxy/") ||
      url.includes("/seeker/hls-playlist/") ||
      url.includes("sessionToken=")
    );
  }
}

// 3. Video Element Protection Service
class VideoElementProtection {
  private protectedElements: Set<HTMLVideoElement> = new Set();

  public protectVideoElement(videoElement: HTMLVideoElement): void {
    if (this.protectedElements.has(videoElement)) return;

    // 🔒 Add protection attributes
    videoElement.setAttribute(
      "controlsList",
      "nodownload nofullscreen noremoteplayback"
    );
    videoElement.setAttribute("disablePictureInPicture", "true");
    videoElement.setAttribute("oncontextmenu", "return false;");

    // 🔒 Override download attempts
    videoElement.addEventListener("canplay", () => {
      // Override any download attempts
      if ((videoElement as any).download) {
        delete (videoElement as any).download;
      }
    });

    // 🔒 Monitor for unauthorized access
    videoElement.addEventListener("loadstart", () => {
      console.log("🔒 Video loading with protection enabled");
    });

    // 🔒 Prevent screenshot/recording attempts
    videoElement.addEventListener("play", () => {
      document.title = "🔒 Secure Video Playing - Recording Prohibited";
    });

    videoElement.addEventListener("pause", () => {
      document.title = "MentorOne - Video Tutorial";
    });

    this.protectedElements.add(videoElement);
  }

  public removeProtection(videoElement: HTMLVideoElement): void {
    this.protectedElements.delete(videoElement);
  }
}

// 4. Session Integrity Monitor
class SessionIntegrityMonitor {
  private lastValidCheck: number = Date.now();
  private checkInterval: number = 30000; // 30 seconds

  constructor(private serviceId: string) {
    this.startMonitoring();
  }

  private startMonitoring(): void {
    setInterval(() => {
      this.performIntegrityCheck();
    }, this.checkInterval);
  }

  private async performIntegrityCheck(): Promise<void> {
    try {
      // Check if session is still valid
      const sessionInfo = EnhancedVideoSecurityService.getSessionInfo(
        this.serviceId
      );
      if (!sessionInfo) {
        this.handleSessionFailure("No session found");
        return;
      }

      // Check session expiry
      const expiryTime = new Date(sessionInfo.expiresAt).getTime();
      if (Date.now() >= expiryTime) {
        this.handleSessionFailure("Session expired");
        return;
      }

      // Verify with server
      await this.verifySessionWithServer(sessionInfo.sessionToken);

      this.lastValidCheck = Date.now();
      console.log("🔒 Session integrity check passed");
    } catch (error) {
      console.error("🚫 Session integrity check failed:", error);
      this.handleSessionFailure("Integrity check failed");
    }
  }

  private async verifySessionWithServer(sessionToken: string): Promise<void> {
    const response = await fetch("/seeker/verify-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ sessionToken, serviceId: this.serviceId }),
    });

    if (!response.ok) {
      throw new Error("Server verification failed");
    }
  }

  private handleSessionFailure(reason: string): void {
    console.error("🚫 Session integrity failure:", reason);

    // Trigger session expired event
    const event = new CustomEvent("sessionIntegrityFailure", {
      detail: { reason, serviceId: this.serviceId },
    });
    window.dispatchEvent(event);

    // Clear video sources
    document.querySelectorAll("video").forEach((video) => {
      video.src = "";
      video.load();
    });
  }

  public destroy(): void {
    // Cleanup when component unmounts
    console.log("🔒 Session integrity monitor destroyed");
  }
}

// 5. Screen Recording Detection
class ScreenRecordingDetection {
  private isRecordingDetected: boolean = false;

  constructor() {
    this.setupRecordingDetection();
  }

  private setupRecordingDetection(): void {
    // Detect screen recording APIs
    if (
      "mediaDevices" in navigator &&
      "getDisplayMedia" in navigator.mediaDevices
    ) {
      const originalGetDisplayMedia = navigator.mediaDevices.getDisplayMedia;

      navigator.mediaDevices.getDisplayMedia = async (constraints?: any) => {
        console.warn("🚫 Screen recording attempt detected!");
        this.handleRecordingAttempt();

        // Block the recording attempt
        throw new Error("Screen recording is not allowed for this content");
      };
    }

    // Monitor for common recording software
    this.detectRecordingSoftware();

    // Monitor page visibility changes (common during recording)
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        console.log("🔒 Page hidden - potential recording software detected");
        this.pauseVideoPlayback();
      }
    });
  }

  private detectRecordingSoftware(): void {
    // Check for common recording software in user agent or window properties
    const suspiciousPatterns = [
      "obs",
      "camtasia",
      "bandicam",
      "fraps",
      "screencast",
      "recordmydesktop",
      "simplescreenrecorder",
    ];

    const userAgent = navigator.userAgent.toLowerCase();
    const hasSuspiciousAgent = suspiciousPatterns.some((pattern) =>
      userAgent.includes(pattern)
    );

    if (hasSuspiciousAgent) {
      console.warn("🚫 Potential recording software detected in user agent");
      this.handleRecordingAttempt();
    }
  }

  private handleRecordingAttempt(): void {
    this.isRecordingDetected = true;

    // Pause all videos
    this.pauseVideoPlayback();

    // Show warning overlay
    this.showRecordingWarning();

    // Report to server
    this.reportRecordingAttempt();
  }

  private pauseVideoPlayback(): void {
    document.querySelectorAll("video").forEach((video) => {
      if (!video.paused) {
        video.pause();
      }
    });
  }

  private showRecordingWarning(): void {
    // Create warning overlay
    const overlay = document.createElement("div");
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      font-size: 24px;
      text-align: center;
    `;

    overlay.innerHTML = `
      <div>
        <h2>🚫 Recording Not Allowed</h2>
        <p>Screen recording is prohibited for this content.</p>
        <p>Please close any recording software to continue.</p>
      </div>
    `;

    document.body.appendChild(overlay);

    // Remove overlay after 5 seconds
    setTimeout(() => {
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    }, 5000);
  }

  private async reportRecordingAttempt(): Promise<void> {
    try {
      await fetch("/seeker/report-recording-attempt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href,
        }),
      });
    } catch (error) {
      console.error("Failed to report recording attempt:", error);
    }
  }
}

// 6. Watermark Overlay Service
class WatermarkService {
  private watermarkElement: HTMLElement | null = null;

  public addWatermark(
    videoContainer: HTMLElement,
    userInfo: { name: string; id: string }
  ): void {
    if (this.watermarkElement) {
      this.removeWatermark();
    }

    // Create watermark overlay
    this.watermarkElement = document.createElement("div");
    this.watermarkElement.style.cssText = `
      position: absolute;
      top: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 12px;
      font-family: monospace;
      pointer-events: none;
      z-index: 1000;
      user-select: none;
      -webkit-user-select: none;
    `;

    // Create dynamic watermark content
    const timestamp = new Date().toLocaleString();
    this.watermarkElement.innerHTML = `
      ${userInfo.name}<br>
      ID: ${userInfo.id.substring(0, 8)}...<br>
      ${timestamp}
    `;

    videoContainer.style.position = "relative";
    videoContainer.appendChild(this.watermarkElement);

    // Update timestamp every minute
    setInterval(() => {
      if (this.watermarkElement) {
        const newTimestamp = new Date().toLocaleString();
        this.watermarkElement.innerHTML = `
          ${userInfo.name}<br>
          ID: ${userInfo.id.substring(0, 8)}...<br>
          ${newTimestamp}
        `;
      }
    }, 60000);
  }

  public removeWatermark(): void {
    if (this.watermarkElement && this.watermarkElement.parentNode) {
      this.watermarkElement.parentNode.removeChild(this.watermarkElement);
      this.watermarkElement = null;
    }
  }
}

// 8. Main Security Manager
export class VideoSecurityManager {
  private networkSecurity: NetworkSecurityService;
  private videoProtection: VideoElementProtection;
  private sessionMonitor: SessionIntegrityMonitor | null = null;
  private recordingDetection: ScreenRecordingDetection;
  private watermarkService: WatermarkService;

  constructor() {
    this.networkSecurity = new NetworkSecurityService();
    this.videoProtection = new VideoElementProtection();
    this.recordingDetection = new ScreenRecordingDetection();
    this.watermarkService = new WatermarkService();

    // Setup global security
    setupVideoSecurity();
  }

  public protectVideo(
    videoElement: HTMLVideoElement,
    serviceId: string,
    userInfo: { name: string; id: string }
  ): void {
    console.log("🔒 Applying comprehensive video protection");

    // Apply video element protection
    this.videoProtection.protectVideoElement(videoElement);

    // Start session monitoring
    if (this.sessionMonitor) {
      this.sessionMonitor.destroy();
    }
    this.sessionMonitor = new SessionIntegrityMonitor(serviceId);

    // Add watermark
    const videoContainer = videoElement.parentElement;
    if (videoContainer) {
      this.watermarkService.addWatermark(videoContainer, userInfo);
    }

    console.log("✅ Video protection applied successfully");
  }

  public cleanup(): void {
    if (this.sessionMonitor) {
      this.sessionMonitor.destroy();
      this.sessionMonitor = null;
    }

    this.watermarkService.removeWatermark();

    console.log("🔒 Video security cleanup completed");
  }
}

// 7. Export all security services
export {
  setupVideoSecurity,
  NetworkSecurityService,
  VideoElementProtection,
  SessionIntegrityMonitor,
  ScreenRecordingDetection,
  WatermarkService,
};
