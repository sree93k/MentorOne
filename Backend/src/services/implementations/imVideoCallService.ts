import { v4 as uuidv4 } from "uuid";
import IVideoCallService from "../interface/inVideoCallService";
import IVideoCallRepository from "../../repositories/interface/inVideoCallRepository";
import { ApiError } from "../../middlewares/errorHandler";

class VideoCallService implements IVideoCallService {
  private videoCallRepository: IVideoCallRepository;

  constructor(videoCallRepository: IVideoCallRepository) {
    this.videoCallRepository = videoCallRepository;
  }
  async createMeeting(userId: string): Promise<string> {
    return this.startMeeting(userId); // Delegate to startMeeting
  }
  async startMeeting(creatorId: string): Promise<string> {
    const meetingId = uuidv4();
    await this.videoCallRepository.createMeeting(meetingId, creatorId);
    return meetingId;
  }

  async joinMeeting(meetingId: string, userId: string): Promise<void> {
    const meeting = await this.videoCallRepository.findMeeting(meetingId);
    if (!meeting) {
      throw new ApiError(404, "Meeting not found");
    }
    await this.videoCallRepository.addParticipant(meetingId, userId);
  }

  async leaveMeeting(meetingId: string, userId: string): Promise<void> {
    await this.videoCallRepository.removeParticipant(meetingId, userId);
  }

  async validateMeeting(meetingId: string): Promise<boolean> {
    const meeting = await this.videoCallRepository.findMeeting(meetingId);
    return !!meeting && !meeting.endedAt;
  }
}

export default VideoCallService;
