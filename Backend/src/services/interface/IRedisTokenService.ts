/**
 * 🔹 DIP COMPLIANCE: Redis Token Service Interface
 * Defines Redis-based token storage and management operations
 */
export interface IRedisTokenService {
  // Token Storage
  saveRefreshToken(
    userId: string,
    refreshToken: string,
    expiresInMinutes?: number,
    userType?: "admin" | "user"
  ): Promise<void>;

  // Token Retrieval
  getRefreshToken(
    userId: string,
    userType?: "admin" | "user"
  ): Promise<string | null>;

  // Token Verification
  verifyRefreshToken(
    userId: string,
    refreshToken: string,
    userType?: "admin" | "user"
  ): Promise<boolean>;

  verifyRefreshTokenDirect(
    userId: string,
    tokenToVerify: string,
    userType?: "admin" | "user"
  ): Promise<boolean>;

  // Token Management
  removeRefreshToken(
    userId: string,
    userType?: "admin" | "user"
  ): Promise<boolean>;

  removeAllUserTokens(
    userId: string,
    userType?: "admin" | "user"
  ): Promise<boolean>;

  // Token Information
  getTokenTTL(
    userId: string,
    userType?: "admin" | "user"
  ): Promise<number>;

  // Debugging & Monitoring
  debugRedisState(
    userId: string,
    userType?: "admin" | "user"
  ): Promise<void>;

  // Connection Management
  disconnect(): Promise<void>;
}