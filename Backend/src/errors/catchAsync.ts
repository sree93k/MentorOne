// src/errors/catchAsync.ts
import { Request, Response, NextFunction } from "express";

export const wrapAsync = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
};
