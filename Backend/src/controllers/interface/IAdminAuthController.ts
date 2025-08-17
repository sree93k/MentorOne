import { Request, Response } from "express";

/**
 * 🔹 DIP COMPLIANCE: Admin Authentication Controller Interface
 * Defines all admin authentication operations
 */
export interface IAdminAuthController {
  // Authentication Operations
  login(req: Request, res: Response): Promise<void>;
  logout(req: Request, res: Response): Promise<void>;
  refreshToken(req: Request, res: Response): Promise<void>;
}