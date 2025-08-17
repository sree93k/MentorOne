import { Request, Response, NextFunction } from "express";

/**
 * 🔹 DIP COMPLIANCE: User Authentication Controller Interface
 * Allows dependency injection of controllers and easier testing
 */
export interface IUserAuthController {
  // Authentication Operations
  signup(req: Request, res: Response, next: NextFunction): Promise<void>;
  verifyOTP(req: Request, res: Response, next: NextFunction): Promise<void>;
  signin(req: Request, res: Response, next: NextFunction): Promise<void>;
  refreshToken(req: Request, res: Response, next: NextFunction): Promise<void>;
  logout(req: Request, res: Response, next: NextFunction): Promise<void>;
  
  // Password Management
  forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void>;
  resetPassword(req: Request, res: Response, next: NextFunction): Promise<void>;
  changePassword(req: Request, res: Response, next: NextFunction): Promise<void>;
  
  // Social Authentication
  googleAuth(req: Request, res: Response, next: NextFunction): Promise<void>;
  
  // User Profile
  getProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
}