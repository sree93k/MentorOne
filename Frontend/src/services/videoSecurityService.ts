import { userAxiosInstance } from "./instances/userInstance";

const api = userAxiosInstance;

interface VideoSession {
  sessionToken: string;
  expiresAt: string;
  message: string;
  heartbeatInterval: number;
}

interface SecureVideoUrl {
  url: string;
  expiresAt: string;
  sessionToken: string;
}

interface HeartbeatResponse {
  sessionValid: boolean;
  timeUntilExpiry: number;
  requiresRefresh: boolean;
  newSessionToken?: string;
  message: string;
}

interface PlayerState {
  currentTime: number;
  duration: number;
  paused: boolean;
  ended: boolean;
}

class EnhancedVideoSecurityService {
  private sessionTokens: Map<string, VideoSession> = new Map();
  private heartbeatTimers: Map<string, NodeJS.Timeout> = new Map();
  private refreshTimers: Map<string, NodeJS.Timeout> = new Map();
  private playerStates: Map<string, PlayerState> = new Map();

  /**
   * Create a secure video session with heartbeat monitoring
   */
  public async createVideoSession(serviceId: string): Promise<VideoSession> {
    try {
      console.log(
        "EnhancedVideoSecurityService: Creating session for service",
        serviceId
      );

      const response = await api.post(`/seeker/video-session/${serviceId}`);
      const session: VideoSession = response.data.data;

      // Store session locally
      this.sessionTokens.set(serviceId, session);

      // Start heartbeat monitoring
      this.startHeartbeatMonitoring(serviceId, session);

      console.log("EnhancedVideoSecurityService: Session created", {
        serviceId,
        expiresAt: session.expiresAt,
        sessionToken: session.sessionToken.substring(0, 8) + "...",
        heartbeatInterval: session.heartbeatInterval,
      });

      return session;
    } catch (error: any) {
      console.error(
        "EnhancedVideoSecurityService: Error creating session",
        error
      );

      if (error.response?.status === 403) {
        throw new Error("You must purchase this content to access it");
      } else if (error.response?.status === 429) {
        throw new Error("Too many requests. Please wait before trying again.");
      }

      throw new Error(
        error.response?.data?.error || "Failed to create video session"
      );
    }
  }

  /**
   * Get secure video URL with session validation
   */
  public async getSecureVideoUrl(
    key: string,
    serviceId: string
  ): Promise<SecureVideoUrl> {
    try {
      // Get or create session
      let session = this.sessionTokens.get(serviceId);
      if (!session || this.isSessionNearExpiry(session)) {
        console.log(
          "EnhancedVideoSecurityService: Creating new session for URL request"
        );
        session = await this.createVideoSession(serviceId);
      }

      console.log("EnhancedVideoSecurityService: Getting secure URL", {
        key: key.substring(0, 20) + "...",
        serviceId,
        sessionToken: session.sessionToken.substring(0, 8) + "...",
      });

      const response = await api.get(
        `/seeker/secure-video-url/${encodeURIComponent(key)}`,
        {
          params: {
            sessionToken: session.sessionToken,
            serviceId: serviceId,
          },
        }
      );

      const secureUrl: SecureVideoUrl = response.data.data;

      console.log("EnhancedVideoSecurityService: Secure URL obtained", {
        urlObtained: true,
        expiresAt: secureUrl.expiresAt,
      });

      return secureUrl;
    } catch (error: any) {
      console.error(
        "EnhancedVideoSecurityService: Error getting secure URL",
        error
      );

      if (error.response?.status === 401) {
        console.log(
          "EnhancedVideoSecurityService: Session invalid, creating new session"
        );
        this.clearSession(serviceId);
        const newSession = await this.createVideoSession(serviceId);

        const response = await api.get(
          `/seeker/secure-video-url/${encodeURIComponent(key)}`,
          {
            params: {
              sessionToken: newSession.sessionToken,
              serviceId: serviceId,
            },
          }
        );

        return response.data.data;
      }

      throw new Error(
        error.response?.data?.error || "Failed to get secure video URL"
      );
    }
  }

  /**
   * Send heartbeat to server
   */
  public async sendHeartbeat(
    serviceId: string,
    playerState?: PlayerState
  ): Promise<HeartbeatResponse> {
    try {
      const session = this.sessionTokens.get(serviceId);
      if (!session) {
        throw new Error("No active session");
      }

      // Update local player state
      if (playerState) {
        this.playerStates.set(serviceId, playerState);
      }

      const response = await api.post("/seeker/video-heartbeat", {
        sessionToken: session.sessionToken,
        serviceId,
        playerCurrentTime: playerState?.currentTime,
        playerDuration: playerState?.duration,
        playerPaused: playerState?.paused,
        playerEnded: playerState?.ended,
      });

      const heartbeatResponse: HeartbeatResponse = response.data.data;

      // Handle session refresh if required
      if (
        heartbeatResponse.requiresRefresh &&
        heartbeatResponse.newSessionToken
      ) {
        const updatedSession: VideoSession = {
          ...session,
          sessionToken: heartbeatResponse.newSessionToken,
          expiresAt: new Date(
            Date.now() + heartbeatResponse.timeUntilExpiry
          ).toISOString(),
        };

        this.sessionTokens.set(serviceId, updatedSession);

        console.log("EnhancedVideoSecurityService: Session auto-refreshed", {
          serviceId,
          newToken: heartbeatResponse.newSessionToken.substring(0, 8) + "...",
        });
      }

      return heartbeatResponse;
    } catch (error: any) {
      console.error("EnhancedVideoSecurityService: Heartbeat error", error);

      if (error.response?.status === 401) {
        // Session invalid, stop heartbeat
        this.stopHeartbeatMonitoring(serviceId);
        throw new Error("Session expired");
      }

      throw new Error("Heartbeat failed");
    }
  }

  /**
   * Start heartbeat monitoring for a session
   */
  private startHeartbeatMonitoring(
    serviceId: string,
    session: VideoSession
  ): void {
    // Clear existing timer
    this.stopHeartbeatMonitoring(serviceId);

    const heartbeatInterval = session.heartbeatInterval || 60000; // Default 60 seconds

    const timer = setInterval(async () => {
      try {
        const playerState = this.playerStates.get(serviceId);
        const heartbeatResponse = await this.sendHeartbeat(
          serviceId,
          playerState
        );

        if (!heartbeatResponse.sessionValid) {
          console.log(
            "EnhancedVideoSecurityService: Session invalid during heartbeat"
          );
          this.stopHeartbeatMonitoring(serviceId);
          // Trigger session expired event
          this.triggerSessionExpiredEvent(serviceId);
        }
      } catch (error) {
        console.error("EnhancedVideoSecurityService: Heartbeat failed", error);
        this.stopHeartbeatMonitoring(serviceId);
        this.triggerSessionExpiredEvent(serviceId);
      }
    }, heartbeatInterval);

    this.heartbeatTimers.set(serviceId, timer);

    console.log("EnhancedVideoSecurityService: Heartbeat monitoring started", {
      serviceId,
      interval: heartbeatInterval / 1000 + " seconds",
    });
  }

  /**
   * Stop heartbeat monitoring for a session
   */
  private stopHeartbeatMonitoring(serviceId: string): void {
    const timer = this.heartbeatTimers.get(serviceId);
    if (timer) {
      clearInterval(timer);
      this.heartbeatTimers.delete(serviceId);
      console.log(
        "EnhancedVideoSecurityService: Heartbeat monitoring stopped",
        {
          serviceId,
        }
      );
    }
  }

  /**
   * Update player state for heartbeat
   */
  public updatePlayerState(serviceId: string, playerState: PlayerState): void {
    this.playerStates.set(serviceId, playerState);

    // If player is paused, mark session as inactive
    if (playerState.paused) {
      this.markSessionInactive(serviceId);
    } else {
      this.markSessionActive(serviceId);
    }
  }

  /**
   * Mark session as inactive (paused/hidden)
   */
  public async markSessionInactive(serviceId: string): Promise<void> {
    try {
      const session = this.sessionTokens.get(serviceId);
      if (!session) return;

      await api.post("/seeker/video-session-inactive", {
        sessionToken: session.sessionToken,
        serviceId,
      });

      console.log("EnhancedVideoSecurityService: Session marked inactive", {
        serviceId,
      });
    } catch (error) {
      console.error(
        "EnhancedVideoSecurityService: Error marking session inactive",
        error
      );
    }
  }

  /**
   * Mark session as active (resumed/visible)
   */
  public async markSessionActive(serviceId: string): Promise<void> {
    try {
      const session = this.sessionTokens.get(serviceId);
      if (!session) return;

      await api.post("/seeker/video-session-active", {
        sessionToken: session.sessionToken,
        serviceId,
      });

      console.log("EnhancedVideoSecurityService: Session marked active", {
        serviceId,
      });
    } catch (error) {
      console.error(
        "EnhancedVideoSecurityService: Error marking session active",
        error
      );
    }
  }

  /**
   * Manually extend video session
   */
  public async extendVideoSession(serviceId: string): Promise<boolean> {
    try {
      const session = this.sessionTokens.get(serviceId);
      if (!session) {
        console.log("EnhancedVideoSecurityService: No session to extend");
        return false;
      }

      console.log("EnhancedVideoSecurityService: Extending session", {
        serviceId,
        sessionToken: session.sessionToken.substring(0, 8) + "...",
      });

      const response = await api.post("/seeker/extend-video-session", {
        sessionToken: session.sessionToken,
      });

      const extended = response.data.data.sessionExtended;

      if (extended) {
        // Update local session expiration
        const newExpirationTime = new Date();
        newExpirationTime.setHours(newExpirationTime.getHours() + 2);
        session.expiresAt = newExpirationTime.toISOString();
      }

      console.log("EnhancedVideoSecurityService: Session extension result", {
        extended,
      });
      return extended;
    } catch (error: any) {
      console.error(
        "EnhancedVideoSecurityService: Error extending session",
        error
      );
      return false;
    }
  }

  /**
   * Revoke video session
   */
  public async revokeVideoSession(serviceId: string): Promise<void> {
    try {
      const session = this.sessionTokens.get(serviceId);
      if (!session) {
        console.log("EnhancedVideoSecurityService: No session to revoke");
        return;
      }

      console.log("EnhancedVideoSecurityService: Revoking session", {
        serviceId,
        sessionToken: session.sessionToken.substring(0, 8) + "...",
      });

      await api.post("/seeker/revoke-video-session", {
        sessionToken: session.sessionToken,
      });

      this.clearSession(serviceId);
      console.log("EnhancedVideoSecurityService: Session revoked successfully");
    } catch (error: any) {
      console.error(
        "EnhancedVideoSecurityService: Error revoking session",
        error
      );
      this.clearSession(serviceId);
    }
  }

  /**
   * Clear session and all timers
   */
  private clearSession(serviceId: string): void {
    // Clear session data
    this.sessionTokens.delete(serviceId);
    this.playerStates.delete(serviceId);

    // Clear heartbeat timer
    this.stopHeartbeatMonitoring(serviceId);

    // Clear refresh timer
    const refreshTimer = this.refreshTimers.get(serviceId);
    if (refreshTimer) {
      clearTimeout(refreshTimer);
      this.refreshTimers.delete(serviceId);
    }

    console.log("EnhancedVideoSecurityService: Session cleared locally", {
      serviceId,
    });
  }

  /**
   * Check if session is near expiry (within 10 minutes)
   */
  private isSessionNearExpiry(session: VideoSession): boolean {
    const expiryTime = new Date(session.expiresAt).getTime();
    const currentTime = Date.now();
    const timeUntilExpiry = expiryTime - currentTime;
    const tenMinutes = 10 * 60 * 1000; // 10 minutes in milliseconds

    return timeUntilExpiry <= tenMinutes;
  }

  /**
   * Trigger session expired event (for UI components to handle)
   */
  private triggerSessionExpiredEvent(serviceId: string): void {
    const event = new CustomEvent("videoSessionExpired", {
      detail: { serviceId },
    });
    window.dispatchEvent(event);

    console.log(
      "EnhancedVideoSecurityService: Session expired event triggered",
      {
        serviceId,
      }
    );
  }

  /**
   * Get current session info (for debugging)
   */
  public getSessionInfo(serviceId: string): VideoSession | null {
    return this.sessionTokens.get(serviceId) || null;
  }

  /**
   * Get player state
   */
  public getPlayerState(serviceId: string): PlayerState | null {
    return this.playerStates.get(serviceId) || null;
  }

  /**
   * Check if session exists and is valid
   */
  public hasValidSession(serviceId: string): boolean {
    const session = this.sessionTokens.get(serviceId);
    if (!session) return false;

    const expiryTime = new Date(session.expiresAt).getTime();
    return Date.now() < expiryTime;
  }

  /**
   * Get time until session expires (in milliseconds)
   */
  public getTimeUntilExpiry(serviceId: string): number {
    const session = this.sessionTokens.get(serviceId);
    if (!session) return 0;

    const expiryTime = new Date(session.expiresAt).getTime();
    const currentTime = Date.now();
    return Math.max(0, expiryTime - currentTime);
  }

  /**
   * Setup page visibility handling to pause/resume heartbeat
   */
  public setupPageVisibilityHandling(): void {
    document.addEventListener("visibilitychange", () => {
      const serviceIds = Array.from(this.sessionTokens.keys());

      if (document.hidden) {
        // Page hidden - mark all sessions as inactive
        serviceIds.forEach((serviceId) => {
          this.markSessionInactive(serviceId);
        });
      } else {
        // Page visible - mark all sessions as active
        serviceIds.forEach((serviceId) => {
          this.markSessionActive(serviceId);
        });
      }
    });

    console.log("EnhancedVideoSecurityService: Page visibility handling setup");
  }

  /**
   * Cleanup all sessions (call on app close/logout)
   */
  public async cleanup(): Promise<void> {
    console.log("EnhancedVideoSecurityService: Cleaning up all sessions");

    const serviceIds = Array.from(this.sessionTokens.keys());

    // Stop all heartbeat monitoring
    serviceIds.forEach((serviceId) => {
      this.stopHeartbeatMonitoring(serviceId);
    });

    // Revoke all sessions
    for (const serviceId of serviceIds) {
      try {
        await this.revokeVideoSession(serviceId);
      } catch (error) {
        console.warn("EnhancedVideoSecurityService: Error during cleanup", {
          serviceId,
          error,
        });
      }
    }

    // Clear all local data
    this.sessionTokens.clear();
    this.playerStates.clear();
    this.heartbeatTimers.forEach((timer) => clearInterval(timer));
    this.heartbeatTimers.clear();
    this.refreshTimers.forEach((timer) => clearTimeout(timer));
    this.refreshTimers.clear();

    console.log("EnhancedVideoSecurityService: Cleanup completed");
  }
}

export default new EnhancedVideoSecurityService();
