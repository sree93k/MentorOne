import { injectable, inject } from "inversify";
import { Request, Response, NextFunction } from "express";
import ApiResponse from "../../utils/apiResponse";
import { IVideoCallService } from "../../services/interface/IVideoCallService";
import { ApiError } from "../../middlewares/errorHandler";
import { HttpStatus } from "../../constants/HttpStatus";
import { TYPES } from "../../inversify/types";

interface AuthUser {
  id: string;
  firstName?: string;
}

@injectable()
class VideoCallController {
  private videoCallService: IVideoCallService;

  constructor(
    @inject(TYPES.IVideoCallService) videoCallService: IVideoCallService
  ) {
    this.videoCallService = videoCallService;
    this.createMeeting = this.createMeeting.bind(this);
    this.validateMeeting = this.validateMeeting.bind(this);
    this.joinMeeting = this.joinMeeting.bind(this);
    this.endMeeting = this.endMeeting.bind(this);
    this.notifyMentee = this.notifyMentee.bind(this);
  }

  public createMeeting = async (
    req: Request & { user?: AuthUser },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("VideoCallController createMeeting step 1", {
        user: req.user,
        body: req.body,
      });

      const userId = req.user?.id;
      const { menteeId, bookingId } = req.body;

      if (!userId || !menteeId || !bookingId) {
        throw new ApiError(
          HttpStatus.UNAUTHORIZED,
          "User ID, mentee ID, and booking ID are required"
        );
      }

      const meetingId = await this.videoCallService.createMeeting(
        userId,
        menteeId,
        bookingId
      );
      console.log("VideoCallController createMeeting step 2", { meetingId });

      res
        .status(HttpStatus.CREATED)
        .json(
          new ApiResponse(
            HttpStatus.CREATED,
            { meetingId },
            "Meeting created successfully"
          )
        );
    } catch (error) {
      console.error("Error in createMeeting:", error);
      next(error);
    }
  };

  public validateMeeting = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("VideoCallController validateMeeting step 1", {
        params: req.params,
      });

      const { meetingId } = req.params;
      if (!meetingId) {
        throw new ApiError(HttpStatus.BAD_REQUEST, "Meeting ID is required");
      }

      const isValid = await this.videoCallService.validateMeeting(meetingId);
      console.log("VideoCallController validateMeeting step 2", { isValid });

      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            { isValid },
            "Meeting validation checked"
          )
        );
    } catch (error) {
      console.error("Error in validateMeeting:", error);
      next(error);
    }
  };

  public joinMeeting = async (
    req: Request & { user?: AuthUser },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("VideoCallController joinMeeting step 1", {
        user: req.user,
        params: req.params,
      });

      const { meetingId } = req.params;
      const userId = req.user?.id;
      const userName = req.user?.firstName || "Anonymous";
      const peerId = `${userId}_${Date.now()}`;

      if (!meetingId || !userId) {
        throw new ApiError(
          HttpStatus.BAD_REQUEST,
          "Meeting ID and user ID are required"
        );
      }

      await this.videoCallService.joinMeeting(
        meetingId,
        userId,
        userName,
        peerId
      );
      console.log("VideoCallController joinMeeting step 2", {
        meetingId,
        userId,
      });

      res
        .status(HttpStatus.OK)
        .json(new ApiResponse(HttpStatus.OK, {}, "Join request initiated"));
    } catch (error) {
      console.error("Error in joinMeeting:", error);
      next(error);
    }
  };

  public endMeeting = async (
    req: Request & { user?: AuthUser },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("VideoCallController endMeeting step 1", {
        user: req.user,
        params: req.params,
      });

      const { meetingId } = req.params;
      const userId = req.user?.id;

      if (!meetingId || !userId) {
        throw new ApiError(
          HttpStatus.BAD_REQUEST,
          "Meeting ID and user ID are required"
        );
      }

      await this.videoCallService.endMeeting(meetingId, userId);
      console.log("VideoCallController endMeeting step 2", {
        meetingId,
        userId,
      });

      res
        .status(HttpStatus.OK)
        .json(new ApiResponse(HttpStatus.OK, {}, "Meeting ended successfully"));
    } catch (error) {
      console.error("Error in endMeeting:", error);
      next(error);
    }
  };

  public notifyMentee = async (
    req: Request & { user?: AuthUser },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("VideoCallController notifyMentee step 1", {
        user: req.user,
        body: req.body,
      });

      const { menteeId, meetingId, bookingId } = req.body;
      const mentorId = req.user?.id;

      if (!mentorId || !menteeId || !meetingId || !bookingId) {
        throw new ApiError(
          HttpStatus.BAD_REQUEST,
          "Mentor ID, mentee ID, meeting ID, and booking ID are required"
        );
      }

      await this.videoCallService.notifyMentee(
        mentorId,
        menteeId,
        meetingId,
        bookingId
      );
      console.log("VideoCallController notifyMentee step 2", {
        mentorId,
        menteeId,
        meetingId,
      });

      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            {},
            "Notification sent to mentee successfully"
          )
        );
    } catch (error) {
      console.error("Error in notifyMentee:", error);
      next(error);
    }
  };
}

export default VideoCallController;
