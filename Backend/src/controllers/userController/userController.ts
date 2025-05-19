import { NextFunction, Request, Response } from "express";
import ApiResponse from "../../utils/apiResponse";
import { inUserService } from "../../services/interface/inUserService";
import imUserService from "../../services/implementations/imUserService";
import { createClient } from "@redis/client";
import { getIO } from "../../utils/socket/chat";

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
class UserController {
  private UserService: inUserService;
  constructor() {
    this.UserService = new imUserService();
  }

  public validateSuccessResponse = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      res.status(200).json(new ApiResponse(200, null, "Success"));
      return;
    } catch (error) {
      next(error);
    }
  };

  //editUserProfile
  public editUserProfile = async (
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("mentee copntroller editUserProfile step 1", req.user);

      const id = req.user?.id;
      if (!id) {
        console.log("mentee copntroller editUserProfile step 2");
        res.status(401).json(new ApiResponse(401, null, "Unauthorized"));
        return;
      }
      console.log("mentee copntroller editUserProfile step 3");
      const payload = req.body;
      console.log("mentee copntroller editUserProfile step 4", payload);
      const updatedUser = await this.UserService.editUserProfile(id, payload);
      console.log("mentee copntroller editUserProfile step 5", updatedUser);
      if (!updatedUser) {
        console.log("mentee copntroller editUserProfile step 6");
        res.status(404).json(new ApiResponse(404, null, "User not found"));
        return;
      }
      console.log("mentee copntroller editUserProfile step 7");
      res
        .status(200)
        .json(
          new ApiResponse(200, updatedUser, "Profile updated successfully")
        );
    } catch (error) {
      console.log("mentee copntroller editUserProfile step 8 errror", error);
      next(error);
    }
  };

  public resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { currentPassword: password, newPassword } = req.body;
      const id = req.user?.id;

      console.log("resetPassword request", req.body);

      if (!id) {
        res.status(400).json(new ApiResponse(400, null, "User ID is required"));
        return;
      }

      const result = await this.UserService.updatePassword(
        id,
        password,
        newPassword
      );

      if (!result.success) {
        console.log("result.message....", result.message);
        res.status(400).json(new ApiResponse(400, null, result.message));
      } else {
        res.status(200).json(new ApiResponse(200, null, result.message));
      }
    } catch (error) {
      console.error("resetPassword error:", error);
      next(error);
    }
  };

  // public resetPassword = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) => {
  //   try {
  //     const { currentPassword: password, newPassword } = req.body;
  //     const id = req.user?.id;

  //     console.log("resetPassword request", req.body);

  //     if (!id) {
  //       return res
  //         .status(400)
  //         .json(new ApiResponse(400, null, "User ID is required"));
  //     }

  //     const result = await this.UserService.updatePassword(
  //       id,
  //       password,
  //       newPassword
  //     );

  //     if (!result.success) {
  //       console.log("result.message....", result.message);

  //       return res.status(400).json(new ApiResponse(400, null, result.message));
  //     } else {
  //       return res.status(200).json(new ApiResponse(200, null, result.message));
  //     }
  //   } catch (error) {
  //     console.error("resetPassword error:", error);
  //     next(error);
  //   }
  // };

  public updateOnlineStatus = async (
    req: Request & { user?: AuthUser },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { isOnline, role } = req.body;
      const userId = req.user?.id;
      const authRole = req.user?.role || [];

      console.log(
        `updateOnlineStatus: userId=${userId}, isOnline=${isOnline}, role=${role}, authRole=${authRole}`
      );

      // if (!authUserId) {
      //   console.log("updateOnlineStatus: Unauthorized");
      //   res.status(401).json(new ApiResponse(401, null, "Unauthorized"));
      //   return;
      // }

      if (!userId || typeof isOnline !== "boolean") {
        console.log("updateOnlineStatus: Invalid input");
        res
          .status(400)
          .json(
            new ApiResponse(400, null, "Invalid userId or isOnline status")
          );
        return;
      }

      // if (userId !== authUserId) {
      //   console.log("updateOnlineStatus: User ID mismatch");
      //   res
      //     .status(403)
      //     .json(
      //       new ApiResponse(
      //         403,
      //         null,
      //         "Forbidden: Cannot update status for another user"
      //       )
      //     );
      //   return;
      // }

      if (role !== null && !["mentor", "mentee"].includes(role)) {
        console.log("updateOnlineStatus: Invalid role");
        res.status(400).json(new ApiResponse(400, null, "Invalid role"));
        return;
      }

      // Update Redis
      try {
        if (isOnline) {
          await redisClient.sAdd("online_users", userId);
          console.log(`Added ${userId} to online_users`);
        } else {
          await redisClient.sRem("online_users", userId);
          console.log(`Removed ${userId} from online_users`);
        }
      } catch (err: any) {
        console.error("Redis operation error:", err.message);
        res
          .status(500)
          .json(
            new ApiResponse(500, null, "Failed to update Redis online status")
          );
        return;
      }

      // Emit Socket.IO event
      try {
        const io = getIO();
        io.emit("userStatus", { userId, isOnline });
        console.log(`Emitted userStatus: ${userId}, isOnline=${isOnline}`);
      } catch (err: any) {
        console.error("Socket.IO emit error:", err.message);
        // Non-critical, proceed with database update
      }

      // Update database
      let updatedUser = null;
      if (role) {
        updatedUser = await this.UserService.updateOnlineStatus(
          userId,
          isOnline,
          role as "mentor" | "mentee"
        );
        console.log(`Updated database online status for ${userId}`);
      } else {
        // For logout, set isOnline to false without role
        updatedUser = await this.UserService.updateOnlineStatus(
          userId,
          false,
          null
        );
        console.log(`Cleared online status for ${userId} on logout`);
      }

      if (!updatedUser) {
        console.log("updateOnlineStatus: Failed to update user");
        res
          .status(500)
          .json(
            new ApiResponse(
              500,
              null,
              "Failed to update database online status"
            )
          );
        return;
      }

      res
        .status(200)
        .json(
          new ApiResponse(
            200,
            updatedUser,
            "Online status updated successfully"
          )
        );
    } catch (error: any) {
      console.error("Error updating online status:", error.message);
      res
        .status(500)
        .json(new ApiResponse(500, null, "Failed to update online status"));
      next(error);
    }
  };
}

export default new UserController();
