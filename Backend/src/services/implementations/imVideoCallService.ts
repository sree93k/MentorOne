import { v4 as uuidv4 } from "uuid";
import VideoCallRepository from "../../repositories/implementations/imVideoCallRepository";
import { ApiError } from "../../middlewares/errorHandler";

class VideoCallService {
  private videoCallRepository: VideoCallRepository;

  constructor() {
    this.videoCallRepository = new VideoCallRepository();
  }

  async createMeeting(userId: string): Promise<string> {
    if (!userId) {
      throw new ApiError(400, "Bad Request", "User ID is required");
    }

    const meetingId = uuidv4();
    try {
      await this.videoCallRepository.createMeeting({
        meetingId,
        creatorId: userId,
        participants: [{ userId, joinedAt: new Date() }],
        createdAt: new Date(),
      });
      return meetingId;
    } catch (error: any) {
      throw new ApiError(
        500,
        "Internal Server Error",
        "Failed to create meeting: " + error.message
      );
    }
  }

  async validateMeeting(meetingId: string): Promise<boolean> {
    if (!meetingId) {
      throw new ApiError(400, "Bad Request", "Meeting ID is required");
    }

    try {
      const meeting = await this.videoCallRepository.findMeeting(meetingId);
      return !!meeting && !meeting.endedAt;
    } catch (error: any) {
      throw new ApiError(
        500,
        "Internal Server Error",
        "Failed to validate meeting: " + error.message
      );
    }
  }

  async joinMeeting(
    meetingId: string,
    userId: string,
    userName: string,
    peerId: string
  ) {
    try {
      console.log("videoserviuce joinmeeting step 1", meetingId);

      const meeting = await this.videoCallRepository.findMeeting(meetingId);
      console.log("videoserviuce joinmeeting step 2", meeting);
      if (!meeting) {
        console.log("videoserviuce joinmeeting step 3 errror");
        throw new ApiError(404, "Not Found", "Meeting not found");
      }
      console.log("videoserviuce joinmeeting step 4", userId);
      const existingParticipant = meeting.participants.find(
        (p) => p.userId === userId
      );
      console.log("videoserviuce joinmeeting step 5", existingParticipant);
      if (!existingParticipant) {
        console.log("videoserviuce joinmeeting step 6");
        meeting.participants.push({
          userId,
          joinedAt: new Date(),
        });
        console.log("videoserviuce joinmeeting step 7");
        const updateResult = await this.videoCallRepository.update(meetingId, {
          participants: meeting.participants,
        });
        console.log("videoserviuce joinmeeting step 8", updateResult);
        console.log(
          `VideoCallService: Updated meeting ${meetingId} with new participant ${userId}`,
          updateResult
        );
      } else {
        console.log(
          `VideoCallService: User ${userId} already in meeting ${meetingId}`
        );
      }
      console.log("videoserviuce joinmeeting step 9 final");
      return {
        success: true,
        message: "Joined meeting successfully",
        meeting,
      };
    } catch (error: any) {
      console.error(
        `VideoCallService: Error joining meeting ${meetingId}:`,
        error
      );
      throw new ApiError(
        500,
        "Internal Server Error",
        error.message || "Failed to join meeting"
      );
    }
  }
  // async leaveMeeting(meetingId: string, userId: string): Promise<void> {
  //   console.log(
  //     `VideoCallService: User ${userId} leaving meeting ${meetingId}`
  //   );
  //   try {
  //     await this.videoCallRepository.removeParticipant(meetingId, userId);
  //     console.log(
  //       `VideoCallService: User ${userId} removed from meeting ${meetingId}`
  //     );
  //   } catch (error: any) {
  //     console.error(`VideoCallService: Error leaving meeting ${meetingId}:`, {
  //       message: error.message,
  //       stack: error.stack,
  //     });
  //     throw error;
  //   }
  // }
  async leaveMeeting(meetingId: string, userId: string): Promise<void> {
    console.log(
      `VideoCallService: User ${userId} leaving meeting ${meetingId}`
    );
    try {
      const meeting = await this.videoCallRepository.findMeeting(meetingId);
      if (!meeting) {
        console.warn(`VideoCallService: Meeting ${meetingId} not found`);
        return;
      }
      await this.videoCallRepository.removeParticipant(meetingId, userId);
      console.log(
        `VideoCallService: User ${userId} removed from meeting ${meetingId}`
      );
    } catch (error: any) {
      console.error(
        `VideoCallService: Error leaving meeting ${meetingId}:`,
        error.message,
        error.stack
      );
      throw new ApiError(
        500,
        "Internal Server Error",
        `Failed to leave meeting: ${error.message}`
      );
    }
  }
  async endMeeting(meetingId: string, userId: string): Promise<void> {
    if (!meetingId || !userId) {
      throw new ApiError(
        400,
        "Bad Request",
        "Meeting ID and User ID are required"
      );
    }

    try {
      const meeting = await this.videoCallRepository.findMeeting(meetingId);
      if (!meeting) {
        throw new ApiError(404, "Not Found", "Meeting not found");
      }
      if (meeting.creatorId !== userId) {
        throw new ApiError(
          403,
          "Forbidden",
          "Only the creator can end the meeting"
        );
      }
      await this.videoCallRepository.endMeeting(meetingId);
    } catch (error: any) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(
        500,
        "Internal Server Error",
        "Failed to end meeting: " + error.message
      );
    }
  }
}

export default VideoCallService;
