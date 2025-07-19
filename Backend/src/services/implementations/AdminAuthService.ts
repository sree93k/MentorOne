import bcrypt from "bcryptjs";
import { EAdmin } from "../../entities/adminEntity";
import { IAdminAuthService } from "../interface/IAdminAuthservice";
import { IAdminRepository } from "../../repositories/interface/IAdminRespository";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt";
import { HttpStatus } from "../../constants/HttpStatus";
import { RedisTokenService } from "./RedisTokenService";

export default class AdminAuthService implements IAdminAuthService {
  private adminRepository: IAdminRepository;
  private redisTokenService: RedisTokenService;

  constructor(
    redisTokenService: RedisTokenService,
    adminRepository: IAdminRepository
  ) {
    this.adminRepository = adminRepository;
    this.redisTokenService = redisTokenService;
  }

  async login(user: { adminEmail: string; adminPassword: string }): Promise<{
    accessToken: string;
    refreshToken: string;
    adminFound: Omit<EAdmin, "adminPassword">;
  } | null> {
    console.log("🔐 Service - Login attempt for email:", user.adminEmail);
    try {
      if (!user.adminEmail || !user.adminPassword) {
        throw new Error(
          `${HttpStatus.BAD_REQUEST}: Email and password are required`
        );
      }

      const adminFound = await this.adminRepository.findByEmail(
        user.adminEmail
      );
      console.log("👤 Service - Admin found:", adminFound ? "Yes" : "No");

      if (
        adminFound &&
        adminFound.adminPassword &&
        (await bcrypt.compare(user.adminPassword, adminFound.adminPassword))
      ) {
        const id = adminFound._id.toString();
        const role = Array.isArray(adminFound.role)
          ? adminFound.role[0]
          : adminFound.role || "admin";

        const accessToken = generateAccessToken({ id, role });
        const refreshToken = generateRefreshToken({ id, role });

        // ✅ ONLY store refresh token in Redis (2 minutes for testing)
        await this.redisTokenService.saveRefreshToken(id, refreshToken, 2);
        console.log(
          "🔑 Tokens generated and refresh token stored ONLY in Redis"
        );

        const adminObject = adminFound.toObject();
        const { adminPassword, ...adminWithoutPassword } = adminObject;

        // ✅ RETURN refresh token for logging but it won't go to cookie
        return { accessToken, refreshToken, adminFound: adminWithoutPassword };
      }

      console.log("❌ Service - Login failed");
      return null;
    } catch (error) {
      console.error("🚨 Service - Login error:", error);
      throw new Error(
        `${HttpStatus.UNAUTHORIZED}: Invalid credentials - ${error}`
      );
    }
  }

  // ✅ CHANGED: Only need userId (no refreshToken parameter)
  async logout(userId: string): Promise<boolean> {
    try {
      console.log("🚪 Service - Logout attempt for user:", userId);

      // ✅ SIMPLIFIED: Just remove from Redis (no token verification needed)
      const removed = await this.redisTokenService.removeRefreshToken(userId);
      console.log("🗑️ Service - Refresh token removed from Redis:", removed);

      return removed;
    } catch (error) {
      console.error("🚨 Service - Logout error:", error);
      throw new Error(
        `${HttpStatus.INTERNAL_SERVER_ERROR}: Failed to logout - ${error}`
      );
    }
  }

  // ✅ CHANGED: Only need userId (refresh token retrieved from Redis)
  async refreshAccessToken(
    userId: string
  ): Promise<{ newAccessToken: string; newRefreshToken: string } | null> {
    try {
      console.log("🔄 Service - Refresh token attempt for user:", userId);

      // ✅ RETRIEVE refresh token from Redis
      const refreshToken = await this.redisTokenService.getRefreshToken(userId);
      if (!refreshToken) {
        console.log(
          "❌ Service - No refresh token found in Redis for user:",
          userId
        );
        return null;
      }

      // ✅ VERIFY the retrieved refresh token
      const isValidToken =
        await this.redisTokenService.verifyRefreshTokenDirect(
          userId,
          refreshToken
        );
      if (!isValidToken) {
        console.log("❌ Service - Invalid refresh token for user:", userId);
        return null;
      }

      const adminFound = await this.adminRepository.findById(userId);
      if (adminFound) {
        const id = adminFound._id.toString();
        const role = Array.isArray(adminFound.role)
          ? adminFound.role[0]
          : adminFound.role || "admin";

        const newAccessToken = generateAccessToken({ id, role });

        // ✅ ALWAYS generate new refresh token for proper token rotation
        const newRefreshToken = generateRefreshToken({ id, role });

        // ✅ Remove old refresh token and save new one in Redis
        await this.redisTokenService.removeRefreshToken(id);
        await this.redisTokenService.saveRefreshToken(id, newRefreshToken, 2); // 2 minutes

        console.log(
          "✅ Service - New tokens generated with token rotation (Redis only)"
        );
        return { newAccessToken, newRefreshToken };
      }
      console.log("❌ Service - Admin not found");
      return null;
    } catch (error) {
      console.error("🚨 Service - Refresh token error:", error);
      throw new Error(
        `${HttpStatus.UNAUTHORIZED}: Failed to refresh token - ${error}`
      );
    }
  }

  async logoutFromAllDevices(userId: string): Promise<boolean> {
    try {
      return await this.redisTokenService.removeAllUserTokens(userId);
    } catch (error) {
      throw new Error(
        `${HttpStatus.INTERNAL_SERVER_ERROR}: Failed to logout from all devices - ${error}`
      );
    }
  }
}
