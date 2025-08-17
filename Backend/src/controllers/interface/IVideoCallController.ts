import { Request, Response, NextFunction } from "express";

/**
 * 🔹 DIP COMPLIANCE: Video Call Controller Interface
 * Defines all video call management operations
 */
export interface IVideoCallController {
  // Meeting Management
  createMeeting(
    req: Request & { user?: { id: string; firstName?: string } },
    res: Response,
    next: NextFunction
  ): Promise<void>;

  validateMeeting(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  joinMeeting(
    req: Request & { user?: { id: string; firstName?: string } },
    res: Response,
    next: NextFunction
  ): Promise<void>;

  endMeeting(
    req: Request & { user?: { id: string; firstName?: string } },
    res: Response,
    next: NextFunction
  ): Promise<void>;

  // Notifications
  notifyMentee(
    req: Request & { user?: { id: string; firstName?: string } },
    res: Response,
    next: NextFunction
  ): Promise<void>;
}