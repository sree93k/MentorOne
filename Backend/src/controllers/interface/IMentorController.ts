import { Request, Response, NextFunction } from "express";

/**
 * 🔹 DIP COMPLIANCE: Mentor Controller Interface
 * Defines all mentor-related controller operations
 */
export interface IMentorController {
  // Mentor Profile Management
  getMentorProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateMentorProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
  welcomeForm(req: Request, res: Response, next: NextFunction): Promise<void>;
  
  // Service Management
  createService(req: Request, res: Response, next: NextFunction): Promise<void>;
  getAllServices(req: Request, res: Response, next: NextFunction): Promise<void>;
  getServiceById(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateService(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteService(req: Request, res: Response, next: NextFunction): Promise<void>;
  
  // Schedule Management
  getSchedule(req: Request, res: Response, next: NextFunction): Promise<void>;
  createSchedule(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateSchedule(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteSchedule(req: Request, res: Response, next: NextFunction): Promise<void>;
  
  // Booking Management
  getBookings(req: Request, res: Response, next: NextFunction): Promise<void>;
  acceptBooking(req: Request, res: Response, next: NextFunction): Promise<void>;
  rejectBooking(req: Request, res: Response, next: NextFunction): Promise<void>;
  
  // Dashboard & Analytics
  getDashboard(req: Request, res: Response, next: NextFunction): Promise<void>;
  getAnalytics(req: Request, res: Response, next: NextFunction): Promise<void>;
  
  // File Upload
  generatePresignedUrl(req: Request, res: Response, next: NextFunction): Promise<void>;
  uploadVideoBackend(req: Request, res: Response, next: NextFunction): Promise<void>;
  
  // Approval Status
  checkApprovalStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
}