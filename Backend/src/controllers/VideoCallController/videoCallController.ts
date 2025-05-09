// import { Request, Response, NextFunction } from "express";
// import VideoCallService from "../../services/implementations/imVideoCallService";
// import VideoCallRepository from "../../repositories/implementations/imVideoCallRepository";
// import ApiResponse from "../../utils/apiResponse";
// import { ApiError } from "../../middlewares/errorHandler";

// class VideoCallController {
//   private videoCallService: VideoCallService;

//   constructor() {
//     this.videoCallService = new VideoCallService(new VideoCallRepository());
//   }

//   async startVideoCall(req: Request, res: Response, next: NextFunction) {
//     try {
//       console.log("VideoCallController startVideoCall step 1 ");

//       const userId = req.user?.id;
//       if (!userId) {
//         throw new ApiError(401, "Unauthorized", "User ID is required");
//       }
//       console.log("VideoCallController startVideoCall step 2 ", userId);
//       const meetingId = await this.videoCallService.startMeeting(userId);
//       console.log("VideoCallController startVideoCall step 3 ", meetingId);
//       res.json(
//         new ApiResponse(200, { meetingId }, "Meeting created successfully")
//       );
//     } catch (error) {
//       next(error);
//     }
//   }

//   async validateMeeting(req: Request, res: Response, next: NextFunction) {
//     try {
//       const { meetingId } = req.params;
//       const isValid = await this.videoCallService.validateMeeting(meetingId);
//       res.json(new ApiResponse(200, { isValid }, "Meeting validation checked"));
//     } catch (error) {
//       next(error);
//     }
//   }
// }

// export default new VideoCallController();
// Alternative export pattern for VideoCallController.ts
import { Request, Response, NextFunction } from "express";
import ApiResponse from "../../utils/apiResponse";
import VideoCallService from "../../services/implementations/imVideoCallService";

class VideoCallController {
  private videoCallService: VideoCallService;

  constructor() {
    this.videoCallService = new VideoCallService();

    // Bind all methods to ensure 'this' context is preserved
    this.createMeeting = this.createMeeting.bind(this);
    this.validateMeeting = this.validateMeeting.bind(this);
    this.joinMeeting = this.joinMeeting.bind(this);
    this.endMeeting = this.endMeeting.bind(this);
  }

  async createMeeting(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id; // Assuming user is attached from authenticate middleware
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
      const isValid = await this.videoCallService.validateMeeting(meetingId);
      res.json(new ApiResponse(200, { isValid }, "Meeting validation checked"));
    } catch (error) {
      next(error);
    }
  }

  async joinMeeting(req: Request, res: Response, next: NextFunction) {
    try {
      const { meetingId } = req.params;
      const userId = req.user.id;
      await this.videoCallService.joinMeeting(meetingId, userId);
      res.json(new ApiResponse(200, {}, "Joined meeting successfully"));
    } catch (error) {
      next(error);
    }
  }

  async endMeeting(req: Request, res: Response, next: NextFunction) {
    try {
      const { meetingId } = req.params;
      const userId = req?.user?.id;
      await this.videoCallService.endMeeting(meetingId, userId);
      res.json(new ApiResponse(200, {}, "Meeting ended successfully"));
    } catch (error) {
      next(error);
    }
  }
}

// Create and export an instance
const videoCallController = new VideoCallController();
export default videoCallController;
