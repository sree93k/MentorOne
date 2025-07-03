import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { HttpStatus } from "../../constants/HttpStatus";
import { AdminLoginDTO } from "../../dtos/adminDTO";
import { IAdminAuthService } from "../../services/interface/IAdminAuthService";
import { IAdminAuthController } from "../interface/IAdminAuthController"; // Import the new interface
import { TYPES } from "../../inversify/types";
import { wrapAsync } from "../../errors/catchAsync";
import ApiResponse from "../../utils/apiResponse";
import { logger } from "../../utils/logger";
import cookieConfig from "../../config/cookieConfig"; // Fixed typo: cookieConifg -> cookieConfig
import AppError from "../../errors/appError";

@injectable()
export class AdminAuthController implements IAdminAuthController {
  constructor(
    @inject(TYPES.IAdminAuthService) private adminAuthService: IAdminAuthService
  ) {}

  public login = wrapAsync(async (req: Request, res: Response) => {
    logger.info("Admin login attempt", { email: req.body.adminEmail });
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
        "warn"
      );
    }

    res.cookie("adminAccessToken", result.accessToken, cookieConfig);
    res.cookie("adminRefreshToken", result.refreshToken, {
      ...cookieConfig,
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
  });

  public logout = wrapAsync(async (req: Request, res: Response) => {
    logger.info("Admin logout attempt", { userId: req.user?.id });
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
        "warn"
      );
    }

    const result = await this.adminAuthService.logout(userId, refreshToken);

    if (!result) {
      logger.warn("Logout failed: Invalid refresh token", { userId });
      throw new AppError("Logout failed", HttpStatus.BAD_REQUEST, "warn");
    }

    res.clearCookie("adminAccessToken", cookieConfig);
    res.clearCookie("adminRefreshToken", cookieConfig);

    res
      .status(HttpStatus.OK)
      .json(new ApiResponse(HttpStatus.OK, null, "Logout successful"));
  });

  public refreshToken = wrapAsync(async (req: Request, res: Response) => {
    logger.info("Admin token refresh attempt", { userId: req.user?.id });
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
        "warn"
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
        "warn"
      );
    }

    res.cookie("adminAccessToken", newAccessToken, cookieConfig);

    res
      .status(HttpStatus.OK)
      .json(
        new ApiResponse(HttpStatus.OK, null, "Token refreshed successfully")
      );
  });
}
