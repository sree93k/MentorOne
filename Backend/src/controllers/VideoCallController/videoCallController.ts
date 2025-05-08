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
import { Request, Response, NextFunction } from "express";
import VideoCallService from "../../services/implementations/imVideoCallService";
import VideoCallRepository from "../../repositories/implementations/imVideoCallRepository";
import ApiResponse from "../../utils/apiResponse";
import { ApiError } from "../../middlewares/errorHandler";

class VideoCallController {
  private videoCallService: VideoCallService;

  constructor(videoCallService: VideoCallService) {
    this.videoCallService = videoCallService;
  }

  async startVideoCall(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("VideoCallController startVideoCall step 1");

      const userId = req.user?.id;
      if (!userId) {
        throw new ApiError(401, "Unauthorized", "User ID is required");
      }
      console.log("VideoCallController startVideoCall step 2", userId);

      const meetingId = await this.videoCallService.startMeeting(userId);
      console.log("VideoCallController startVideoCall step 3", meetingId);

      res.json(
        new ApiResponse(200, { meetingId }, "Meeting created successfully")
      );
    } catch (error) {
      console.error("Error in startVideoCall:", error);
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
}

// Instantiate controller with service and repository
const videoCallRepository = new VideoCallRepository();
const videoCallService = new VideoCallService(videoCallRepository);
const videoCallController = new VideoCallController(videoCallService);

export default videoCallController;
