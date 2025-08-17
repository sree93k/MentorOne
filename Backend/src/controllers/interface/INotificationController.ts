import { Request, Response, NextFunction } from "express";

/**
 * 🔹 DIP COMPLIANCE: Notification Controller Interface
 * Defines all notification management operations
 */
export interface INotificationController {
  // Notification Retrieval
  getUnreadNotifications(
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void>;

  getUnseenNotificationCounts(
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void>;

  getNotificationCounts(
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void>;

  // Notification Status Management
  markAllNotificationsAsSeen(
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void>;

  markAllNotificationsAsRead(
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void>;

  markNotificationAsRead(
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void>;
}