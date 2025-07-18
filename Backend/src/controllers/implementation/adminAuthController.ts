// // // // // src/controllers/implementation/AdminAuthController.ts
// // // // import { Request, Response } from "express";
// // // // import DIContainer from "../../inversify/conatainer";
// // // // import { HttpStatus } from "../../constants/HttpStatus";
// // // // import { AdminLoginDTO } from "../../dtos/adminDTO";

// // // // export class AdminAuthController {
// // // //   async login(req: Request, res: Response): Promise<void> {
// // // //     try {
// // // //       const adminAuthService = DIContainer.getAdminAuthService();
// // // //       const { adminEmail, adminPassword } = req.body as AdminLoginDTO;

// // // //       const result = await adminAuthService.login({
// // // //         adminEmail,
// // // //         adminPassword,
// // // //       });

// // // //       if (result) {
// // // //         // Set access token and refresh token as HTTP-only cookies
// // // //         res.cookie("accessToken", result.accessToken, {
// // // //           httpOnly: true,
// // // //           secure: process.env.NODE_ENV === "production",
// // // //           sameSite: "strict",
// // // //           maxAge: 20 * 60 * 1000, // 20 minutes
// // // //         });
// // // //         res.cookie("refreshToken", result.refreshToken, {
// // // //           httpOnly: true,
// // // //           secure: process.env.NODE_ENV === "production",
// // // //           sameSite: "strict",
// // // //           maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
// // // //         });

// // // //         res.status(HttpStatus.OK).json({
// // // //           success: true,
// // // //           message: "Login successful",
// // // //           data: { adminFound: result.adminFound },
// // // //         });
// // // //       } else {
// // // //         res.status(HttpStatus.UNAUTHORIZED).json({
// // // //           success: false,
// // // //           message: "Invalid credentials",
// // // //         });
// // // //       }
// // // //     } catch (error) {
// // // //       res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
// // // //         success: false,
// // // //         message: "Login failed",
// // // //         error: error instanceof Error ? error.message : "Unknown error",
// // // //       });
// // // //     }
// // // //   }

// // // //   async logout(req: Request, res: Response): Promise<void> {
// // // //     try {
// // // //       const adminAuthService = DIContainer.getAdminAuthService();
// // // //       const refreshToken = req.cookies?.refreshToken;
// // // //       const userId = req.user?.id;

// // // //       if (!userId || !refreshToken) {
// // // //         res.status(HttpStatus.BAD_REQUEST).json({
// // // //           success: false,
// // // //           message: "Missing user ID or refresh token",
// // // //         });
// // // //         return;
// // // //       }

// // // //       const result = await adminAuthService.logout(userId, refreshToken);

// // // //       if (result) {
// // // //         // Clear cookies
// // // //         res.clearCookie("accessToken");
// // // //         res.clearCookie("refreshToken");

// // // //         res.status(HttpStatus.OK).json({
// // // //           success: true,
// // // //           message: "Logout successful",
// // // //         });
// // // //       } else {
// // // //         res.status(HttpStatus.BAD_REQUEST).json({
// // // //           success: false,
// // // //           message: "Logout failed",
// // // //         });
// // // //       }
// // // //     } catch (error) {
// // // //       res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
// // // //         success: false,
// // // //         message: "Logout failed",
// // // //         error: error instanceof Error ? error.message : "Unknown error",
// // // //       });
// // // //     }
// // // //   }

// // // //   async refreshToken(req: Request, res: Response): Promise<void> {
// // // //     try {
// // // //       const adminAuthService = DIContainer.getAdminAuthService();
// // // //       const refreshToken = req.cookies?.refreshToken;
// // // //       const userId = req.user?.id;

// // // //       if (!userId || !refreshToken) {
// // // //         res.status(HttpStatus.BAD_REQUEST).json({
// // // //           success: false,
// // // //           message: "Missing user ID or refresh token",
// // // //         });
// // // //         return;
// // // //       }

// // // //       const newAccessToken = await adminAuthService.refreshAccessToken(
// // // //         userId,
// // // //         refreshToken
// // // //       );

// // // //       if (newAccessToken) {
// // // //         // Set new access token as cookie
// // // //         res.cookie("accessToken", newAccessToken, {
// // // //           httpOnly: true,
// // // //           secure: process.env.NODE_ENV === "production",
// // // //           sameSite: "strict",
// // // //           maxAge: 20 * 60 * 1000, // 20 minutes
// // // //         });

// // // //         res.status(HttpStatus.OK).json({
// // // //           success: true,
// // // //           message: "Token refreshed successfully",
// // // //         });
// // // //       } else {
// // // //         res.status(HttpStatus.UNAUTHORIZED).json({
// // // //           success: false,
// // // //           message: "Invalid refresh token",
// // // //         });
// // // //       }
// // // //     } catch (error) {
// // // //       res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
// // // //         success: false,
// // // //         message: "Token refresh failed",
// // // //         error: error instanceof Error ? error.message : "Unknown error",
// // // //       });
// // // //     }
// // // //   }
// // // // }

// // // // export default new AdminAuthController();
// // // import { Request, Response } from "express";
// // // import DIContainer from "../../inversify/conatainer";
// // // import { HttpStatus } from "../../constants/HttpStatus";
// // // import { AdminLoginDTO } from "../../dtos/adminDTO";

// // // export class AdminAuthController {
// // //   async login(req: Request, res: Response): Promise<void> {
// // //     try {
// // //       const adminAuthService = DIContainer.getAdminAuthService();
// // //       const { adminEmail, adminPassword } = req.body as AdminLoginDTO;

// // //       const result = await adminAuthService.login({
// // //         adminEmail,
// // //         adminPassword,
// // //       });

// // //       if (result) {
// // //         // Set access token and refresh token as HTTP-only cookies
// // //         res.cookie("accessToken", result.accessToken, {
// // //           httpOnly: true,
// // //           secure: process.env.NODE_ENV === "production",
// // //           sameSite: "strict",
// // //           maxAge: 2 * 60 * 1000, // 2 minutes (matching your JWT config)
// // //         });

// // //         res.cookie("refreshToken", result.refreshToken, {
// // //           httpOnly: true,
// // //           secure: process.env.NODE_ENV === "production",
// // //           sameSite: "strict",
// // //           maxAge: 5 * 60 * 1000, // 5 minutes (matching your JWT config)
// // //         });

// // //         res.status(HttpStatus.OK).json({
// // //           success: true,
// // //           message: "Login successful",
// // //           data: {
// // //             adminFound: result.adminFound,
// // //             // Don't send tokens in response body since they're in cookies
// // //           },
// // //         });
// // //       } else {
// // //         res.status(HttpStatus.UNAUTHORIZED).json({
// // //           success: false,
// // //           message: "Invalid credentials",
// // //         });
// // //       }
// // //     } catch (error) {
// // //       res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
// // //         success: false,
// // //         message: "Login failed",
// // //         error: error instanceof Error ? error.message : "Unknown error",
// // //       });
// // //     }
// // //   }

// // //   async logout(req: Request, res: Response): Promise<void> {
// // //     try {
// // //       const adminAuthService = DIContainer.getAdminAuthService();
// // //       const refreshToken = req.cookies?.refreshToken;
// // //       const userId = req.user?.id;

// // //       if (!userId || !refreshToken) {
// // //         res.status(HttpStatus.BAD_REQUEST).json({
// // //           success: false,
// // //           message: "Missing user ID or refresh token",
// // //         });
// // //         return;
// // //       }

// // //       const result = await adminAuthService.logout(userId, refreshToken);

// // //       if (result) {
// // //         // Clear cookies
// // //         res.clearCookie("accessToken", {
// // //           httpOnly: true,
// // //           secure: process.env.NODE_ENV === "production",
// // //           sameSite: "strict",
// // //         });
// // //         res.clearCookie("refreshToken", {
// // //           httpOnly: true,
// // //           secure: process.env.NODE_ENV === "production",
// // //           sameSite: "strict",
// // //         });

// // //         res.status(HttpStatus.OK).json({
// // //           success: true,
// // //           message: "Logout successful",
// // //         });
// // //       } else {
// // //         res.status(HttpStatus.BAD_REQUEST).json({
// // //           success: false,
// // //           message: "Logout failed",
// // //         });
// // //       }
// // //     } catch (error) {
// // //       res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
// // //         success: false,
// // //         message: "Logout failed",
// // //         error: error instanceof Error ? error.message : "Unknown error",
// // //       });
// // //     }
// // //   }

// // //   async refreshToken(req: Request, res: Response): Promise<void> {
// // //     try {
// // //       const adminAuthService = DIContainer.getAdminAuthService();
// // //       const refreshToken = req.cookies?.refreshToken;
// // //       const userId = req.user?.id;

// // //       console.log("Refresh token endpoint called");
// // //       console.log("User ID:", userId);
// // //       console.log("Refresh token present:", !!refreshToken);

// // //       if (!userId || !refreshToken) {
// // //         res.status(HttpStatus.UNAUTHORIZED).json({
// // //           success: false,
// // //           message: "Missing user ID or refresh token",
// // //         });
// // //         return;
// // //       }

// // //       const result = await adminAuthService.refreshAccessToken(
// // //         userId,
// // //         refreshToken
// // //       );

// // //       if (result) {
// // //         // Set new access token as cookie
// // //         res.cookie("accessToken", result.newAccessToken, {
// // //           httpOnly: true,
// // //           secure: process.env.NODE_ENV === "production",
// // //           sameSite: "strict",
// // //           maxAge: 2 * 60 * 1000, // 2 minutes
// // //         });

// // //         // If a new refresh token was generated, set it too
// // //         if (result.newRefreshToken) {
// // //           res.cookie("refreshToken", result.newRefreshToken, {
// // //             httpOnly: true,
// // //             secure: process.env.NODE_ENV === "production",
// // //             sameSite: "strict",
// // //             maxAge: 5 * 60 * 1000, // 5 minutes
// // //           });
// // //         }

// // //         res.status(HttpStatus.OK).json({
// // //           success: true,
// // //           message: "Token refreshed successfully",
// // //         });
// // //       } else {
// // //         res.status(HttpStatus.UNAUTHORIZED).json({
// // //           success: false,
// // //           message: "Invalid refresh token",
// // //         });
// // //       }
// // //     } catch (error) {
// // //       console.error("Refresh token error:", error);
// // //       res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
// // //         success: false,
// // //         message: "Token refresh failed",
// // //         error: error instanceof Error ? error.message : "Unknown error",
// // //       });
// // //     }
// // //   }
// // // }

// // // export default new AdminAuthController();
// // import { Request, Response } from "express";
// // import DIContainer from "../../inversify/conatainer";
// // import { HttpStatus } from "../../constants/HttpStatus";
// // import { AdminLoginDTO } from "../../dtos/adminDTO";

// // export class AdminAuthController {
// //   async login(req: Request, res: Response): Promise<void> {
// //     try {
// //       const adminAuthService = DIContainer.getAdminAuthService();
// //       const { adminEmail, adminPassword } = req.body as AdminLoginDTO;

// //       console.log("Login attempt for:", adminEmail);

// //       const result = await adminAuthService.login({
// //         adminEmail,
// //         adminPassword,
// //       });

// //       if (result) {
// //         console.log("Login successful, setting cookies");

// //         // Set access token cookie (30 seconds for testing)
// //         res.cookie("accessToken", result.accessToken, {
// //           httpOnly: true,
// //           secure: process.env.NODE_ENV === "production",
// //           sameSite: "strict",
// //           maxAge: 30 * 1000, // 30 seconds for testing
// //         });

// //         // Set refresh token cookie (2 minutes for testing)
// //         res.cookie("refreshToken", result.refreshToken, {
// //           httpOnly: true,
// //           secure: process.env.NODE_ENV === "production",
// //           sameSite: "strict",
// //           maxAge: 2 * 60 * 1000, // 2 minutes for testing
// //         });

// //         res.status(HttpStatus.OK).json({
// //           success: true,
// //           message: "Login successful",
// //           data: {
// //             adminFound: result.adminFound,
// //           },
// //         });
// //       } else {
// //         console.log("Login failed - invalid credentials");
// //         res.status(HttpStatus.UNAUTHORIZED).json({
// //           success: false,
// //           message: "Invalid credentials",
// //         });
// //       }
// //     } catch (error) {
// //       console.error("Login error:", error);
// //       res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
// //         success: false,
// //         message: "Login failed",
// //         error: error instanceof Error ? error.message : "Unknown error",
// //       });
// //     }
// //   }

// //   async logout(req: Request, res: Response): Promise<void> {
// //     try {
// //       const adminAuthService = DIContainer.getAdminAuthService();
// //       const refreshToken = req.cookies?.refreshToken;
// //       const userId = req.user?.id;

// //       console.log("Logout attempt for user:", userId);

// //       if (!userId || !refreshToken) {
// //         res.status(HttpStatus.BAD_REQUEST).json({
// //           success: false,
// //           message: "Missing user ID or refresh token",
// //         });
// //         return;
// //       }

// //       const result = await adminAuthService.logout(userId, refreshToken);

// //       if (result) {
// //         // Clear cookies
// //         res.clearCookie("accessToken", {
// //           httpOnly: true,
// //           secure: process.env.NODE_ENV === "production",
// //           sameSite: "strict",
// //         });
// //         res.clearCookie("refreshToken", {
// //           httpOnly: true,
// //           secure: process.env.NODE_ENV === "production",
// //           sameSite: "strict",
// //         });

// //         console.log("Logout successful, cookies cleared");
// //         res.status(HttpStatus.OK).json({
// //           success: true,
// //           message: "Logout successful",
// //         });
// //       } else {
// //         res.status(HttpStatus.BAD_REQUEST).json({
// //           success: false,
// //           message: "Logout failed",
// //         });
// //       }
// //     } catch (error) {
// //       console.error("Logout error:", error);
// //       res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
// //         success: false,
// //         message: "Logout failed",
// //         error: error instanceof Error ? error.message : "Unknown error",
// //       });
// //     }
// //   }

// //   async refreshToken(req: Request, res: Response): Promise<void> {
// //     try {
// //       const adminAuthService = DIContainer.getAdminAuthService();
// //       const refreshToken = req.cookies?.refreshToken;
// //       const userId = req.user?.id;

// //       console.log("🔄 Refresh token endpoint called");
// //       console.log("- User ID:", userId);
// //       console.log("- Refresh token present:", !!refreshToken);

// //       if (!userId || !refreshToken) {
// //         console.log("❌ Missing userId or refreshToken");
// //         res.status(HttpStatus.UNAUTHORIZED).json({
// //           success: false,
// //           message: "Missing user ID or refresh token",
// //         });
// //         return;
// //       }

// //       const result = await adminAuthService.refreshAccessToken(
// //         userId,
// //         refreshToken
// //       );

// //       if (result) {
// //         console.log("✅ Token refresh successful");

// //         // Set new access token cookie (30 seconds for testing)
// //         res.cookie("accessToken", result.newAccessToken, {
// //           httpOnly: true,
// //           secure: process.env.NODE_ENV === "production",
// //           sameSite: "strict",
// //           maxAge: 30 * 1000, // 30 seconds for testing
// //         });

// //         // ALWAYS set new refresh token for proper token rotation
// //         if (result.newRefreshToken) {
// //           console.log("🔄 Setting new refresh token (token rotation)");
// //           res.cookie("refreshToken", result.newRefreshToken, {
// //             httpOnly: true,
// //             secure: process.env.NODE_ENV === "production",
// //             sameSite: "strict",
// //             maxAge: 2 * 60 * 1000, // 2 minutes for testing
// //           });
// //         }

// //         res.status(HttpStatus.OK).json({
// //           success: true,
// //           message: "Token refreshed successfully",
// //         });
// //       } else {
// //         console.log("❌ Token refresh failed - invalid refresh token");
// //         res.status(HttpStatus.UNAUTHORIZED).json({
// //           success: false,
// //           message: "Invalid refresh token",
// //         });
// //       }
// //     } catch (error) {
// //       console.error("🚨 Refresh token error:", error);
// //       res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
// //         success: false,
// //         message: "Token refresh failed",
// //         error: error instanceof Error ? error.message : "Unknown error",
// //       });
// //     }
// //   }
// // }

// // export default new AdminAuthController();
// import { Request, Response } from "express";
// import DIContainer from "../../inversify/conatainer";
// import { HttpStatus } from "../../constants/HttpStatus";
// import { AdminLoginDTO } from "../../dtos/adminDTO";

// export class AdminAuthController {
//   async login(req: Request, res: Response): Promise<void> {
//     try {
//       console.log("🔐 === LOGIN ATTEMPT DEBUG ===");
//       console.log("🔐 Request body:", req.body);
//       console.log("🔐 Request headers:", req.headers);
//       console.log("🔐 Existing cookies:", req.cookies);

//       const adminAuthService = DIContainer.getAdminAuthService();
//       const { adminEmail, adminPassword } = req.body as AdminLoginDTO;

//       console.log("🔐 Login attempt for:", adminEmail);

//       const result = await adminAuthService.login({
//         adminEmail,
//         adminPassword,
//       });

//       if (result) {
//         console.log("🔐 Login successful, setting cookies");
//         console.log("🔐 Access token length:", result.accessToken.length);
//         console.log("🔐 Refresh token length:", result.refreshToken.length);
//         console.log("🔐 Admin found:", result.adminFound._id);

//         // Log environment for cookie settings
//         console.log("🔐 NODE_ENV:", process.env.NODE_ENV);
//         console.log(
//           "🔐 Cookie secure setting:",
//           process.env.NODE_ENV === "production"
//         );

//         // Set access token cookie (30 seconds for testing)
//         res.cookie("accessToken", result.accessToken, {
//           httpOnly: true,
//           secure: process.env.NODE_ENV === "production", // false in development
//           sameSite: "lax", // Changed from "strict" to "lax" for better compatibility
//           maxAge: 30 * 1000, // 30 seconds
//           path: "/", // Ensure path is set
//         });

//         // Set refresh token cookie (2 minutes for testing)
//         res.cookie("refreshToken", result.refreshToken, {
//           httpOnly: true,
//           secure: process.env.NODE_ENV === "production", // false in development
//           sameSite: "lax", // Changed from "strict" to "lax"
//           maxAge: 2 * 60 * 1000, // 2 minutes
//           path: "/", // Ensure path is set
//         });

//         console.log("🔐 Cookies set with options:");
//         console.log("🔐 - httpOnly: true");
//         console.log("🔐 - secure:", process.env.NODE_ENV === "production");
//         console.log("🔐 - sameSite: lax");
//         console.log("🔐 - path: /");

//         // Log response headers to verify cookies are being set
//         console.log(
//           "🔐 Response Set-Cookie headers:",
//           res.getHeaders()["set-cookie"]
//         );

//         res.status(HttpStatus.OK).json({
//           success: true,
//           message: "Login successful",
//           data: {
//             adminFound: result.adminFound,
//           },
//           debug: {
//             cookiesSet: true,
//             accessTokenSet: true,
//             refreshTokenSet: true,
//           },
//         });

//         console.log("🔐 === LOGIN RESPONSE SENT ===");
//       } else {
//         console.log("❌ Login failed - invalid credentials");
//         res.status(HttpStatus.UNAUTHORIZED).json({
//           success: false,
//           message: "Invalid credentials",
//         });
//       }
//     } catch (error) {
//       console.error("🚨 Login error:", error);
//       res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
//         success: false,
//         message: "Login failed",
//         error: error instanceof Error ? error.message : "Unknown error",
//       });
//     }
//   }

//   async logout(req: Request, res: Response): Promise<void> {
//     try {
//       console.log("🚪 === LOGOUT ATTEMPT DEBUG ===");
//       console.log("🚪 Request cookies:", req.cookies);

//       const adminAuthService = DIContainer.getAdminAuthService();
//       const refreshToken = req.cookies?.refreshToken;
//       const userId = req.user?.id;

//       console.log("🚪 Logout attempt for user:", userId);
//       console.log("🚪 Refresh token present:", !!refreshToken);

//       if (!userId || !refreshToken) {
//         res.status(HttpStatus.BAD_REQUEST).json({
//           success: false,
//           message: "Missing user ID or refresh token",
//         });
//         return;
//       }

//       const result = await adminAuthService.logout(userId, refreshToken);

//       if (result) {
//         // Clear cookies with same options used to set them
//         res.clearCookie("accessToken", {
//           httpOnly: true,
//           secure: process.env.NODE_ENV === "production",
//           sameSite: "lax",
//           path: "/",
//         });
//         res.clearCookie("refreshToken", {
//           httpOnly: true,
//           secure: process.env.NODE_ENV === "production",
//           sameSite: "lax",
//           path: "/",
//         });

//         console.log("🚪 Logout successful, cookies cleared");
//         res.status(HttpStatus.OK).json({
//           success: true,
//           message: "Logout successful",
//         });
//       } else {
//         res.status(HttpStatus.BAD_REQUEST).json({
//           success: false,
//           message: "Logout failed",
//         });
//       }
//     } catch (error) {
//       console.error("🚨 Logout error:", error);
//       res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
//         success: false,
//         message: "Logout failed",
//         error: error instanceof Error ? error.message : "Unknown error",
//       });
//     }
//   }

//   async refreshToken(req: Request, res: Response): Promise<void> {
//     try {
//       console.log("🔄 === REFRESH TOKEN ATTEMPT DEBUG ===");
//       console.log("🔄 Request cookies:", req.cookies);
//       console.log("🔄 Request headers:", req.headers);

//       const adminAuthService = DIContainer.getAdminAuthService();
//       const refreshToken = req.cookies?.refreshToken;
//       const userId = req.user?.id;

//       console.log("🔄 Refresh token endpoint called");
//       console.log("🔄 User ID:", userId);
//       console.log("🔄 Refresh token present:", !!refreshToken);

//       if (!userId || !refreshToken) {
//         console.log("❌ Missing userId or refreshToken");
//         res.status(HttpStatus.UNAUTHORIZED).json({
//           success: false,
//           message: "Missing user ID or refresh token",
//         });
//         return;
//       }

//       const result = await adminAuthService.refreshAccessToken(
//         userId,
//         refreshToken
//       );

//       if (result) {
//         console.log("✅ Token refresh successful");

//         // Set new access token cookie
//         res.cookie("accessToken", result.newAccessToken, {
//           httpOnly: true,
//           secure: process.env.NODE_ENV === "production",
//           sameSite: "lax",
//           maxAge: 30 * 1000, // 30 seconds
//           path: "/",
//         });

//         // Set new refresh token for proper token rotation
//         if (result.newRefreshToken) {
//           console.log("🔄 Setting new refresh token (token rotation)");
//           res.cookie("refreshToken", result.newRefreshToken, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === "production",
//             sameSite: "lax",
//             maxAge: 2 * 60 * 1000, // 2 minutes
//             path: "/",
//           });
//         }

//         console.log(
//           "🔄 Response Set-Cookie headers:",
//           res.getHeaders()["set-cookie"]
//         );

//         res.status(HttpStatus.OK).json({
//           success: true,
//           message: "Token refreshed successfully",
//           debug: {
//             newAccessTokenSet: true,
//             newRefreshTokenSet: !!result.newRefreshToken,
//           },
//         });
//       } else {
//         console.log("❌ Token refresh failed - invalid refresh token");
//         res.status(HttpStatus.UNAUTHORIZED).json({
//           success: false,
//           message: "Invalid refresh token",
//         });
//       }
//     } catch (error) {
//       console.error("🚨 Refresh token error:", error);
//       res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
//         success: false,
//         message: "Token refresh failed",
//         error: error instanceof Error ? error.message : "Unknown error",
//       });
//     }
//   }
// }

// export default new AdminAuthController();
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
          maxAge: 5 * 60 * 1000, // 5 minutes (longer than JWT 30s expiry)
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
          maxAge: 5 * 60 * 1000, // 5 minutes (longer than JWT 30s expiry)
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
