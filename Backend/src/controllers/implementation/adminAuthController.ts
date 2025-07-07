import { Request, Response } from "express";
import DIContainer from "../../inversify/conatainer";
import { HttpStatus } from "../../constants/HttpStatus";
import { AdminLoginDTO } from "../../dtos/adminDTO";

export class AdminAuthController {
  async login(req: Request, res: Response): Promise<void> {
    try {
      const adminAuthService = DIContainer.getAdminAuthService();
      const { adminEmail, adminPassword } = req.body as AdminLoginDTO;

      const result = await adminAuthService.login({
        adminEmail,
        adminPassword,
      });

      if (result) {
        // Set access token and refresh token as HTTP-only cookies
        res.cookie("accessToken", result.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 20 * 60 * 1000, // 20 minutes
        });
        res.cookie("refreshToken", result.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(HttpStatus.OK).json({
          success: true,
          message: "Login successful",
          data: { adminFound: result.adminFound },
        });
      } else {
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: "Invalid credentials",
        });
      }
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Login failed",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      const adminAuthService = DIContainer.getAdminAuthService();
      const refreshToken = req.cookies?.refreshToken;
      const userId = req.user?.id;

      if (!userId || !refreshToken) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Missing user ID or refresh token",
        });
        return;
      }

      const result = await adminAuthService.logout(userId, refreshToken);

      if (result) {
        // Clear cookies
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        res.status(HttpStatus.OK).json({
          success: true,
          message: "Logout successful",
        });
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Logout failed",
        });
      }
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Logout failed",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const adminAuthService = DIContainer.getAdminAuthService();
      const refreshToken = req.cookies?.refreshToken;
      const userId = req.user?.id;

      if (!userId || !refreshToken) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Missing user ID or refresh token",
        });
        return;
      }

      const newAccessToken = await adminAuthService.refreshAccessToken(
        userId,
        refreshToken
      );

      if (newAccessToken) {
        // Set new access token as cookie
        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 20 * 60 * 1000, // 20 minutes
        });

        res.status(HttpStatus.OK).json({
          success: true,
          message: "Token refreshed successfully",
        });
      } else {
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: "Invalid refresh token",
        });
      }
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Token refresh failed",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}

export default new AdminAuthController();
