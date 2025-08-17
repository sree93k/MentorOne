import { Request, Response, NextFunction } from "express";

/**
 * 🔹 DIP COMPLIANCE: Mentee Controller Interface
 * Defines all mentee-related operations
 */
export interface IMenteeController {
  // Profile Management
  uploadWelcomeForm(
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void>;

  profileData(
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void>;

  deleteAccount(
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void>;

  // Mentor Discovery
  getAllMentors(
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void>;

  getMentorById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  // Booking Management
  getBookings(
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void>;

  // Tutorial Access
  getAllTutorials(
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void>;

  // Payments
  getAllPaymentIntents(
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void>;
}