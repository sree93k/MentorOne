import { Request, Response, NextFunction } from "express";
import NotificationService from "../../services/implementations/NotificationService";
import ApiResponse from "../../utils/apiResponse";

interface AuthUser {
  id: string;
}

class NotificationController {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }

  public getUnreadNotifications = async (
    req: Request & { user?: AuthUser },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json(new ApiResponse(401, null, "Unauthorized"));
        return;
      }
      console.log(
        "NotificationController.getUnreadNotifications step 1",
        userId
      );
      const notifications =
        await this.notificationService.getUnreadNotifications(userId);
      res
        .status(200)
        .json(
          new ApiResponse(200, notifications, "Unread notifications fetched")
        );
    } catch (error: any) {
      console.error(
        "NotificationController.getUnreadNotifications error:",
        error.message
      );
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
        res.status(401).json(new ApiResponse(401, null, "Unauthorized"));
        return;
      }
      console.log("NotificationController.markNotificationAsRead step 1", {
        notificationId,
        userId,
      });
      await this.notificationService.markNotificationAsRead(
        notificationId,
        userId
      );
      res
        .status(200)
        .json(new ApiResponse(200, null, "Notification marked as read"));
    } catch (error: any) {
      console.error(
        "NotificationController.markNotificationAsRead error:",
        error.message
      );
      next(error);
    }
  };
}

export default new NotificationController();
