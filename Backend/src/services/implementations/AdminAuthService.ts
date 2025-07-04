import bcrypt from "bcryptjs";
import { EAdmin } from "../../entities/adminEntity";
import { IAdminAuthService } from "../interface/IAdminAuthService";
import { IAdminRepository } from "../../repositories/interface/IAdminRepository";
import { RedisTokenService } from "./RedisTokenService";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt";
import { HttpStatus } from "../../constants/HttpStatus";
import { logger } from "../../utils/logger";
import { AppError } from "../../errors/appError";
import { AdminLoginDTO } from "../../dtos/adminDTO";

export class AdminAuthService implements IAdminAuthService {
  constructor(
    private readonly adminRepository: IAdminRepository,
    private readonly redisTokenService: RedisTokenService
  ) {}

  async login(dto: AdminLoginDTO): Promise<{
    accessToken: string;
    refreshToken: string;
    adminFound: Omit<EAdmin, "adminPassword">;
  } | null> {
    logger.info("Admin login attempt", { email: dto.adminEmail });

    if (!dto.adminEmail || !dto.adminPassword) {
      logger.warn("Login failed: Missing email or password", {
        email: dto.adminEmail,
      });
      throw new AppError(
        "Email and password are required",
        HttpStatus.BAD_REQUEST,
        "warn",
        "MISSING_CREDENTIALS"
      );
    }

    const adminFound = await this.adminRepository.findByEmail(dto.adminEmail);
    if (
      !adminFound ||
      !adminFound.adminPassword ||
      !(await bcrypt.compare(dto.adminPassword, adminFound.adminPassword))
    ) {
      logger.warn("Login failed: Invalid credentials", {
        email: dto.adminEmail,
      });
      throw new AppError(
        "Invalid credentials",
        HttpStatus.UNAUTHORIZED,
        "warn",
        "INVALID_CREDENTIALS"
      );
    }

    const id = adminFound._id.toString();
    const role = Array.isArray(adminFound.role)
      ? adminFound.role[0]
      : adminFound.role || "admin";

    const accessToken = generateAccessToken({ id, role });
    const refreshToken = generateRefreshToken({ id, role });

    await this.redisTokenService.saveRefreshToken(id, refreshToken, 7);
    logger.info("Tokens generated and stored", { userId: id });

    const adminObject = adminFound.toObject();
    const { adminPassword, ...adminWithoutPassword } = adminObject;

    return { accessToken, refreshToken, adminFound: adminWithoutPassword };
  }

  async logout(userId: string, refreshToken: string): Promise<boolean> {
    logger.info("Admin logout attempt", { userId });

    const isValidToken = await this.redisTokenService.verifyRefreshToken(
      userId,
      refreshToken
    );
    if (!isValidToken) {
      logger.warn("Logout failed: Invalid or expired refresh token", {
        userId,
      });
      throw new AppError(
        "Invalid or expired refresh token",
        HttpStatus.UNAUTHORIZED,
        "warn",
        "INVALID_REFRESH_TOKEN"
      );
    }

    const removed = await this.redisTokenService.removeRefreshToken(userId);
    logger.info("Refresh token removed from Redis", { userId, removed });

    return removed;
  }

  async refreshAccessToken(
    userId: string,
    refreshToken: string
  ): Promise<string | null> {
    logger.info("Admin token refresh attempt", { userId });

    const isValidToken = await this.redisTokenService.verifyRefreshToken(
      userId,
      refreshToken
    );
    if (!isValidToken) {
      logger.warn("Token refresh failed: Invalid refresh token", { userId });
      throw new AppError(
        "Invalid refresh token",
        HttpStatus.UNAUTHORIZED,
        "warn",
        "INVALID_REFRESH_TOKEN"
      );
    }

    const adminFound = await this.adminRepository.findById(userId);
    if (!adminFound) {
      logger.warn("Token refresh failed: Admin not found", { userId });
      throw new AppError(
        "Admin not found",
        HttpStatus.NOT_FOUND,
        "warn",
        "ADMIN_NOT_FOUND"
      );
    }

    const id = adminFound._id.toString();
    const role = Array.isArray(adminFound.role)
      ? adminFound.role[0]
      : adminFound.role || "admin";

    const accessToken = generateAccessToken({ id, role });
    const newRefreshToken = generateRefreshToken({ id, role });

    await this.redisTokenService.saveRefreshToken(id, newRefreshToken, 7);
    logger.info("Tokens refreshed and stored", { userId });

    return accessToken;
  }

  async logoutFromAllDevices(userId: string): Promise<boolean> {
    logger.info("Admin logout from all devices attempt", { userId });
    const removed = await this.redisTokenService.removeAllUserTokens(userId);
    logger.info("All tokens removed for admin", { userId, removed });
    return removed;
  }
}
