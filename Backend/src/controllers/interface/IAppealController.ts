import { Request, Response, NextFunction } from "express";

/**
 * 🔹 DIP COMPLIANCE: Appeal Controller Interface
 * Defines all appeal management operations
 */
export interface IAppealController {
  // Appeal Submission
  submitAppeal(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  validateAppealSubmission(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  // Appeal Status & Retrieval
  getAppealStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  getAppeals(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  getAppealDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  getLatestAppealByEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  // Appeal Management
  processAppeal(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  updateAppealStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  // Analytics
  getAppealStatistics(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}