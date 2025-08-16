// import crypto from "crypto";

// interface VideoSession {
//   userId: string;
//   serviceId: string;
//   sessionToken: string;
//   expiresAt: Date;
//   createdAt: Date;
//   lastAccessed: Date;
//   accessCount: number;
// }

// interface SessionStore {
//   [sessionToken: string]: VideoSession;
// }

// class VideoSessionService {
//   private sessions: SessionStore = {};
//   private readonly SESSION_DURATION = 2 * 60 * 60 * 1000; // 2 hours
//   private readonly MAX_ACCESS_COUNT = 50; // Maximum accesses per session
//   private readonly CLEANUP_INTERVAL = 15 * 60 * 1000; // Cleanup every 15 minutes

//   constructor() {
//     // Start cleanup process
//     this.startCleanupProcess();
//   }

//   /**
//    * Create a new video session for a user
//    */
//   public createSession(
//     userId: string,
//     serviceId: string
//   ): {
//     sessionToken: string;
//     expiresAt: Date;
//   } {
//     const sessionToken = this.generateSessionToken();
//     const now = new Date();
//     const expiresAt = new Date(now.getTime() + this.SESSION_DURATION);

//     const session: VideoSession = {
//       userId,
//       serviceId,
//       sessionToken,
//       expiresAt,
//       createdAt: now,
//       lastAccessed: now,
//       accessCount: 0,
//     };

//     this.sessions[sessionToken] = session;

//     console.log("VideoSessionService: Created session", {
//       userId,
//       serviceId,
//       sessionToken: sessionToken.substring(0, 8) + "...",
//       expiresAt,
//     });

//     return { sessionToken, expiresAt };
//   }

//   /**
//    * Validate and update session
//    */
//   public validateSession(
//     sessionToken: string,
//     userId: string,
//     serviceId: string
//   ): boolean {
//     const session = this.sessions[sessionToken];

//     if (!session) {
//       console.log("VideoSessionService: Session not found", {
//         sessionToken: sessionToken.substring(0, 8) + "...",
//       });
//       return false;
//     }

//     // Check if session expired
//     if (new Date() > session.expiresAt) {
//       console.log("VideoSessionService: Session expired", {
//         sessionToken: sessionToken.substring(0, 8) + "...",
//       });
//       delete this.sessions[sessionToken];
//       return false;
//     }

//     // Check if session belongs to the correct user and service
//     if (session.userId !== userId || session.serviceId !== serviceId) {
//       console.log("VideoSessionService: Session user/service mismatch", {
//         sessionToken: sessionToken.substring(0, 8) + "...",
//         sessionUserId: session.userId,
//         requestUserId: userId,
//         sessionServiceId: session.serviceId,
//         requestServiceId: serviceId,
//       });
//       return false;
//     }

//     // Check access count limit
//     if (session.accessCount >= this.MAX_ACCESS_COUNT) {
//       console.log("VideoSessionService: Session access limit exceeded", {
//         sessionToken: sessionToken.substring(0, 8) + "...",
//         accessCount: session.accessCount,
//       });
//       return false;
//     }

//     // Update session activity
//     session.lastAccessed = new Date();
//     session.accessCount += 1;

//     console.log("VideoSessionService: Session validated", {
//       sessionToken: sessionToken.substring(0, 8) + "...",
//       accessCount: session.accessCount,
//       userId,
//       serviceId,
//     });

//     return true;
//   }

//   /**
//    * Extend session expiration
//    */
//   public extendSession(sessionToken: string): boolean {
//     const session = this.sessions[sessionToken];

//     if (!session) {
//       return false;
//     }

//     // Only extend if session is still valid
//     if (new Date() <= session.expiresAt) {
//       session.expiresAt = new Date(Date.now() + this.SESSION_DURATION);
//       console.log("VideoSessionService: Session extended", {
//         sessionToken: sessionToken.substring(0, 8) + "...",
//         newExpiresAt: session.expiresAt,
//       });
//       return true;
//     }

//     return false;
//   }

//   /**
//    * Revoke a specific session
//    */
//   public revokeSession(sessionToken: string): boolean {
//     if (this.sessions[sessionToken]) {
//       delete this.sessions[sessionToken];
//       console.log("VideoSessionService: Session revoked", {
//         sessionToken: sessionToken.substring(0, 8) + "...",
//       });
//       return true;
//     }
//     return false;
//   }

//   /**
//    * Revoke all sessions for a user and service
//    */
//   public revokeAllUserSessions(userId: string, serviceId?: string): number {
//     let revokedCount = 0;

//     for (const [token, session] of Object.entries(this.sessions)) {
//       if (
//         session.userId === userId &&
//         (!serviceId || session.serviceId === serviceId)
//       ) {
//         delete this.sessions[token];
//         revokedCount++;
//       }
//     }

//     console.log("VideoSessionService: Revoked user sessions", {
//       userId,
//       serviceId,
//       revokedCount,
//     });

//     return revokedCount;
//   }

//   /**
//    * Get session info (for debugging/monitoring)
//    */
//   public getSessionInfo(sessionToken: string): Partial<VideoSession> | null {
//     const session = this.sessions[sessionToken];

//     if (!session) {
//       return null;
//     }

//     return {
//       userId: session.userId,
//       serviceId: session.serviceId,
//       expiresAt: session.expiresAt,
//       createdAt: session.createdAt,
//       lastAccessed: session.lastAccessed,
//       accessCount: session.accessCount,
//     };
//   }

//   /**
//    * Get active sessions count
//    */
//   public getActiveSessionsCount(): number {
//     return Object.keys(this.sessions).length;
//   }

//   /**
//    * Generate cryptographically secure session token
//    */
//   private generateSessionToken(): string {
//     return crypto.randomBytes(32).toString("hex");
//   }

//   /**
//    * Cleanup expired sessions
//    */
//   private cleanupExpiredSessions(): void {
//     const now = new Date();
//     let cleanedCount = 0;

//     for (const [token, session] of Object.entries(this.sessions)) {
//       if (now > session.expiresAt) {
//         delete this.sessions[token];
//         cleanedCount++;
//       }
//     }

//     if (cleanedCount > 0) {
//       console.log("VideoSessionService: Cleaned up expired sessions", {
//         cleanedCount,
//         remainingSessions: Object.keys(this.sessions).length,
//       });
//     }
//   }

//   /**
//    * Start periodic cleanup process
//    */
//   private startCleanupProcess(): void {
//     setInterval(() => {
//       this.cleanupExpiredSessions();
//     }, this.CLEANUP_INTERVAL);

//     console.log("VideoSessionService: Cleanup process started", {
//       cleanupInterval: this.CLEANUP_INTERVAL / 1000 / 60 + " minutes",
//     });
//   }
// }

// export default new VideoSessionService();
// services/implementations/EnhancedVideoSessionService.ts
import crypto from "crypto";

interface VideoSession {
  userId: string;
  serviceId: string;
  sessionToken: string;
  expiresAt: Date;
  createdAt: Date;
  lastAccessed: Date;
  lastHeartbeat: Date;
  accessCount: number;
  isActive: boolean;
  refreshCount: number;
  maxRefreshes: number;
}

interface SessionStore {
  [sessionToken: string]: VideoSession;
}

interface HeartbeatResponse {
  sessionValid: boolean;
  timeUntilExpiry: number;
  requiresRefresh: boolean;
  newSessionToken?: string;
  message: string;
}

class EnhancedVideoSessionService {
  private sessions: SessionStore = {};
  private readonly SESSION_DURATION = 2 * 60 * 60 * 1000; // 2 hours
  private readonly MAX_ACCESS_COUNT = 100; // Increased for better UX
  private readonly MAX_REFRESHES = 5; // Allow 5 refreshes per session
  private readonly HEARTBEAT_INTERVAL = 60 * 1000; // 60 seconds
  private readonly REFRESH_THRESHOLD = 30 * 60 * 1000; // Refresh when 30 minutes left
  private readonly CLEANUP_INTERVAL = 15 * 60 * 1000; // Cleanup every 15 minutes
  private readonly INACTIVE_THRESHOLD = 5 * 60 * 1000; // Mark inactive after 5 minutes

  constructor() {
    this.startCleanupProcess();
    this.startInactivityMonitoring();
  }

  /**
   * Create a new video session with enhanced tracking
   */
  public createSession(
    userId: string,
    serviceId: string
  ): {
    sessionToken: string;
    expiresAt: Date;
    heartbeatInterval: number;
  } {
    const sessionToken = this.generateSessionToken();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.SESSION_DURATION);

    const session: VideoSession = {
      userId,
      serviceId,
      sessionToken,
      expiresAt,
      createdAt: now,
      lastAccessed: now,
      lastHeartbeat: now,
      accessCount: 0,
      isActive: true,
      refreshCount: 0,
      maxRefreshes: this.MAX_REFRESHES,
    };

    this.sessions[sessionToken] = session;

    console.log("EnhancedVideoSessionService: Created session", {
      userId,
      serviceId,
      sessionToken: sessionToken.substring(0, 8) + "...",
      expiresAt,
      heartbeatInterval: this.HEARTBEAT_INTERVAL,
    });

    return {
      sessionToken,
      expiresAt,
      heartbeatInterval: this.HEARTBEAT_INTERVAL,
    };
  }

  /**
   * Process heartbeat and manage session lifecycle
   */
  public processHeartbeat(
    sessionToken: string,
    userId: string,
    serviceId: string,
    playerCurrentTime?: number,
    playerDuration?: number
  ): HeartbeatResponse {
    const session = this.sessions[sessionToken];

    if (!session) {
      console.log(
        "EnhancedVideoSessionService: Heartbeat - Session not found",
        {
          sessionToken: sessionToken.substring(0, 8) + "...",
        }
      );
      return {
        sessionValid: false,
        timeUntilExpiry: 0,
        requiresRefresh: false,
        message: "Session not found. Please refresh the page.",
      };
    }

    // Check if session expired
    const now = new Date();
    if (now > session.expiresAt) {
      console.log("EnhancedVideoSessionService: Heartbeat - Session expired", {
        sessionToken: sessionToken.substring(0, 8) + "...",
      });
      delete this.sessions[sessionToken];
      return {
        sessionValid: false,
        timeUntilExpiry: 0,
        requiresRefresh: false,
        message: "Session expired. Please refresh the page.",
      };
    }

    // Validate session ownership
    if (session.userId !== userId || session.serviceId !== serviceId) {
      console.log("EnhancedVideoSessionService: Heartbeat - Session mismatch", {
        sessionToken: sessionToken.substring(0, 8) + "...",
      });
      return {
        sessionValid: false,
        timeUntilExpiry: 0,
        requiresRefresh: false,
        message: "Invalid session. Please refresh the page.",
      };
    }

    // Update heartbeat
    session.lastHeartbeat = now;
    session.lastAccessed = now;
    session.isActive = true;

    const timeUntilExpiry = session.expiresAt.getTime() - now.getTime();

    // Check if refresh is needed
    if (
      timeUntilExpiry <= this.REFRESH_THRESHOLD &&
      session.refreshCount < session.maxRefreshes
    ) {
      const newSession = this.refreshSession(sessionToken);
      if (newSession) {
        console.log(
          "EnhancedVideoSessionService: Auto-refreshed session during heartbeat",
          {
            oldToken: sessionToken.substring(0, 8) + "...",
            newToken: newSession.sessionToken.substring(0, 8) + "...",
          }
        );
        return {
          sessionValid: true,
          timeUntilExpiry: newSession.expiresAt.getTime() - now.getTime(),
          requiresRefresh: true,
          newSessionToken: newSession.sessionToken,
          message: "Session refreshed successfully",
        };
      }
    }

    console.log("EnhancedVideoSessionService: Heartbeat processed", {
      sessionToken: sessionToken.substring(0, 8) + "...",
      timeUntilExpiry: Math.round(timeUntilExpiry / 1000 / 60) + " minutes",
      playerTime: playerCurrentTime
        ? Math.round(playerCurrentTime) + "s"
        : "unknown",
    });

    return {
      sessionValid: true,
      timeUntilExpiry,
      requiresRefresh: false,
      message: "Session active",
    };
  }

  /**
   * Validate session with enhanced checks
   */
  public validateSession(
    sessionToken: string,
    userId: string,
    serviceId: string
  ): boolean {
    const session = this.sessions[sessionToken];

    if (!session) {
      console.log(
        "EnhancedVideoSessionService: Validation - Session not found",
        {
          sessionToken: sessionToken.substring(0, 8) + "...",
        }
      );
      return false;
    }

    // Check if session expired
    if (new Date() > session.expiresAt) {
      console.log("EnhancedVideoSessionService: Validation - Session expired", {
        sessionToken: sessionToken.substring(0, 8) + "...",
      });
      delete this.sessions[sessionToken];
      return false;
    }

    // Check session ownership
    if (session.userId !== userId || session.serviceId !== serviceId) {
      console.log(
        "EnhancedVideoSessionService: Validation - Session mismatch",
        {
          sessionToken: sessionToken.substring(0, 8) + "...",
        }
      );
      return false;
    }

    // Check access count limit
    if (session.accessCount >= this.MAX_ACCESS_COUNT) {
      console.log(
        "EnhancedVideoSessionService: Validation - Access limit exceeded",
        {
          sessionToken: sessionToken.substring(0, 8) + "...",
          accessCount: session.accessCount,
        }
      );
      return false;
    }

    // Update session activity
    session.lastAccessed = new Date();
    session.accessCount += 1;

    console.log("EnhancedVideoSessionService: Session validated", {
      sessionToken: sessionToken.substring(0, 8) + "...",
      accessCount: session.accessCount,
      userId,
      serviceId,
    });

    return true;
  }

  /**
   * Refresh session with new token
   */
  public refreshSession(sessionToken: string): {
    sessionToken: string;
    expiresAt: Date;
  } | null {
    const session = this.sessions[sessionToken];

    if (!session) {
      return null;
    }

    // Check if refresh limit reached
    if (session.refreshCount >= session.maxRefreshes) {
      console.log("EnhancedVideoSessionService: Refresh limit reached", {
        sessionToken: sessionToken.substring(0, 8) + "...",
        refreshCount: session.refreshCount,
      });
      return null;
    }

    // Only refresh if session is still valid
    if (new Date() <= session.expiresAt) {
      const newToken = this.generateSessionToken();
      const newExpiresAt = new Date(Date.now() + this.SESSION_DURATION);

      // Create new session
      const newSession: VideoSession = {
        ...session,
        sessionToken: newToken,
        expiresAt: newExpiresAt,
        lastAccessed: new Date(),
        lastHeartbeat: new Date(),
        refreshCount: session.refreshCount + 1,
        accessCount: 0, // Reset access count for new session
      };

      // Replace old session with new one
      delete this.sessions[sessionToken];
      this.sessions[newToken] = newSession;

      console.log("EnhancedVideoSessionService: Session refreshed", {
        oldToken: sessionToken.substring(0, 8) + "...",
        newToken: newToken.substring(0, 8) + "...",
        newExpiresAt,
        refreshCount: newSession.refreshCount,
      });

      return { sessionToken: newToken, expiresAt: newExpiresAt };
    }

    return null;
  }

  /**
   * Extend session manually (for explicit user action)
   */
  public extendSession(sessionToken: string): boolean {
    const session = this.sessions[sessionToken];

    if (!session) {
      return false;
    }

    // Check if extension is allowed
    if (session.refreshCount >= session.maxRefreshes) {
      return false;
    }

    // Only extend if session is still valid
    if (new Date() <= session.expiresAt) {
      session.expiresAt = new Date(Date.now() + this.SESSION_DURATION);
      session.refreshCount += 1;

      console.log("EnhancedVideoSessionService: Session extended", {
        sessionToken: sessionToken.substring(0, 8) + "...",
        newExpiresAt: session.expiresAt,
        refreshCount: session.refreshCount,
      });
      return true;
    }

    return false;
  }

  /**
   * Mark session as inactive (user paused or left)
   */
  public markSessionInactive(sessionToken: string): void {
    const session = this.sessions[sessionToken];
    if (session) {
      session.isActive = false;
      console.log("EnhancedVideoSessionService: Session marked inactive", {
        sessionToken: sessionToken.substring(0, 8) + "...",
      });
    }
  }

  /**
   * Mark session as active (user resumed)
   */
  public markSessionActive(sessionToken: string): void {
    const session = this.sessions[sessionToken];
    if (session) {
      session.isActive = true;
      session.lastHeartbeat = new Date();
      console.log("EnhancedVideoSessionService: Session marked active", {
        sessionToken: sessionToken.substring(0, 8) + "...",
      });
    }
  }

  /**
   * Revoke a specific session
   */
  public revokeSession(sessionToken: string): boolean {
    if (this.sessions[sessionToken]) {
      delete this.sessions[sessionToken];
      console.log("EnhancedVideoSessionService: Session revoked", {
        sessionToken: sessionToken.substring(0, 8) + "...",
      });
      return true;
    }
    return false;
  }

  /**
   * Revoke all sessions for a user and service
   */
  public revokeAllUserSessions(userId: string, serviceId?: string): number {
    let revokedCount = 0;

    for (const [token, session] of Object.entries(this.sessions)) {
      if (
        session.userId === userId &&
        (!serviceId || session.serviceId === serviceId)
      ) {
        delete this.sessions[token];
        revokedCount++;
      }
    }

    console.log("EnhancedVideoSessionService: Revoked user sessions", {
      userId,
      serviceId,
      revokedCount,
    });

    return revokedCount;
  }

  /**
   * Get session info (for debugging/monitoring)
   */
  public getSessionInfo(sessionToken: string): Partial<VideoSession> | null {
    const session = this.sessions[sessionToken];

    if (!session) {
      return null;
    }

    return {
      userId: session.userId,
      serviceId: session.serviceId,
      expiresAt: session.expiresAt,
      createdAt: session.createdAt,
      lastAccessed: session.lastAccessed,
      lastHeartbeat: session.lastHeartbeat,
      accessCount: session.accessCount,
      isActive: session.isActive,
      refreshCount: session.refreshCount,
      maxRefreshes: session.maxRefreshes,
    };
  }

  /**
   * Get all active sessions (for monitoring)
   */
  public getActiveSessionsCount(): {
    total: number;
    active: number;
    inactive: number;
  } {
    const now = new Date();
    let active = 0;
    let inactive = 0;
    const total = Object.keys(this.sessions).length;

    for (const session of Object.values(this.sessions)) {
      const timeSinceHeartbeat =
        now.getTime() - session.lastHeartbeat.getTime();
      if (session.isActive && timeSinceHeartbeat < this.INACTIVE_THRESHOLD) {
        active++;
      } else {
        inactive++;
      }
    }

    return { total, active, inactive };
  }

  /**
   * Generate cryptographically secure session token
   */
  private generateSessionToken(): string {
    return crypto.randomBytes(32).toString("hex");
  }

  /**
   * Cleanup expired sessions
   */
  private cleanupExpiredSessions(): void {
    const now = new Date();
    let cleanedCount = 0;

    for (const [token, session] of Object.entries(this.sessions)) {
      if (now > session.expiresAt) {
        delete this.sessions[token];
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      console.log("EnhancedVideoSessionService: Cleaned up expired sessions", {
        cleanedCount,
        remainingSessions: Object.keys(this.sessions).length,
      });
    }
  }

  /**
   * Mark inactive sessions based on heartbeat
   */
  private markInactiveSessions(): void {
    const now = new Date();
    let inactiveCount = 0;

    for (const session of Object.values(this.sessions)) {
      const timeSinceHeartbeat =
        now.getTime() - session.lastHeartbeat.getTime();

      if (session.isActive && timeSinceHeartbeat > this.INACTIVE_THRESHOLD) {
        session.isActive = false;
        inactiveCount++;
      }
    }

    if (inactiveCount > 0) {
      console.log("EnhancedVideoSessionService: Marked inactive sessions", {
        inactiveCount,
        threshold: this.INACTIVE_THRESHOLD / 1000 / 60 + " minutes",
      });
    }
  }

  /**
   * Start periodic cleanup process
   */
  private startCleanupProcess(): void {
    setInterval(() => {
      this.cleanupExpiredSessions();
    }, this.CLEANUP_INTERVAL);

    console.log("EnhancedVideoSessionService: Cleanup process started", {
      cleanupInterval: this.CLEANUP_INTERVAL / 1000 / 60 + " minutes",
    });
  }

  /**
   * Start inactivity monitoring
   */
  private startInactivityMonitoring(): void {
    setInterval(() => {
      this.markInactiveSessions();
    }, this.HEARTBEAT_INTERVAL);

    console.log("EnhancedVideoSessionService: Inactivity monitoring started", {
      checkInterval: this.HEARTBEAT_INTERVAL / 1000 + " seconds",
    });
  }
}

export default new EnhancedVideoSessionService();
