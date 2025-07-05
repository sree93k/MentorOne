import { Request, Response, NextFunction } from "express";

export interface IAdminController {
  validateSuccessResponse(
    req: Request,
    res: Response,
    next: NextFunction
  ): void;
  adminDashboard(req: Request, res: Response, next: NextFunction): void;
  getAllUsers(req: Request, res: Response, next: NextFunction): void;
  userDatas(req: Request, res: Response, next: NextFunction): void;
  getAllBookings(req: Request, res: Response, next: NextFunction): void;
  getAllPayments(req: Request, res: Response, next: NextFunction): void;
  transferToMentor(req: Request, res: Response, next: NextFunction): void;
  mentorStatusUpdate(req: Request, res: Response, next: NextFunction): void;
  userStatusUpdate(req: Request, res: Response, next: NextFunction): void;
}
