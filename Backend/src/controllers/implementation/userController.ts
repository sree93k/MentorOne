import { injectable, inject } from "inversify";
import { NextFunction, Request, Response } from "express";
import { ApiError } from "../../middlewares/errorHandler";
import ApiResponse from "../../utils/apiResponse";
import { IUserService } from "../../services/interface/IUserService";
import { TYPES } from "../../inversify/types";
import { createClient } from "@redis/client";
import { getIO } from "../../utils/socket/chat";
import { HttpStatus } from "../../constants/HttpStatus";
import {
  UserNotFoundError,
  UserUnauthorizedError,
  UserValidationError,
} from "../../utils/exceptions/UserExceptions";
interface AuthUser {
  id: string;
  role?: string[];
  rawToken?: string;
}

const redisClient = createClient({ url: process.env.REDIS_URL });

redisClient.on("error", (err) => console.error("Redis connection error:", err));
redisClient.on("connect", () =>
  console.log("Redis connected in UserController")
);

(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.error("Failed to connect to Redis in UserController:", err);
  }
})();

@injectable()
class UserController {
  private UserService: IUserService;

  constructor(
    @inject(TYPES.IUserService) userService: IUserService
  ) {
    this.UserService = userService;
  }

  public validateSuccessResponse = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("UserController validateSuccessResponse step 1");

      res
        .status(HttpStatus.OK)
        .json(new ApiResponse(HttpStatus.OK, null, "Success"));
    } catch (error) {
      console.error("Error in validateSuccessResponse:", error);
      next(error);
    }
  };

  public editUserProfile = async (
    req: Request & { user?: AuthUser },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("UserController editUserProfile step 1", { user: req.user });

      const id = req.user?.id;
      if (!id) {
        throw new ApiError(HttpStatus.UNAUTHORIZED, "User not authenticated");
      }

      const payload = req.body;
      console.log("UserController editUserProfile step 2", { payload });

      const updatedUser = await this.UserService.editUserProfile(id, payload);
      if (!updatedUser) {
        throw new ApiError(HttpStatus.NOT_FOUND, "User not found");
      }

      console.log("UserController editUserProfile step 3", { updatedUser });

      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            updatedUser,
            "Profile updated successfully"
          )
        );
    } catch (error) {
      console.error("Error in editUserProfile:", error);
      next(error);
    }
  };

  public resetPassword = async (
    req: Request & { user?: AuthUser },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("UserController resetPassword step 1", { body: req.body });

      const { currentPassword, newPassword } = req.body;
      const id = req.user?.id;

      if (!id) {
        throw new ApiError(HttpStatus.UNAUTHORIZED, "User not authenticated");
      }
      if (!currentPassword || !newPassword) {
        throw new ApiError(
          HttpStatus.BAD_REQUEST,
          "Current password and new password are required"
        );
      }

      const result = await this.UserService.updatePassword(
        id,
        currentPassword,
        newPassword
      );
      if (!result.success) {
        throw new ApiError(HttpStatus.BAD_REQUEST, result.message);
      }

      console.log("UserController resetPassword step 2", {
        message: result.message,
      });

      res
        .status(HttpStatus.OK)
        .json(new ApiResponse(HttpStatus.OK, null, result.message));
    } catch (error) {
      console.error("Error in resetPassword:", error);
      next(error);
    }
  };

  public updateOnlineStatus = async (
    req: Request & { user?: AuthUser },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("UserController updateOnlineStatus step 1.0");
      console.log("UserController updateOnlineStatus step 1", {
        user: req.user,
        body: req.body,
      });

      const { isOnline, role } = req.body;
      const userId = req.user?.id;

      if (!userId || typeof isOnline !== "boolean") {
        throw new ApiError(
          HttpStatus.BAD_REQUEST,
          "User ID and valid isOnline status are required"
        );
      }

      if (role && !["mentor", "mentee"].includes(role)) {
        throw new ApiError(HttpStatus.BAD_REQUEST, "Invalid role");
      }

      // Update Redis
      try {
        if (isOnline) {
          await redisClient.sAdd("online_users", userId);
          console.log("UserController updateOnlineStatus step 2", {
            userId,
            action: "added to online_users",
          });
        } else {
          await redisClient.sRem("online_users", userId);
          console.log("UserController updateOnlineStatus step 2", {
            userId,
            action: "removed from online_users",
          });
        }
      } catch (err) {
        console.error("Redis operation error:", err);
        throw new ApiError(
          HttpStatus.INTERNAL_SERVER_ERROR,
          "Failed to update Redis online status"
        );
      }
      console.log("any sample codes.....");

      // Emit Socket.IO event
      try {
        const io = getIO();
        io.emit("userStatus", { userId, isOnline });
        console.log("UserController updateOnlineStatus step 3", {
          userId,
          isOnline,
          action: "emitted userStatus",
        });
      } catch (err) {
        console.warn("Socket.IO emit error:", err);
        // Non-critical, proceed with database update
      }

      // Update database
      const updatedUser = await this.UserService.updateOnlineStatus(
        userId,
        isOnline,
        role ? (role as "mentor" | "mentee") : null
      );
      if (!updatedUser) {
        throw new ApiError(
          HttpStatus.INTERNAL_SERVER_ERROR,
          "Failed to update database online status"
        );
      }

      console.log("UserController updateOnlineStatus step 4", { updatedUser });

      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            updatedUser,
            "Online status updated successfully"
          )
        );
    } catch (error) {
      console.error("Error in updateOnlineStatus:", error);
      next(error);
    }
  };

  public checkUserBlockStatus = async (
    req: Request & { user?: AuthUser },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const requestId = `req_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    console.log("🎯 UserController: checkUserBlockStatus started", {
      requestId,
      params: req.params,
      requestingUser: req.user?.id,
      timestamp: new Date().toISOString(),
    });

    try {
      // 🎯 STEP 1: Extract and validate request data
      const { userId } = req.params;
      const requestingUserId = req.user?.id;

      console.log("🎯 UserController: Step 1 - Extracting request data", {
        requestId,
        userId,
        requestingUserId,
      });

      // Basic request validation
      if (!requestingUserId) {
        console.error("❌ UserController: No authenticated user", {
          requestId,
        });

        res
          .status(HttpStatus.UNAUTHORIZED)
          .json(
            new ApiResponse(
              HttpStatus.UNAUTHORIZED,
              null,
              "Authentication required"
            )
          );
        return;
      }

      if (!userId) {
        console.error("❌ UserController: No userId parameter", { requestId });

        res
          .status(HttpStatus.BAD_REQUEST)
          .json(
            new ApiResponse(
              HttpStatus.BAD_REQUEST,
              null,
              "User ID parameter is required"
            )
          );
        return;
      }

      console.log("✅ UserController: Request validation passed", {
        requestId,
      });

      // 🎯 STEP 2: Call service layer
      console.log("🎯 UserController: Step 2 - Calling service layer", {
        requestId,
      });

      const blockStatusResult = await this.UserService.checkUserBlockStatus(
        userId,
        requestingUserId
      );

      console.log("✅ UserController: Service call completed successfully", {
        requestId,
        isBlocked: blockStatusResult.isBlocked,
        cacheHit: blockStatusResult.cacheHit,
      });

      // 🎯 STEP 3: Format and send response
      console.log("🎯 UserController: Step 3 - Sending response", {
        requestId,
      });

      const response = new ApiResponse(
        HttpStatus.OK,
        {
          blockStatus: blockStatusResult,
          meta: {
            requestId,
            timestamp: new Date().toISOString(),
            cacheHit: blockStatusResult.cacheHit || false,
          },
        },
        "Block status retrieved successfully"
      );

      res.status(HttpStatus.OK).json(response);

      console.log(
        "✅ UserController: checkUserBlockStatus completed successfully",
        {
          requestId,
          responseSize: JSON.stringify(response).length,
        }
      );
    } catch (error: any) {
      console.error("❌ UserController: checkUserBlockStatus failed", {
        requestId,
        error: error.message,
        errorType: error.constructor.name,
        stack: error.stack,
      });

      // Handle specific custom exceptions
      if (error instanceof UserNotFoundError) {
        res.status(error.statusCode).json(
          new ApiResponse(
            error.statusCode,
            {
              error: {
                code: error.code,
                requestId,
                context: error.context,
                timestamp: new Date().toISOString(),
              },
            },
            error.message
          )
        );
        return;
      }

      if (error instanceof UserUnauthorizedError) {
        res.status(error.statusCode).json(
          new ApiResponse(
            error.statusCode,
            {
              error: {
                code: error.code,
                requestId,
                context: error.context,
                timestamp: new Date().toISOString(),
              },
            },
            error.message
          )
        );
        return;
      }

      if (error instanceof UserValidationError) {
        res.status(error.statusCode).json(
          new ApiResponse(
            error.statusCode,
            {
              error: {
                code: error.code,
                requestId,
                context: error.context,
                timestamp: new Date().toISOString(),
              },
            },
            error.message
          )
        );
        return;
      }

      // Handle unexpected errors
      console.error("💥 UserController: Unexpected error", {
        requestId,
        error: error.message,
        stack: error.stack,
      });

      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
        new ApiResponse(
          HttpStatus.INTERNAL_SERVER_ERROR,
          {
            error: {
              code: "INTERNAL_ERROR",
              requestId,
              timestamp: new Date().toISOString(),
            },
          },
          "Internal server error occurred"
        )
      );

      // Pass to error handling middleware
      next(error);
    }
  };
}

export default UserController;
