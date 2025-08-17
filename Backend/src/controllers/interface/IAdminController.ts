import { Request, Response, NextFunction } from "express";

/**
 * 🔹 DIP COMPLIANCE: Admin Controller Interface
 * Defines all admin-related controller operations
 */
export interface IAdminController {
  // User Management
  getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void>;
  getUserById(req: Request, res: Response, next: NextFunction): Promise<void>;
  blockUser(req: Request, res: Response, next: NextFunction): Promise<void>;
  unblockUser(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteUser(req: Request, res: Response, next: NextFunction): Promise<void>;
  
  // Mentor Management
  getAllMentors(req: Request, res: Response, next: NextFunction): Promise<void>;
  getMentorById(req: Request, res: Response, next: NextFunction): Promise<void>;
  approveMentor(req: Request, res: Response, next: NextFunction): Promise<void>;
  rejectMentor(req: Request, res: Response, next: NextFunction): Promise<void>;
  
  // Service Management
  getAllServices(req: Request, res: Response, next: NextFunction): Promise<void>;
  approveService(req: Request, res: Response, next: NextFunction): Promise<void>;
  rejectService(req: Request, res: Response, next: NextFunction): Promise<void>;
  
  // Appeal Management
  getAppeals(req: Request, res: Response, next: NextFunction): Promise<void>;
  processAppeal(req: Request, res: Response, next: NextFunction): Promise<void>;
  
  // Analytics & Reports
  getDashboard(req: Request, res: Response, next: NextFunction): Promise<void>;
  getAnalytics(req: Request, res: Response, next: NextFunction): Promise<void>;
  getUserStatistics(req: Request, res: Response, next: NextFunction): Promise<void>;
  
  // Content Management
  getTestimonials(req: Request, res: Response, next: NextFunction): Promise<void>;
  approveTestimonial(req: Request, res: Response, next: NextFunction): Promise<void>;
  rejectTestimonial(req: Request, res: Response, next: NextFunction): Promise<void>;
}