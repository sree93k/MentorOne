// src/services/implementations/AdminAuthService.ts
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
    console.log("Service - Login attempt for email:", user.adminEmail);
    try {
      if (!user.adminEmail || !user.adminPassword) {
        throw new Error(
          `${HttpStatus.BAD_REQUEST}: Email and password are required`
        );
      }

      const adminFound = await this.adminRepository.findByEmail(
        user.adminEmail
      );
      console.log("Service - Admin found:", adminFound ? "Yes" : "No");

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

        // Store refresh token in Redis only
        await this.redisTokenService.saveRefreshToken(id, refreshToken, 7);
        console.log("Access token:", accessToken);
        console.log("Refresh token:", refreshToken);

        const adminObject = adminFound.toObject();
        const { adminPassword, ...adminWithoutPassword } = adminObject;

        return { accessToken, refreshToken, adminFound: adminWithoutPassword };
      }

      console.log("Service - Login failed");
      return null;
    } catch (error) {
      throw new Error(
        `${HttpStatus.UNAUTHORIZED}: Invalid credentials - ${error}`
      );
    }
  }

  async logout(userId: string, refreshToken: string): Promise<boolean> {
    try {
      console.log("Service - Logout attempt for user:", userId);

      const isValidToken = await this.redisTokenService.verifyRefreshToken(
        userId,
        refreshToken
      );
      if (!isValidToken) {
        console.log("Service - Invalid or expired refresh token");
        return false;
      }

      const removed = await this.redisTokenService.removeRefreshToken(userId);
      console.log("Service - Refresh token removed from Redis:", removed);

      return removed;
    } catch (error) {
      throw new Error(
        `${HttpStatus.INTERNAL_SERVER_ERROR}: Failed to logout - ${error}`
      );
    }
  }

  async refreshAccessToken(
    userId: string,
    refreshToken: string
  ): Promise<string | null> {
    try {
      const isValidToken = await this.redisTokenService.verifyRefreshToken(
        userId,
        refreshToken
      );
      if (!isValidToken) {
        console.log("Service - Invalid refresh token for user:", userId);
        return null;
      }

      const adminFound = await this.adminRepository.findById(userId);
      if (adminFound) {
        const id = adminFound._id.toString();
        const role = Array.isArray(adminFound.role)
          ? adminFound.role[0]
          : adminFound.role || "admin";

        const accessToken = generateAccessToken({ id, role });

        // Optionally rotate refresh token
        const newRefreshToken = generateRefreshToken({ id, role });
        await this.redisTokenService.saveRefreshToken(id, newRefreshToken, 7);

        return accessToken;
      }
      return null;
    } catch (error) {
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
