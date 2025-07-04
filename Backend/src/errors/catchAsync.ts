import { Request, Response, NextFunction } from "express";
import { AppError } from "./appError";

/**
 * Wraps an async route handler to catch errors and pass them to the error middleware.
 * @param fn - Async route handler function
 * @returns Wrapped route handler
 */
export const wrapAsync = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch((err: AppError | Error) => next(err));
  };
};
