/**
 * 🔹 DIP COMPLIANCE: Video Session Service Interface
 * Defines video session management and tracking operations
 */
export interface IVideoSessionService {
  // Session Management
  createSession(
    userId: string,
    serviceId: string
  ): {
    sessionToken: string;
    expiresAt: Date;
    heartbeatInterval: number;
  };

  validateSession(
    sessionToken: string,
    userId: string
  ): {
    isValid: boolean;
    session?: any;
    remainingTime?: number;
    needsRefresh?: boolean;
  };

  refreshSession(
    sessionToken: string,
    userId: string
  ): {
    success: boolean;
    newExpiresAt?: Date;
    error?: string;
  };

  // Session Tracking
  updateHeartbeat(
    sessionToken: string,
    userId: string
  ): {
    success: boolean;
    nextHeartbeat?: Date;
  };

  getSessionInfo(
    sessionToken: string
  ): {
    userId?: string;
    serviceId?: string;
    expiresAt?: Date;
    accessCount?: number;
    isActive?: boolean;
  } | null;

  // Session Cleanup
  invalidateSession(sessionToken: string): boolean;
  
  cleanupExpiredSessions(): {
    cleanedSessions: number;
    activeSessions: number;
  };

  // Analytics
  getSessionStats(): {
    totalActiveSessions: number;
    inactiveSessions: number;
    averageSessionDuration: number;
  };
}