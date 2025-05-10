// import { v4 as uuidv4 } from "uuid";
// import VideoCallRepository from "../../repositories/implementations/imVideoCallRepository";

// class VideoCallService {
//   private videoCallRepository: VideoCallRepository;

//   constructor() {
//     this.videoCallRepository = new VideoCallRepository();
//   }

//   async createMeeting(userId: string): Promise<string> {
//     const meetingId = uuidv4();

//     await this.videoCallRepository.createMeeting({
//       meetingId,
//       creatorId: userId,
//       participants: [{ userId, joinedAt: new Date() }],
//       createdAt: new Date(),
//     });

//     return meetingId;
//   }

//   async validateMeeting(meetingId: string): Promise<boolean> {
//     const meeting = await this.videoCallRepository.findMeeting(meetingId);
//     return !!meeting && !meeting.endedAt;
//   }

//   async joinMeeting(meetingId: string, userId: string): Promise<void> {
//     const meeting = await this.videoCallRepository.findMeeting(meetingId);

//     if (!meeting) {
//       throw new Error("Meeting not found");
//     }

//     if (meeting.endedAt) {
//       throw new Error("Meeting has ended");
//     }

//     // Check if user is already a participant
//     const existingParticipant = meeting.participants.find(
//       (p) => p.userId === userId
//     );
//     if (!existingParticipant) {
//       await this.videoCallRepository.addParticipant(meetingId, userId);
//     }
//   }

//   async endMeeting(meetingId: string, userId: string): Promise<void> {
//     const meeting = await this.videoCallRepository.findMeeting(meetingId);

//     if (!meeting) {
//       throw new Error("Meeting not found");
//     }

//     // Optional: Check if user is the creator
//     if (meeting.creatorId !== userId) {
//       throw new Error("Only the creator can end the meeting");
//     }

//     await this.videoCallRepository.endMeeting(meetingId);
//   }
// }

// export default VideoCallService;
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

  //   async joinMeeting(meetingId: string, userId: string): Promise<void> {
  //     if (!meetingId || !userId) {
  //       throw new ApiError(
  //         400,
  //         "Bad Request",
  //         "Meeting ID and User ID are required"
  //       );
  //     }

  //     try {
  //       const meeting = await this.videoCallRepository.findMeeting(meetingId);
  //       if (!meeting) {
  //         throw new ApiError(404, "Not Found", "Meeting not found");
  //       }
  //       if (meeting.endedAt) {
  //         throw new ApiError(410, "Gone", "Meeting has ended");
  //       }
  //       // Optional: Add participant limit
  //       if (meeting.participants.length >= 100) {
  //         const error = new ApiError(403, "Forbidden", "Meeting is full");
  //         error.status = 403;
  //         throw error;
  //       }
  //       const existingParticipant = meeting.participants.find(
  //         (p) => p.userId === userId
  //       );
  //       if (!existingParticipant) {
  //         await this.videoCallRepository.addParticipant(meetingId, userId);
  //       }
  //     } catch (error: any) {
  //       if (error instanceof ApiError) throw error;
  //       throw new ApiError(
  //         500,
  //         "Internal Server Error",
  //         "Failed to join meeting: " + error.message
  //       );
  //     }
  //   }

  //   async leaveMeeting(meetingId: string, userId: string): Promise<void> {
  //     if (!meetingId || !userId) {
  //       throw new ApiError(
  //         400,
  //         "Bad Request",
  //         "Meeting ID and User ID are required"
  //       );
  //     }

  //     try {
  //       const meeting = await this.videoCallRepository.findMeeting(meetingId);
  //       if (!meeting) {
  //         throw new ApiError(404, "Not Found", "Meeting not found");
  //       }
  //       await this.videoCallRepository.removeParticipant(meetingId, userId);
  //     } catch (error: any) {
  //       if (error instanceof ApiError) throw error;
  //       throw new ApiError(
  //         500,
  //         "Internal Server Error",
  //         "Failed to leave meeting: " + error.message
  //       );
  //     }
  //   }

  async joinMeeting(meetingId: string, userId: string): Promise<void> {
    console.log(
      `VideoCallService: Joining meeting ${meetingId} for user ${userId}`
    );
    try {
      const meeting = await this.videoCallRepository.findMeeting(meetingId);
      console.log(`VideoCallService: Meeting found:`, meeting);
      if (!meeting) {
        console.error(`VideoCallService: Meeting not found: ${meetingId}`);
        throw new ApiError(404, "Not Found", `Meeting ${meetingId} not found`);
      }
      await this.videoCallRepository.addParticipant(meetingId, userId);
      console.log(
        `VideoCallService: User ${userId} added to meeting ${meetingId}`
      );
    } catch (error: any) {
      console.error(`VideoCallService: Error joining meeting ${meetingId}:`, {
        message: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  async leaveMeeting(meetingId: string, userId: string): Promise<void> {
    console.log(
      `VideoCallService: User ${userId} leaving meeting ${meetingId}`
    );
    try {
      await this.videoCallRepository.removeParticipant(meetingId, userId);
      console.log(
        `VideoCallService: User ${userId} removed from meeting ${meetingId}`
      );
    } catch (error: any) {
      console.error(`VideoCallService: Error leaving meeting ${meetingId}:`, {
        message: error.message,
        stack: error.stack,
      });
      throw error;
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
