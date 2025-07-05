// import { NextFunction, Request, Response } from "express";
// import { ApiError } from "../../middlewares/errorHandler";
// import ApiResponse from "../../utils/apiResponse";
// import { IUserService } from "../../services/interface/IUserService";
// import UserService from "../../services/implementations/UserService";
// import { createClient } from "@redis/client";
// import { getIO } from "../../utils/socket/chat";
// import { HttpStatus } from "../../constants/HttpStatus";

// interface AuthUser {
//   id: string;
//   role?: string[];
//   rawToken?: string;
// }

// const redisClient = createClient({ url: process.env.REDIS_URL });

// redisClient.on("error", (err) => console.error("Redis connection error:", err));
// redisClient.on("connect", () =>
//   console.log("Redis connected in UserController")
// );

// (async () => {
//   try {
//     await redisClient.connect();
//   } catch (err) {
//     console.error("Failed to connect to Redis in UserController:", err);
//   }
// })();

// class UserController {
//   private UserService: IUserService;

//   constructor() {
//     this.UserService = new UserService();
//   }

//   public validateSuccessResponse = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       console.log("UserController validateSuccessResponse step 1");

//       res
//         .status(HttpStatus.OK)
//         .json(new ApiResponse(HttpStatus.OK, null, "Success"));
//     } catch (error) {
//       console.error("Error in validateSuccessResponse:", error);
//       next(error);
//     }
//   };

//   public editUserProfile = async (
//     req: Request & { user?: AuthUser },
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       console.log("UserController editUserProfile step 1", { user: req.user });

//       const id = req.user?.id;
//       if (!id) {
//         throw new ApiError(HttpStatus.UNAUTHORIZED, "User not authenticated");
//       }

//       const payload = req.body;
//       console.log("UserController editUserProfile step 2", { payload });

//       const updatedUser = await this.UserService.editUserProfile(id, payload);
//       if (!updatedUser) {
//         throw new ApiError(HttpStatus.NOT_FOUND, "User not found");
//       }

//       console.log("UserController editUserProfile step 3", { updatedUser });

//       res
//         .status(HttpStatus.OK)
//         .json(
//           new ApiResponse(
//             HttpStatus.OK,
//             updatedUser,
//             "Profile updated successfully"
//           )
//         );
//     } catch (error) {
//       console.error("Error in editUserProfile:", error);
//       next(error);
//     }
//   };

//   public resetPassword = async (
//     req: Request & { user?: AuthUser },
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       console.log("UserController resetPassword step 1", { body: req.body });

//       const { currentPassword, newPassword } = req.body;
//       const id = req.user?.id;

//       if (!id) {
//         throw new ApiError(HttpStatus.UNAUTHORIZED, "User not authenticated");
//       }
//       if (!currentPassword || !newPassword) {
//         throw new ApiError(
//           HttpStatus.BAD_REQUEST,
//           "Current password and new password are required"
//         );
//       }

//       const result = await this.UserService.updatePassword(
//         id,
//         currentPassword,
//         newPassword
//       );
//       if (!result.success) {
//         throw new ApiError(HttpStatus.BAD_REQUEST, result.message);
//       }

//       console.log("UserController resetPassword step 2", {
//         message: result.message,
//       });

//       res
//         .status(HttpStatus.OK)
//         .json(new ApiResponse(HttpStatus.OK, null, result.message));
//     } catch (error) {
//       console.error("Error in resetPassword:", error);
//       next(error);
//     }
//   };

//   public updateOnlineStatus = async (
//     req: Request & { user?: AuthUser },
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       console.log("UserController updateOnlineStatus step 1", {
//         user: req.user,
//         body: req.body,
//       });

//       const { isOnline, role } = req.body;
//       const userId = req.user?.id;

//       if (!userId || typeof isOnline !== "boolean") {
//         throw new ApiError(
//           HttpStatus.BAD_REQUEST,
//           "User ID and valid isOnline status are required"
//         );
//       }

//       if (role && !["mentor", "mentee"].includes(role)) {
//         throw new ApiError(HttpStatus.BAD_REQUEST, "Invalid role");
//       }

//       // Update Redis
//       try {
//         if (isOnline) {
//           await redisClient.sAdd("online_users", userId);
//           console.log("UserController updateOnlineStatus step 2", {
//             userId,
//             action: "added to online_users",
//           });
//         } else {
//           await redisClient.sRem("online_users", userId);
//           console.log("UserController updateOnlineStatus step 2", {
//             userId,
//             action: "removed from online_users",
//           });
//         }
//       } catch (err) {
//         console.error("Redis operation error:", err);
//         throw new ApiError(
//           HttpStatus.INTERNAL_SERVER_ERROR,
//           "Failed to update Redis online status"
//         );
//       }

//       // Emit Socket.IO event
//       try {
//         const io = getIO();
//         io.emit("userStatus", { userId, isOnline });
//         console.log("UserController updateOnlineStatus step 3", {
//           userId,
//           isOnline,
//           action: "emitted userStatus",
//         });
//       } catch (err) {
//         console.warn("Socket.IO emit error:", err);
//         // Non-critical, proceed with database update
//       }

//       // Update database
//       const updatedUser = await this.UserService.updateOnlineStatus(
//         userId,
//         isOnline,
//         role ? (role as "mentor" | "mentee") : null
//       );
//       if (!updatedUser) {
//         throw new ApiError(
//           HttpStatus.INTERNAL_SERVER_ERROR,
//           "Failed to update database online status"
//         );
//       }

//       console.log("UserController updateOnlineStatus step 4", { updatedUser });

//       res
//         .status(HttpStatus.OK)
//         .json(
//           new ApiResponse(
//             HttpStatus.OK,
//             updatedUser,
//             "Online status updated successfully"
//           )
//         );
//     } catch (error) {
//       console.error("Error in updateOnlineStatus:", error);
//       next(error);
//     }
//   };
// }

// export default new UserController();
