/**
 * 🔹 DIP COMPLIANCE: User Ejection Service Interface
 * Defines user blocking and ejection operations
 */
export interface IUserEjectionService {
  // User Ejection
  ejectUser(
    userId: string,
    reason: string,
    adminId: string,
    blockData?: {
      category?: string;
      adminNote?: string;
      adminIP?: string;
      timestamp?: string;
    }
  ): Promise<void>;

  // Socket Management
  disconnectUserSockets(
    userId: string,
    reason: string
  ): Promise<{
    disconnectedSockets: number;
    success: boolean;
  }>;

  sendEjectionNotification(
    userId: string,
    reason: string,
    socketId?: string
  ): Promise<void>;

  // Session Management
  invalidateUserSessions(
    userId: string
  ): Promise<{
    invalidatedSessions: number;
    success: boolean;
  }>;

  clearUserCache(userId: string): Promise<void>;

  // Email Notifications
  sendEjectionEmail(
    userEmail: string,
    userName: string,
    reason: string,
    appealProcess?: {
      canAppeal: boolean;
      appealDeadline?: Date;
      appealUrl?: string;
    }
  ): Promise<{
    emailSent: boolean;
    messageId?: string;
    error?: string;
  }>;

  // Logging and Audit
  logEjectionEvent(
    userId: string,
    adminId: string,
    reason: string,
    blockData?: any,
    metadata?: {
      userIP?: string;
      userAgent?: string;
      timestamp: Date;
    }
  ): Promise<void>;

  // Recovery Operations
  canUserAppeal(userId: string): Promise<{
    canAppeal: boolean;
    appealDeadline?: Date;
    existingAppeals?: number;
  }>;

  restoreUserAccess(
    userId: string,
    adminId: string,
    reason: string
  ): Promise<{
    success: boolean;
    restoredSessions: number;
    notificationSent: boolean;
  }>;
}