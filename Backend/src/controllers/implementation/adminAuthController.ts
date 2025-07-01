// // // import { Request, Response } from "express";
// // // import { ApiError } from "../../middlewares/errorHandler";
// // // import ApiResponse from "../../utils/apiResponse";
// // // import AdminAuthService from "../../services/implementations/AdminAuthService";
// // // import { HttpStatus } from "../../constants/HttpStatus";

// // // class AdminAuthController {
// // //   private adminAuthService: AdminAuthService;

// // //   public options = {
// // //     httpOnly: true,
// // //     secure: process.env.NODE_ENV === "production",
// // //     sameSite: "strict" as const,
// // //     path: "/",
// // //     maxAge: 7 * 24 * 60 * 60 * 1000,
// // //   };

// // //   constructor() {
// // //     this.adminAuthService = new AdminAuthService();
// // //   }

// // //   // Login
// // //   public login = async (req: Request, res: Response): Promise<void> => {
// // //     console.log("Controller - Login request received:", req.body);
// // //     const loginData = await this.adminAuthService.login(req.body);
// // //     console.log("Controller - Login service response:", loginData);

// // //     if (!loginData) {
// // //       console.log("Controller - Login failed: Invalid credentials");
// // //       res
// // //         .status(HttpStatus.BAD_REQUEST)
// // //         .json(
// // //           new ApiResponse(
// // //             HttpStatus.BAD_REQUEST,
// // //             null,
// // //             "Invalid email or password"
// // //           )
// // //         );
// // //       return;
// // //     }

// // //     console.log("Controller - Login successful login data is", loginData);

// // //     res
// // //       .status(HttpStatus.OK)
// // //       .cookie("adminRefreshToken", loginData.refreshToken, this.options)
// // //       .json(new ApiResponse(HttpStatus.OK, loginData));
// // //     return;
// // //   };

// // //   // Logout
// // //   public logout = async (req: Request, res: Response) => {
// // //     // Assert that req.user is defined since middleware guarantees it
// // //     const { rawToken, id } = req.user!;
// // //     console.log("admin logout step 1", rawToken, id);

// // //     const logoutData = await this.adminAuthService.logout(rawToken, id);
// // //     console.log("admin logout step 2", logoutData);
// // //     if (logoutData) {
// // //       console.log("admin logout step 3 error");
// // //       res
// // //         .status(HttpStatus.OK)
// // //         .clearCookie("adminRefreshToken")
// // //         .json(
// // //           new ApiResponse(
// // //             HttpStatus.OK,
// // //             { message: "successfully cleared the token" },
// // //             "logout success"
// // //           )
// // //         );
// // //       console.log("admin logout step 3 success");
// // //       return;
// // //     }

// // //     res
// // //       .status(HttpStatus.INTERNAL_SERVER_ERROR)
// // //       .json(
// // //         new ApiResponse(
// // //           HttpStatus.INTERNAL_SERVER_ERROR,
// // //           null,
// // //           "Something Went Wrong Clear your Browser Cookies"
// // //         )
// // //       );
// // //     console.log("admin logout step 4 error 500");
// // //     return;
// // //   };

// // //   // Refresh Access Token
// // //   public refreshAccessToken = async (req: Request, res: Response) => {
// // //     // Assert that req.user is defined since middleware guarantees it
// // //     const { id } = req.user!;
// // //     console.log("admin refreshAccessToken step1 ");
// // //     const accessToken = await this.adminAuthService.refreshAccessToken(id);
// // //     console.log("admin refreshAccessToken step2 ", accessToken);
// // //     if (accessToken) {
// // //       console.log("admin refreshAccessToken step3 have token");
// // //       res
// // //         .status(HttpStatus.OK)
// // //         .json(
// // //           new ApiResponse(
// // //             HttpStatus.OK,
// // //             { accessToken },
// // //             "token Created Successfully"
// // //           )
// // //         );
// // //       console.log("admin refreshAccessToken step4 no token");
// // //       return;
// // //     }
// // //     // Add error handling if needed
// // //     console.log("admin refreshAccessToken step6 error ");
// // //     res
// // //       .status(HttpStatus.INTERNAL_SERVER_ERROR)
// // //       .json(
// // //         new ApiResponse(
// // //           HttpStatus.INTERNAL_SERVER_ERROR,
// // //           null,
// // //           "Failed to refresh token"
// // //         )
// // //       );
// // //   };
// // // }

// // // export default new AdminAuthController();
// import { Request, Response } from "express";
// import DIContainer from "../../inversify/conatainer";
// import { HttpStatus } from "../../constants/HttpStatus";

// export class AdminAuthController {
//   async login(req: Request, res: Response): Promise<void> {
//     try {
//       const adminAuthService = DIContainer.getAdminAuthService();
//       const { adminEmail, adminPassword } = req.body;

//       const result = await adminAuthService.login({
//         adminEmail,
//         adminPassword,
//       });

//       if (result) {
//         res.status(HttpStatus.OK).json({
//           success: true,
//           message: "Login successful",
//           data: result,
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
//       const { refreshToken } = req.body;
//       const userId = req.user?.id;

//       const result = await adminAuthService.logout(refreshToken, userId);

//       if (result) {
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
//       const { refreshToken } = req.body;
//       const userId = req.user?.id;

//       const newAccessToken = await adminAuthService.refreshAccessToken(
//         userId,
//         refreshToken
//       );

//       if (newAccessToken) {
//         res.status(HttpStatus.OK).json({
//           success: true,
//           message: "Token refreshed successfully",
//           data: { accessToken: newAccessToken },
//         });
//       } else {
//         res.status(HttpStatus.UNAUTHORIZED).json({
//           success: false,
//           message: "Invalid refresh token",
//         });
//       }
//     } catch (error) {
//       res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
//         success: false,
//         message: "Token refresh failed",
//         error: error instanceof Error ? error.message : "Unknown error",
//       });
//     }
//   }
// }

// export default new AdminAuthController();
// // import { Request, Response } from "express";
// // import jwt from "jsonwebtoken";
// // import RedisTokenService from "../../services/implementations/RedisTokenService";
// // import { TAdminLogin } from "@/types/admin";

// // export class AdminAuthController {
// //   async login(req: Request, res: Response) {
// //     const { adminEmail, adminPassword }: TAdminLogin = req.body;
// //     console.log("Admin login attempt:", adminEmail);

// //     try {
// //       // Replace with actual admin validation (e.g., database check)
// //       const adminFound = {
// //         id: "admin123",
// //         email: adminEmail,
// //         role: ["admin"],
// //       };

// //       // Replace with actual password check
// //       const isPasswordValid = true; // await bcrypt.compare(adminPassword, storedHash);

// //       if (!isPasswordValid) {
// //         return res
// //           .status(401)
// //           .json({ success: false, error: "Invalid credentials" });
// //       }

// //       const accessToken = jwt.sign(
// //         { id: adminFound.id, role: adminFound.role },
// //         process.env.ACCESS_TOKEN_SECRET || "secret",
// //         { expiresIn: "15m" }
// //       );
// //       const refreshToken = jwt.sign(
// //         { id: adminFound.id, role: adminFound.role },
// //         process.env.REFRESH_TOKEN_SECRET || "secret",
// //         { expiresIn: "7d" }
// //       );

// //       await RedisTokenService.saveRefreshToken(adminFound.id, refreshToken);

// //       res.cookie("refreshToken", refreshToken, {
// //         httpOnly: true,
// //         secure: process.env.NODE_ENV === "production",
// //         sameSite: "strict",
// //         maxAge: 7 * 24 * 60 * 60 * 1000,
// //       });

// //       return res.status(200).json({
// //         success: true,
// //         data: { adminFound, accessToken },
// //       });
// //     } catch (error) {
// //       console.error("Login error:", error);
// //       return res.status(500).json({ success: false, error: "Server error" });
// //     }
// //   }

// //   async logout(req: Request, res: Response) {
// //     const userId = req.user?.id;
// //     console.log("Logout attempt for user:", userId);

// //     if (!userId) {
// //       return res.status(401).json({ success: false, error: "Unauthorized" });
// //     }

// //     try {
// //       await RedisTokenService.removeAllUserTokens(userId);
// //       res.clearCookie("refreshToken", {
// //         httpOnly: true,
// //         secure: process.env.NODE_ENV === "production",
// //         sameSite: "strict",
// //       });
// //       return res.status(200).json({ success: true });
// //     } catch (error) {
// //       console.error("Logout error:", error);
// //       return res.status(500).json({ success: false, error: "Server error" });
// //     }
// //   }

// //   async refreshToken(req: Request, res: Response) {
// //     const userId = req.user?.id;
// //     console.log("Refresh token attempt for user:", userId);

// //     if (!userId) {
// //       return res.status(401).json({ success: false, error: "Unauthorized" });
// //     }

// //     try {
// //       const accessToken = jwt.sign(
// //         { id: userId, role: ["admin"] },
// //         process.env.ACCESS_TOKEN_SECRET || "secret",
// //         { expiresIn: "15m" }
// //       );

// //       return res.status(200).json({
// //         success: true,
// //         accessToken,
// //       });
// //     } catch (error) {
// //       console.error("Refresh token error:", error);
// //       return res.status(500).json({ success: false, error: "Server error" });
// //     }
// //   }
// // }

// // export default new AdminAuthController();
// src/controllers/implementation/AdminAuthController.ts
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
