import { injectable, inject } from "inversify";
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../../middlewares/errorHandler";
import { INotificationService } from "../../services/interface/INotificationService";
import ApiResponse from "../../utils/apiResponse";
import { HttpStatus } from "../../constants/HttpStatus";
import { TYPES } from "../../inversify/types";

interface AuthUser {
  id: string;
}

@injectable()
class NotificationController {
  private notificationService: INotificationService;

  constructor(@inject(TYPES.INotificationService) notificationService: INotificationService) {
    this.notificationService = notificationService;
  }

  public getUnreadNotifications = async (
    req: Request & { user?: AuthUser },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
      const role = req.query.role as "mentor" | "mentee" | undefined;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 12;

      if (!userId) {
        throw new ApiError(HttpStatus.UNAUTHORIZED, "User ID is required");
      }

      console.log("NotificationController getUnreadNotifications step 1", {
        userId,
        role,
        page,
        limit,
      });

      const notifications =
        await this.notificationService.getUnreadNotifications(
          userId,
          role,
          page,
          limit
        );

      console.log("NotificationController getUnreadNotifications step 2", {
        count: notifications.length,
        role,
        page,
      });

      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            notifications,
            "Unread notifications fetched successfully"
          )
        );
    } catch (error) {
      console.error("Error in getUnreadNotifications:", error);
      next(error);
    }
  };
  // ✅ NEW: Get unseen notification counts (for badge)
  public getUnseenNotificationCounts = async (
    req: Request & { user?: AuthUser },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new ApiError(HttpStatus.UNAUTHORIZED, "User ID is required");
      }

      console.log("NotificationController getUnseenNotificationCounts step 1", {
        userId,
      });

      const counts = await this.notificationService.getUnseenNotificationCounts(
        userId
      );

      console.log(
        "✅ NotificationController getUnseenNotificationCounts step 2",
        counts
      );

      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            counts,
            "Unseen notification counts fetched successfully"
          )
        );
    } catch (error) {
      console.error("Error in getUnseenNotificationCounts:", error);
      next(error);
    }
  };

  // ✅ NEW: Mark all notifications as seen
  public markAllNotificationsAsSeen = async (
    req: Request & { user?: AuthUser },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
      const { role } = req.body as { role: "mentor" | "mentee" };

      if (!userId) {
        throw new ApiError(HttpStatus.UNAUTHORIZED, "User ID is required");
      }
      if (!role) {
        throw new ApiError(HttpStatus.BAD_REQUEST, "Role is required");
      }

      console.log("NotificationController markAllNotificationsAsSeen", {
        userId,
        role,
      });

      await this.notificationService.markAllNotificationsAsSeen(userId, role);

      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            null,
            "All notifications marked as seen successfully"
          )
        );
    } catch (error) {
      console.error("Error in markAllNotificationsAsSeen:", error);
      next(error);
    }
  };

  // ✅ NEW: Mark all notifications as read
  public markAllNotificationsAsRead = async (
    req: Request & { user?: AuthUser },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
      const { role } = req.body as { role: "mentor" | "mentee" };

      if (!userId) {
        throw new ApiError(HttpStatus.UNAUTHORIZED, "User ID is required");
      }
      if (!role) {
        throw new ApiError(HttpStatus.BAD_REQUEST, "Role is required");
      }

      console.log("NotificationController markAllNotificationsAsRead", {
        userId,
        role,
      });

      await this.notificationService.markAllNotificationsAsRead(userId, role);

      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            null,
            "All notifications marked as read successfully"
          )
        );
    } catch (error) {
      console.error("Error in markAllNotificationsAsRead:", error);
      next(error);
    }
  };
  // NEW: Get notification counts for both roles
  public getNotificationCounts = async (
    req: Request & { user?: AuthUser },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new ApiError(HttpStatus.UNAUTHORIZED, "User ID is required");
      }

      console.log("NotificationController getNotificationCounts step 1", {
        userId,
      });

      const counts = await this.notificationService.getUnreadNotificationCounts(
        userId
      );

      console.log(
        "NotificationController getNotificationCounts step 2",
        counts
      );

      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            counts,
            "Notification counts fetched successfully"
          )
        );
    } catch (error) {
      console.error("Error in getNotificationCounts:", error);
      next(error);
    }
  };

  public markNotificationAsRead = async (
    req: Request & { user?: AuthUser },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
      const { notificationId } = req.params;
      if (!userId) {
        throw new ApiError(HttpStatus.UNAUTHORIZED, "User ID is required");
      }
      if (!notificationId) {
        throw new ApiError(
          HttpStatus.BAD_REQUEST,
          "Notification ID is required"
        );
      }
      console.log("NotificationController markNotificationAsRead step 1", {
        notificationId,
        userId,
      });

      await this.notificationService.markNotificationAsRead(
        notificationId,
        userId
      );
      console.log("NotificationController markNotificationAsRead step 2");

      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            null,
            "Notification marked as read successfully"
          )
        );
    } catch (error) {
      console.error("Error in markNotificationAsRead:", error);
      next(error);
    }
  };
}

export default NotificationController;
