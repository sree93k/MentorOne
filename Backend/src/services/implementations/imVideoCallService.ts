// import { v4 as uuidv4 } from "uuid";
// import IVideoCallService from "../interface/inVideoCallService";
// import IVideoCallRepository from "../../repositories/interface/inVideoCallRepository";
// import { ApiError } from "../../middlewares/errorHandler";

// class VideoCallService implements IVideoCallService {
//   private videoCallRepository: IVideoCallRepository;

//   constructor(videoCallRepository: IVideoCallRepository) {
//     this.videoCallRepository = videoCallRepository;
//   }

//   async createMeeting(userId: string): Promise<string> {
//     return this.startMeeting(userId); // Delegate to startMeeting
//   }

//   async startMeeting(creatorId: string): Promise<string> {
//     const meetingId = uuidv4();
//     await this.videoCallRepository.createMeeting(meetingId, creatorId);
//     return meetingId;
//   }

//   async joinMeeting(meetingId: string, userId: string): Promise<void> {
//     const meeting = await this.videoCallRepository.findMeeting(meetingId);
//     if (!meeting) {
//       throw new ApiError(404, "Meeting not found");
//     }
//     await this.videoCallRepository.addParticipant(meetingId, userId);
//   }

//   async leaveMeeting(meetingId: string, userId: string): Promise<void> {
//     await this.videoCallRepository.removeParticipant(meetingId, userId);
//   }

//   async validateMeeting(meetingId: string): Promise<boolean> {
//     const meeting = await this.videoCallRepository.findMeeting(meetingId);
//     return !!meeting && !meeting.endedAt;
//   }
// }

// export default VideoCallService;
// This is likely how your VideoCallService should be structured
import { v4 as uuidv4 } from "uuid";
import VideoCallRepository from "../../repositories/implementations/imVideoCallRepository";

class VideoCallService {
  private videoCallRepository: VideoCallRepository;

  constructor() {
    this.videoCallRepository = new VideoCallRepository();
  }

  async createMeeting(userId: string): Promise<string> {
    const meetingId = uuidv4();

    await this.videoCallRepository.createMeeting({
      meetingId,
      creatorId: userId,
      participants: [{ userId, joinedAt: new Date() }],
      createdAt: new Date(),
    });

    return meetingId;
  }

  async validateMeeting(meetingId: string): Promise<boolean> {
    const meeting = await this.videoCallRepository.findMeeting(meetingId);
    return !!meeting && !meeting.endedAt;
  }

  async joinMeeting(meetingId: string, userId: string): Promise<void> {
    const meeting = await this.videoCallRepository.findMeeting(meetingId);

    if (!meeting) {
      throw new Error("Meeting not found");
    }

    if (meeting.endedAt) {
      throw new Error("Meeting has ended");
    }

    // Check if user is already a participant
    const existingParticipant = meeting.participants.find(
      (p) => p.userId === userId
    );
    if (!existingParticipant) {
      await this.videoCallRepository.addParticipant(meetingId, userId);
    }
  }

  async endMeeting(meetingId: string, userId: string): Promise<void> {
    const meeting = await this.videoCallRepository.findMeeting(meetingId);

    if (!meeting) {
      throw new Error("Meeting not found");
    }

    // Optional: Check if user is the creator
    if (meeting.creatorId !== userId) {
      throw new Error("Only the creator can end the meeting");
    }

    await this.videoCallRepository.endMeeting(meetingId);
  }
}

export default VideoCallService;
