// // // src/controllers/implementation/AdminAuthController.ts
// // import { Request, Response } from "express";
// // import DIContainer from "../../inversify/conatainer";
// // import { HttpStatus } from "../../constants/HttpStatus";
// // import { AdminLoginDTO } from "../../dtos/adminDTO";

// // export class AdminAuthController {
// //   async login(req: Request, res: Response): Promise<void> {
// //     try {
// //       const adminAuthService = DIContainer.getAdminAuthService();
// //       const { adminEmail, adminPassword } = req.body as AdminLoginDTO;

// //       const result = await adminAuthService.login({
// //         adminEmail,
// //         adminPassword,
// //       });

// //       if (result) {
// //         // Set access token and refresh token as HTTP-only cookies
// //         res.cookie("accessToken", result.accessToken, {
// //           httpOnly: true,
// //           secure: process.env.NODE_ENV === "production",
// //           sameSite: "strict",
// //           maxAge: 20 * 60 * 1000, // 20 minutes
// //         });
// //         res.cookie("refreshToken", result.refreshToken, {
// //           httpOnly: true,
// //           secure: process.env.NODE_ENV === "production",
// //           sameSite: "strict",
// //           maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
// //         });

// //         res.status(HttpStatus.OK).json({
// //           success: true,
// //           message: "Login successful",
// //           data: { adminFound: result.adminFound },
// //         });
// //       } else {
// //         res.status(HttpStatus.UNAUTHORIZED).json({
// //           success: false,
// //           message: "Invalid credentials",
// //         });
// //       }
// //     } catch (error) {
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
// //         res.clearCookie("accessToken");
// //         res.clearCookie("refreshToken");

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

// //       if (!userId || !refreshToken) {
// //         res.status(HttpStatus.BAD_REQUEST).json({
// //           success: false,
// //           message: "Missing user ID or refresh token",
// //         });
// //         return;
// //       }

// //       const newAccessToken = await adminAuthService.refreshAccessToken(
// //         userId,
// //         refreshToken
// //       );

// //       if (newAccessToken) {
// //         // Set new access token as cookie
// //         res.cookie("accessToken", newAccessToken, {
// //           httpOnly: true,
// //           secure: process.env.NODE_ENV === "production",
// //           sameSite: "strict",
// //           maxAge: 20 * 60 * 1000, // 20 minutes
// //         });

// //         res.status(HttpStatus.OK).json({
// //           success: true,
// //           message: "Token refreshed successfully",
// //         });
// //       } else {
// //         res.status(HttpStatus.UNAUTHORIZED).json({
// //           success: false,
// //           message: "Invalid refresh token",
// //         });
// //       }
// //     } catch (error) {
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
//       const adminAuthService = DIContainer.getAdminAuthService();
//       const { adminEmail, adminPassword } = req.body as AdminLoginDTO;

//       const result = await adminAuthService.login({
//         adminEmail,
//         adminPassword,
//       });

//       if (result) {
//         // Set access token and refresh token as HTTP-only cookies
//         res.cookie("accessToken", result.accessToken, {
//           httpOnly: true,
//           secure: process.env.NODE_ENV === "production",
//           sameSite: "strict",
//           maxAge: 2 * 60 * 1000, // 2 minutes (matching your JWT config)
//         });

//         res.cookie("refreshToken", result.refreshToken, {
//           httpOnly: true,
//           secure: process.env.NODE_ENV === "production",
//           sameSite: "strict",
//           maxAge: 5 * 60 * 1000, // 5 minutes (matching your JWT config)
//         });

//         res.status(HttpStatus.OK).json({
//           success: true,
//           message: "Login successful",
//           data: {
//             adminFound: result.adminFound,
//             // Don't send tokens in response body since they're in cookies
//           },
//         });
//       } else {
//         res.status(HttpStatus.UNAUTHORIZED).json({
//           success: false,
//           message: "Invalid credentials",
//         });
//       }
//     } catch (error) {
//       res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
//         success: false,
//         message: "Login failed",
//         error: error instanceof Error ? error.message : "Unknown error",
//       });
//     }
//   }

//   async logout(req: Request, res: Response): Promise<void> {
//     try {
//       const adminAuthService = DIContainer.getAdminAuthService();
//       const refreshToken = req.cookies?.refreshToken;
//       const userId = req.user?.id;

//       if (!userId || !refreshToken) {
//         res.status(HttpStatus.BAD_REQUEST).json({
//           success: false,
//           message: "Missing user ID or refresh token",
//         });
//         return;
//       }

//       const result = await adminAuthService.logout(userId, refreshToken);

//       if (result) {
//         // Clear cookies
//         res.clearCookie("accessToken", {
//           httpOnly: true,
//           secure: process.env.NODE_ENV === "production",
//           sameSite: "strict",
//         });
//         res.clearCookie("refreshToken", {
//           httpOnly: true,
//           secure: process.env.NODE_ENV === "production",
//           sameSite: "strict",
//         });

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
//       res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
//         success: false,
//         message: "Logout failed",
//         error: error instanceof Error ? error.message : "Unknown error",
//       });
//     }
//   }

//   async refreshToken(req: Request, res: Response): Promise<void> {
//     try {
//       const adminAuthService = DIContainer.getAdminAuthService();
//       const refreshToken = req.cookies?.refreshToken;
//       const userId = req.user?.id;

//       console.log("Refresh token endpoint called");
//       console.log("User ID:", userId);
//       console.log("Refresh token present:", !!refreshToken);

//       if (!userId || !refreshToken) {
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
//         // Set new access token as cookie
//         res.cookie("accessToken", result.newAccessToken, {
//           httpOnly: true,
//           secure: process.env.NODE_ENV === "production",
//           sameSite: "strict",
//           maxAge: 2 * 60 * 1000, // 2 minutes
//         });

//         // If a new refresh token was generated, set it too
//         if (result.newRefreshToken) {
//           res.cookie("refreshToken", result.newRefreshToken, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === "production",
//             sameSite: "strict",
//             maxAge: 5 * 60 * 1000, // 5 minutes
//           });
//         }

//         res.status(HttpStatus.OK).json({
//           success: true,
//           message: "Token refreshed successfully",
//         });
//       } else {
//         res.status(HttpStatus.UNAUTHORIZED).json({
//           success: false,
//           message: "Invalid refresh token",
//         });
//       }
//     } catch (error) {
//       console.error("Refresh token error:", error);
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
      const adminAuthService = DIContainer.getAdminAuthService();
      const { adminEmail, adminPassword } = req.body as AdminLoginDTO;

      console.log("Login attempt for:", adminEmail);

      const result = await adminAuthService.login({
        adminEmail,
        adminPassword,
      });

      if (result) {
        console.log("Login successful, setting cookies");

        // Set access token cookie (30 seconds for testing)
        res.cookie("accessToken", result.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 30 * 1000, // 30 seconds for testing
        });

        // Set refresh token cookie (2 minutes for testing)
        res.cookie("refreshToken", result.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 2 * 60 * 1000, // 2 minutes for testing
        });

        res.status(HttpStatus.OK).json({
          success: true,
          message: "Login successful",
          data: {
            adminFound: result.adminFound,
          },
        });
      } else {
        console.log("Login failed - invalid credentials");
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: "Invalid credentials",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
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

      console.log("Logout attempt for user:", userId);

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
        res.clearCookie("accessToken", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
        res.clearCookie("refreshToken", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });

        console.log("Logout successful, cookies cleared");
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
      console.error("Logout error:", error);
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

      console.log("🔄 Refresh token endpoint called");
      console.log("- User ID:", userId);
      console.log("- Refresh token present:", !!refreshToken);

      if (!userId || !refreshToken) {
        console.log("❌ Missing userId or refreshToken");
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: "Missing user ID or refresh token",
        });
        return;
      }

      const result = await adminAuthService.refreshAccessToken(
        userId,
        refreshToken
      );

      if (result) {
        console.log("✅ Token refresh successful");

        // Set new access token cookie (30 seconds for testing)
        res.cookie("accessToken", result.newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 30 * 1000, // 30 seconds for testing
        });

        // ALWAYS set new refresh token for proper token rotation
        if (result.newRefreshToken) {
          console.log("🔄 Setting new refresh token (token rotation)");
          res.cookie("refreshToken", result.newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 2 * 60 * 1000, // 2 minutes for testing
          });
        }

        res.status(HttpStatus.OK).json({
          success: true,
          message: "Token refreshed successfully",
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
