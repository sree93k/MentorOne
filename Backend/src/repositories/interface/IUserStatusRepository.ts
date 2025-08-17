/**
 * 🔹 ISP COMPLIANCE: User Status Management Interface
 * Responsible only for managing user online/offline status
 */
export interface IUserStatusRepository {
  // Status Management
  updateOnlineStatus(
    userId: string,
    role: "mentor" | "mentee",
    isOnline: boolean
  ): Promise<void>;
}