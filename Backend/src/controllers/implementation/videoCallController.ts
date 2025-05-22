import { Request, Response, NextFunction } from "express";
import ApiResponse from "../../utils/apiResponse";
import VideoCallService from "../../services/implementations/VideoCallService";
import { IVideoCallService } from "../../services/interface/IVideoCallService";
import { ApiError } from "../../middlewares/errorHandler";

class VideoCallController {
  private videoCallService: IVideoCallService;

  constructor() {
    this.videoCallService = new VideoCallService();
    this.createMeeting = this.createMeeting.bind(this);
    this.validateMeeting = this.validateMeeting.bind(this);
    this.joinMeeting = this.joinMeeting.bind(this);
    this.endMeeting = this.endMeeting.bind(this);
  }

  async createMeeting(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new ApiError(401, "Unauthorized", "User ID is required");
      }
      const meetingId = await this.videoCallService.createMeeting(userId);
      res.json(
        new ApiResponse(200, { meetingId }, "Meeting created successfully")
      );
    } catch (error) {
      next(error);
    }
  }

  async validateMeeting(req: Request, res: Response, next: NextFunction) {
    try {
      const { meetingId } = req.params;
      if (!meetingId) {
        throw new ApiError(400, "Bad Request", "Meeting ID is required");
      }
      const isValid = await this.videoCallService.validateMeeting(meetingId);
      res.json(new ApiResponse(200, { isValid }, "Meeting validation checked"));
    } catch (error) {
      next(error);
    }
  }

  async joinMeeting(req: Request, res: Response, next: NextFunction) {
    try {
      const { meetingId } = req.params;
      const userId = req.user?.id;
      const userName = req.user?.firstName || "Anonymous";
      const peerId = `${userId}_${Date.now()}`; // Simplified for API
      if (!meetingId || !userId) {
        throw new ApiError(
          400,
          "Bad Request",
          "Meeting ID and User ID are required"
        );
      }
      await this.videoCallService.joinMeeting(
        meetingId,
        userId,
        userName,
        peerId
      );
      res.json(new ApiResponse(200, {}, "Join request initiated"));
    } catch (error) {
      next(error);
    }
  }

  async endMeeting(req: Request, res: Response, next: NextFunction) {
    try {
      const { meetingId } = req.params;
      const userId = req.user?.id;
      if (!meetingId || !userId) {
        throw new ApiError(
          400,
          "Bad Request",
          "Meeting ID and User ID are required"
        );
      }
      await this.videoCallService.endMeeting(meetingId, userId);
      res.json(new ApiResponse(200, {}, "Meeting ended successfully"));
    } catch (error) {
      next(error);
    }
  }
}

const videoCallController = new VideoCallController();
export default videoCallController;
