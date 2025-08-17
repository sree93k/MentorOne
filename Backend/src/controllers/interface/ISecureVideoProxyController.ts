import { Request, Response, NextFunction } from "express";

/**
 * 🔹 DIP COMPLIANCE: Secure Video Proxy Controller Interface
 * Defines all secure video streaming operations
 */
export interface ISecureVideoProxyController {
  // Video Streaming
  streamVideo(
    req: Request & { user?: { id: string; role: string[] } },
    res: Response,
    next: NextFunction
  ): Promise<void>;

  // Video Analytics
  trackVideoView(
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void>;

  getVideoAnalytics(
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void>;

  // Access Control
  validateVideoAccess(
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void>;

  // HLS Streaming
  getHLSManifest(
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void>;

  getHLSSegment(
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void>;
}