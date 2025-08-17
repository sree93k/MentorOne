import { Request, Response, NextFunction } from "express";

/**
 * 🔹 DIP COMPLIANCE: User Controller Interface
 * Defines all user management operations
 */
export interface IUserController {
  // Session Validation
  validateSuccessResponse(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  // Profile Management
  getProfile(
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void>;

  updateProfile(
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void>;

  // User Data
  getUserData(
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void>;

  // Account Management
  deleteAccount(
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void>;
}