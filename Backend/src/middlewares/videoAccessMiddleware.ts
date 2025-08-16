import { Request, Response, NextFunction } from "express";
import { ApiError } from "../middlewares/errorHandler";
import { HttpStatus } from "../constants/HttpStatus";
import BookingService from "../services/implementations/Bookingservice";
import { IBookingService } from "../services/interface/IBookingService";
import rateLimit from "express-rate-limit";

// Fix: Use proper interface that matches your existing Request type
interface AuthenticatedRequest extends Request {
  user?: {
    rawToken: string;
    id: string;
  };
}

class VideoAccessMiddleware {
  private bookingService: IBookingService;

  constructor() {
    this.bookingService = new BookingService();
  }

  // 🔧 ADJUSTED: More generous rate limiting for development/testing
  public videoUrlRateLimit = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: process.env.NODE_ENV === "development" ? 50 : 10, // 50 for dev, 10 for production
    message: {
      error: "Too many video requests. Please try again later.",
      retryAfter: "1 hour",
    },
    standardHeaders: true,
    legacyHeaders: false,
    // 🔧 FIXED: Better key generation with fallbacks
    keyGenerator: (req: AuthenticatedRequest): string => {
      // Try user ID first, then IP, then fallback to 'anonymous'
      return req.user?.id || req.ip || req.socket?.remoteAddress || "anonymous";
    },
    // 🔧 ADDED: Skip rate limiting for development if needed
    skip: (req: AuthenticatedRequest) => {
      // Optional: Skip rate limiting for development
      return (
        process.env.NODE_ENV === "development" &&
        process.env.SKIP_VIDEO_RATE_LIMIT === "true"
      );
    },
  });

  // Verify if user has purchased the video content
  public verifyVideoPurchase = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { serviceId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        throw new ApiError(HttpStatus.UNAUTHORIZED, "Authentication required");
      }

      if (!serviceId) {
        throw new ApiError(HttpStatus.BAD_REQUEST, "Service ID is required");
      }

      console.log("VideoAccessMiddleware: Verifying purchase", {
        userId,
        serviceId,
      });

      // Check if user has purchased this service
      const hasPurchased = await this.bookingService.checkBookingStatus(
        userId,
        serviceId
      );

      if (!hasPurchased) {
        throw new ApiError(
          HttpStatus.FORBIDDEN,
          "You must purchase this content to access it"
        );
      }

      console.log("VideoAccessMiddleware: Purchase verified", {
        userId,
        serviceId,
      });
      next();
    } catch (error) {
      console.error("VideoAccessMiddleware error:", error);
      next(error);
    }
  };

  // Verify video access for individual video chunks/files
  public verifyVideoFileAccess = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { key } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        throw new ApiError(HttpStatus.UNAUTHORIZED, "Authentication required");
      }

      if (!key) {
        throw new ApiError(HttpStatus.BAD_REQUEST, "Video key is required");
      }

      // Extract service ID from video key (assuming format: videos/serviceId_timestamp_filename)
      const serviceId = this.extractServiceIdFromKey(key);

      if (!serviceId) {
        throw new ApiError(HttpStatus.BAD_REQUEST, "Invalid video key format");
      }

      // Verify purchase
      const hasPurchased = await this.bookingService.checkBookingStatus(
        userId,
        serviceId
      );

      if (!hasPurchased) {
        throw new ApiError(
          HttpStatus.FORBIDDEN,
          "Access denied: Content not purchased"
        );
      }

      // Add service ID to request for downstream use
      (req as any).serviceId = serviceId;
      next();
    } catch (error) {
      console.error("VideoAccessMiddleware file access error:", error);
      next(error);
    }
  };

  // Extract service ID from video key
  private extractServiceIdFromKey(key: string): string | null {
    try {
      // Remove any URL prefix if present
      let cleanKey = key;
      if (key.includes("amazonaws.com/")) {
        cleanKey = key.split("amazonaws.com/")[1];
      }

      // Remove videos/ prefix and timestamp to get service-related info
      // This is a simplified approach - you might need to adjust based on your key format
      const parts = cleanKey.split("/");
      if (parts.length >= 2) {
        const filename = parts[1];
        // If your video filenames contain serviceId, extract it here
        // For now, return null - you'll need to implement based on your naming convention
        return null;
      }

      return null;
    } catch (error) {
      console.error("Error extracting service ID from key:", error);
      return null;
    }
  }
}

export default new VideoAccessMiddleware();
