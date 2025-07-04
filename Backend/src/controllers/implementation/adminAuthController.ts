import { Request, Response } from "express";
import { HttpStatus } from "../../constants/HttpStatus";
import { AdminLoginDTO } from "../../dtos/adminDTO";
import { IAdminAuthService } from "../../services/interface/IAdminAuthService";
import { IAdminAuthController } from "../interface/IAdminAuthController";
import { logger } from "../../utils/logger";
import { AppError } from "../../errors/appError";
import { ApiResponse } from "../../utils/apiResponse";

export class AdminAuthController implements IAdminAuthController {
  constructor(private readonly adminAuthService: IAdminAuthService) {}

  public login = async (req: Request, res: Response): Promise<void> => {
    logger.info("Admin login attempt", { email: req.body.adminEmail });
    try {
      const { adminEmail, adminPassword } = req.body as AdminLoginDTO;

      const result = await this.adminAuthService.login({
        adminEmail,
        adminPassword,
      });

      if (!result) {
        logger.warn("Admin login failed: Invalid credentials", {
          email: adminEmail,
        });
        throw new AppError(
          "Invalid credentials",
          HttpStatus.UNAUTHORIZED,
          "warn",
          "INVALID_CREDENTIALS"
        );
      }

      res.cookie("adminAccessToken", result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 20 * 60 * 1000, // 20 minutes
      });
      res.cookie("adminRefreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            { adminFound: result.adminFound },
            "Login successful"
          )
        );
    } catch (error) {
      logger.error("Login failed", {
        error: error instanceof Error ? error.message : String(error),
        email: req.body.adminEmail,
      });
      throw error instanceof AppError
        ? error
        : new AppError(
            "Login failed",
            HttpStatus.INTERNAL_SERVER,
            "error",
            "LOGIN_ERROR"
          );
    }
  };

  public logout = async (req: Request, res: Response): Promise<void> => {
    logger.info("Admin logout attempt", { userId: req.user?.id });
    try {
      const refreshToken = req.cookies?.adminRefreshToken;
      const userId = req.user?.id;

      if (!userId || !refreshToken) {
        logger.warn("Logout failed: Missing user ID or refresh token", {
          userId,
          hasToken: !!refreshToken,
        });
        throw new AppError(
          "Missing user ID or refresh token",
          HttpStatus.BAD_REQUEST,
          "warn",
          "MISSING_CREDENTIALS"
        );
      }

      const result = await this.adminAuthService.logout(userId, refreshToken);

      if (!result) {
        logger.warn("Logout failed: Invalid refresh token", { userId });
        throw new AppError(
          "Logout failed",
          HttpStatus.BAD_REQUEST,
          "warn",
          "LOGOUT_FAILED"
        );
      }

      res.clearCookie("adminAccessToken");
      res.clearCookie("adminRefreshToken");

      res
        .status(HttpStatus.OK)
        .json(new ApiResponse(HttpStatus.OK, null, "Logout successful"));
    } catch (error) {
      logger.error("Logout failed", {
        error: error instanceof Error ? error.message : String(error),
        userId: req.user?.id,
      });
      throw error instanceof AppError
        ? error
        : new AppError(
            "Logout failed",
            HttpStatus.INTERNAL_SERVER,
            "error",
            "LOGOUT_ERROR"
          );
    }
  };

  public refreshToken = async (req: Request, res: Response): Promise<void> => {
    logger.info("Admin token refresh attempt", { userId: req.user?.id });
    try {
      const refreshToken = req.cookies?.adminRefreshToken;
      const userId = req.user?.id;

      if (!userId || !refreshToken) {
        logger.warn("Token refresh failed: Missing user ID or refresh token", {
          userId,
          hasToken: !!refreshToken,
        });
        throw new AppError(
          "Missing user ID or refresh token",
          HttpStatus.BAD_REQUEST,
          "warn",
          "MISSING_CREDENTIALS"
        );
      }

      const newAccessToken = await this.adminAuthService.refreshAccessToken(
        userId,
        refreshToken
      );

      if (!newAccessToken) {
        logger.warn("Token refresh failed: Invalid refresh token", { userId });
        throw new AppError(
          "Invalid refresh token",
          HttpStatus.UNAUTHORIZED,
          "warn",
          "INVALID_REFRESH_TOKEN"
        );
      }

      res.cookie("adminAccessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 20 * 60 * 1000, // 20 minutes
      });

      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(HttpStatus.OK, null, "Token refreshed successfully")
        );
    } catch (error) {
      logger.error("Token refresh failed", {
        error: error instanceof Error ? error.message : String(error),
        userId: req.user?.id,
      });
      throw error instanceof AppError
        ? error
        : new AppError(
            "Token refresh failed",
            HttpStatus.INTERNAL_SERVER,
            "error",
            "REFRESH_TOKEN_ERROR"
          );
    }
  };
}
