import { Request, Response } from "express";
import DIContainer from "../../inversify/conatainer";
import { HttpStatus } from "../../constants/HttpStatus";
import { AdminLoginDTO } from "../../dtos/adminDTO";

export class AdminAuthController {
  async login(req: Request, res: Response): Promise<void> {
    try {
      console.log("🔐 === LOGIN ATTEMPT DEBUG ===");
      console.log("🔐 Request body:", req.body);
      console.log("🔐 Request headers:", req.headers);
      console.log("🔐 Existing cookies:", req.cookies);

      const adminAuthService = DIContainer.getAdminAuthService();
      const { adminEmail, adminPassword } = req.body as AdminLoginDTO;

      console.log("🔐 Login attempt for:", adminEmail);

      const result = await adminAuthService.login({
        adminEmail,
        adminPassword,
      });

      if (result) {
        console.log("🔐 Login successful, setting cookies");
        console.log("🔐 Access token length:", result.accessToken.length);
        console.log("🔐 Admin found:", result.adminFound._id);

        // Log environment for cookie settings
        console.log("🔐 NODE_ENV:", process.env.NODE_ENV);
        console.log(
          "🔐 Cookie secure setting:",
          process.env.NODE_ENV === "production"
        );

        // ✅ CRITICAL FIX: Set cookie maxAge longer than JWT expiry
        // This allows us to extract userId from expired JWT in cookie
        res.cookie("accessToken", result.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 3 * 60 * 60 * 1000, // 5 minutes (longer than JWT 30s expiry)
          path: "/",
        });

        // ❌ REMOVED: No longer setting refresh token cookie
        // Refresh token is ONLY stored in Redis now

        console.log("🔐 Cookies set with options:");
        console.log("🔐 - httpOnly: true");
        console.log("🔐 - secure:", process.env.NODE_ENV === "production");
        console.log("🔐 - sameSite: lax");
        console.log("🔐 - path: /");
        console.log("🔐 - ONLY ACCESS TOKEN in cookie");

        // Log response headers to verify cookies are being set
        console.log(
          "🔐 Response Set-Cookie headers:",
          res.getHeaders()["set-cookie"]
        );

        res.status(HttpStatus.OK).json({
          success: true,
          message: "Login successful",
          data: {
            adminFound: result.adminFound,
            // Include user ID for frontend to track
            userId: result.adminFound._id,
          },
          debug: {
            cookiesSet: true,
            accessTokenSet: true,
            refreshTokenInRedis: true, // Changed from refreshTokenSet
          },
        });

        console.log("🔐 === LOGIN RESPONSE SENT ===");
      } else {
        console.log("❌ Login failed - invalid credentials");
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: "Invalid credentials",
        });
      }
    } catch (error) {
      console.error("🚨 Login error:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Login failed",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      console.log("🚪 === LOGOUT ATTEMPT DEBUG ===");
      console.log("🚪 Request cookies:", req.cookies);

      const adminAuthService = DIContainer.getAdminAuthService();
      const userId = req.user?.id;

      console.log("🚪 Logout attempt for user:", userId);

      if (!userId) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: "Missing user ID",
        });
        return;
      }

      // ✅ CHANGED: Only need userId for logout (refresh token retrieved from Redis)
      const result = await adminAuthService.logout(userId);

      if (result) {
        // ✅ ONLY CLEAR ACCESS TOKEN COOKIE
        res.clearCookie("accessToken", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
        });

        // ❌ REMOVED: No refresh token cookie to clear

        console.log("🚪 Logout successful, access token cookie cleared");
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
      console.error("🚨 Logout error:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Logout failed",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      console.log("🔄 === REFRESH TOKEN ATTEMPT DEBUG ===");
      console.log("🔄 Request cookies:", req.cookies);
      console.log("🔄 Request headers:", req.headers);

      const adminAuthService = DIContainer.getAdminAuthService();
      const userId = req.user?.id;

      console.log("🔄 Refresh token endpoint called");
      console.log("🔄 User ID:", userId);

      if (!userId) {
        console.log("❌ Missing userId");
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: "Missing user ID",
        });
        return;
      }

      // ✅ CHANGED: Only need userId (refresh token retrieved from Redis)
      const result = await adminAuthService.refreshAccessToken(userId);

      if (result) {
        console.log("✅ Token refresh successful");

        // ✅ CRITICAL FIX: Set cookie maxAge longer than JWT expiry
        res.cookie("accessToken", result.newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 3 * 60 * 60 * 1000, // 5 minutes (longer than JWT 30s expiry)
          path: "/",
        });

        // ❌ REMOVED: No refresh token cookie (it stays in Redis only)

        console.log(
          "🔄 Response Set-Cookie headers:",
          res.getHeaders()["set-cookie"]
        );

        res.status(HttpStatus.OK).json({
          success: true,
          message: "Token refreshed successfully",
          debug: {
            newAccessTokenSet: true,
            refreshTokenInRedis: true, // Changed from cookie reference
          },
        });
      } else {
        console.log("❌ Token refresh failed - invalid refresh token");
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: "Invalid refresh token",
        });
      }
    } catch (error) {
      console.error("🚨 Refresh token error:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Token refresh failed",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}

export default new AdminAuthController();
