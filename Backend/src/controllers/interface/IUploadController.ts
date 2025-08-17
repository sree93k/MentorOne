import { Request, Response, NextFunction } from "express";

/**
 * 🔹 DIP COMPLIANCE: Upload Controller Interface
 * Defines all file upload operations
 */
export interface IUploadController {
  // Image Upload
  uploadProfileImage(
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void>;

  // File Management
  getFile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  deleteFile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  // URL Generation
  generatePresignedUrl(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}