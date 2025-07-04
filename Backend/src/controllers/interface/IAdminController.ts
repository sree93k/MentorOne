// import { Request, Response } from "express";
// export interface IAdminController {
//   validateSuccessResponse(req: Request, res: Response): Promise<void>;
//   getAllUsers(req: Request, res: Response): Promise<void>;
//   userDatas(req: Request, res: Response): Promise<void>;
//   getAllBookings(req: Request, res: Response): Promise<void>;
//   getAllPayments(req: Request, res: Response): Promise<void>;
//   transferToMentor(req: Request, res: Response): Promise<void>;
//   mentorStatusUpdate(req: Request, res: Response): Promise<void>;
//   userStatusUpdate(req: Request, res: Response): Promise<void>;
// }

import { Request, Response, NextFunction } from "express";

export interface IAdminController {
  validateSuccessResponse(
    req: Request,
    res: Response,
    next: NextFunction
  ): void;
  getAllUsers(req: Request, res: Response, next: NextFunction): void;
  userDatas(req: Request, res: Response, next: NextFunction): void;
  getAllBookings(req: Request, res: Response, next: NextFunction): void;
  getAllPayments(req: Request, res: Response, next: NextFunction): void;
  transferToMentor(req: Request, res: Response, next: NextFunction): void;
  mentorStatusUpdate(req: Request, res: Response, next: NextFunction): void;
  userStatusUpdate(req: Request, res: Response, next: NextFunction): void;
}
