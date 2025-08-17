import { Request, Response, NextFunction } from "express";

/**
 * 🔹 DIP COMPLIANCE: Socket Controller Interface
 * Defines all socket-related controller operations for real-time chat functionality
 */
export interface ISocketController {
  // Chat Users Management
  getChatUsers(
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void>;

  // Chat Unread Management
  getChatUnreadCounts(
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void>;

  markChatAsRead(
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void>;

  getChatUnreadMessageCount(
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void>;

  // User Status Management
  getUserOnlineStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}