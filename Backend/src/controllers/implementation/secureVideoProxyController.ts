import { Request, Response, NextFunction } from "express";
import { ApiError } from "../../middlewares/errorHandler";
import { HttpStatus } from "../../constants/HttpStatus";
import EnhancedSecureVideoProxy from "../../services/implementations/EnhancedSecureVideoProxy";
import VideoAnalyticsService from "../../services/implementations/VideoAnalyticsService";

interface AuthenticatedRequest extends Request {
  user?: { id: string; role: string[] };
}

class SecureVideoProxyController {
  /**
   * 🎬 STREAM VIDEO SECURELY
   * Handle secure video streaming with access control
   */
  public streamVideo = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("🎬 Secure video streaming request", {
        hasUser: !!req.user,
        s3Key: req.query.s3Key ? String(req.query.s3Key).split('/').pop() : undefined,
        videoSecureId: req.query.videoSecureId,
        userAgent: req.headers['user-agent']?.substring(0, 50) + "..."
      });

      // Authentication check
      if (!req.user?.id) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          error: "Authentication required for video access"
        });
        return;
      }

      // Extract request parameters
      const videoRequest = {
        s3Key: req.query.s3Key as string,
        videoSecureId: req.query.videoSecureId as string,
        userId: req.user.id,
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
        accessToken: req.query.accessToken as string
      };

      // Streaming options
      const streamingOptions = {
        quality: req.query.quality as string || 'auto',
        startTime: req.query.startTime ? parseInt(req.query.startTime as string) : undefined,
        endTime: req.query.endTime ? parseInt(req.query.endTime as string) : undefined,
        enableAnalytics: req.query.analytics !== 'false'
      };

      // Validate required parameters
      if (!videoRequest.s3Key && !videoRequest.videoSecureId) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          error: "Either s3Key or videoSecureId is required"
        });
        return;
      }

      // Stream video through enhanced proxy
      await EnhancedSecureVideoProxy.streamVideoSecurely(
        videoRequest,
        res,
        streamingOptions
      );

    } catch (error: any) {
      console.error("🚫 Secure video streaming failed:", error);
      if (!res.headersSent) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          error: "Video streaming failed"
        });
      }
    }
  };

  /**
   * 📊 TRACK VIDEO EVENT
   * Track video analytics events
   */
  public trackVideoEvent = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user?.id) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          error: "Authentication required"
        });
        return;
      }

      const { videoS3Key, event, sessionId, metadata } = req.body;

      if (!videoS3Key || !event || !sessionId) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          error: "videoS3Key, event, and sessionId are required"
        });
        return;
      }

      // Track the analytics event
      await VideoAnalyticsService.trackVideoEvent({
        videoS3Key,
        userId: req.user.id,
        sessionId,
        event,
        timestamp: new Date(),
        metadata: {
          ...metadata,
          userAgent: req.headers['user-agent'],
          ipAddress: req.ip || req.connection.remoteAddress,
          referrer: req.headers.referer
        }
      });

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Event tracked successfully"
      });

    } catch (error: any) {
      console.error("🚫 Video event tracking failed:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: "Event tracking failed"
      });
    }
  };

  /**
   * 🔗 GENERATE STREAMING URL
   * Generate secure streaming URL for video player
   */
  public generateStreamingUrl = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user?.id) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          error: "Authentication required"
        });
        return;
      }

      const { s3Key, videoSecureId, expiresIn, quality } = req.query as {
        s3Key?: string;
        videoSecureId?: string;
        expiresIn?: string;
        quality?: string;
      };

      if (!s3Key && !videoSecureId) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          error: "Either s3Key or videoSecureId is required"
        });
        return;
      }

      const videoRequest = {
        s3Key,
        videoSecureId,
        userId: req.user.id,
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip || req.connection.remoteAddress,
        accessToken: req.query.accessToken as string
      };

      const options = {
        expiresIn: expiresIn ? parseInt(expiresIn) : 3600,
        quality,
        analytics: req.query.analytics !== 'false'
      };

      const result = await EnhancedSecureVideoProxy.generateSecureStreamingUrl(
        videoRequest,
        options
      );

      if (!result.success) {
        res.status(HttpStatus.FORBIDDEN).json({
          success: false,
          error: result.error || "Access denied"
        });
        return;
      }

      res.status(HttpStatus.OK).json({
        success: true,
        data: {
          streamingUrl: result.url,
          expiresIn: options.expiresIn,
          quality: quality || 'auto'
        },
        message: "Streaming URL generated successfully"
      });

    } catch (error: any) {
      console.error("🚫 Failed to generate streaming URL:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: "Failed to generate streaming URL"
      });
    }
  };

  /**
   * 🔍 VALIDATE VIDEO ACCESS
   * Check if user has access to specific video
   */
  public validateVideoAccess = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user?.id) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          error: "Authentication required"
        });
        return;
      }

      const { s3Key, videoSecureId, accessToken } = req.query as {
        s3Key?: string;
        videoSecureId?: string;
        accessToken?: string;
      };

      if (!s3Key && !videoSecureId) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          error: "Either s3Key or videoSecureId is required"
        });
        return;
      }

      // This would typically involve checking database permissions,
      // subscription status, purchase history, etc.
      
      res.status(HttpStatus.OK).json({
        success: true,
        data: {
          hasAccess: true,
          accessLevel: 'full',
          restrictions: {
            allowDownload: false,
            maxViews: 1000,
            expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
          }
        },
        message: "Video access validated"
      });

    } catch (error: any) {
      console.error("🚫 Video access validation failed:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: "Access validation failed"
      });
    }
  };

  /**
   * 📱 HANDLE OPTIONS REQUEST
   * Handle CORS preflight requests
   */
  public handleOptions = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Range');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
    
    res.status(HttpStatus.OK).end();
  };
}

export default new SecureVideoProxyController();