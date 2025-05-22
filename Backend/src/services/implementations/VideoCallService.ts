import { v4 as uuidv4 } from "uuid";
import VideoCallRepository from "../../repositories/implementations/VideoCallRepository";
import { ApiError } from "../../middlewares/errorHandler";
import { IVideoCallService } from "../interface/IVideoCallService";
class VideoCallService implements IVideoCallService {
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
      console.log(
        `VideoCallService: Created meeting ${meetingId} for user ${userId}`
      );
      return meetingId;
    } catch (error: any) {
      console.error(`VideoCallService: Failed to create meeting:`, error);
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
      console.log(
        `VideoCallService: Validated meeting ${meetingId}: ${
          !!meeting && !meeting.endedAt
        }`
      );
      return !!meeting && !meeting.endedAt;
    } catch (error: any) {
      console.error(
        `VideoCallService: Failed to validate meeting ${meetingId}:`,
        error
      );
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
  ): Promise<any> {
    try {
      console.log(
        `VideoCallService: joinMeeting step 1 - meetingId: ${meetingId}, userId: ${userId}`
      );

      const meeting = await this.videoCallRepository.findMeeting(meetingId);
      console.log(`VideoCallService: joinMeeting step 2 - meeting:`, meeting);
      if (!meeting) {
        console.log(`VideoCallService: joinMeeting step 3 - Meeting not found`);
        throw new ApiError(404, "Not Found", "Meeting not found");
      }
      console.log(
        `VideoCallService: joinMeeting step 4 - Checking existing participant for userId: ${userId}`
      );
      const existingParticipant = meeting.participants.find(
        (p) => p.userId === userId
      );
      console.log(
        `VideoCallService: joinMeeting step 5 - existingParticipant:`,
        existingParticipant
      );
      if (!existingParticipant) {
        console.log(
          `VideoCallService: joinMeeting step 6 - Adding new participant`
        );
        const newParticipant = { userId, joinedAt: new Date() };
        meeting.participants.push(newParticipant);
        console.log(
          `VideoCallService: joinMeeting step 7 - Updated participants:`,
          meeting.participants
        );
        const updateResult = await this.videoCallRepository.update(meetingId, {
          participants: meeting.participants,
        });
        console.log(
          `VideoCallService: joinMeeting step 8 - Update result:`,
          updateResult
        );
        if (updateResult.modifiedCount === 0) {
          console.warn(
            `VideoCallService: No changes made to meeting ${meetingId} for user ${userId}`
          );
        }
        console.log(
          `VideoCallService: Updated meeting ${meetingId} with new participant ${userId}`,
          updateResult
        );
      } else {
        console.log(
          `VideoCallService: User ${userId} already in meeting ${meetingId}`
        );
      }
      console.log(`VideoCallService: joinMeeting step 9 - Final success`);
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
      console.log(`VideoCallService: Ended meeting ${meetingId}`);
    } catch (error: any) {
      console.error(
        `VideoCallService: Failed to end meeting ${meetingId}:`,
        error
      );
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
