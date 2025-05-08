import { v4 as uuidv4 } from "uuid";
import VideoCall from "../../models/VideoCall";
import IVideoCallRepository from "../interface/inVideoCallRepository";
import { ApiError } from "../../middlewares/errorHandler";

class VideoCallRepository implements IVideoCallRepository {
  async createMeeting(
    meetingId: string,
    creatorId: string
  ): Promise<VideoCall> {
    const meeting = new VideoCall({
      meetingId,
      creatorId,
      participants: [{ userId: creatorId, joinedAt: new Date() }],
    });
    return await meeting.save();
  }

  async addParticipant(meetingId: string, userId: string): Promise<void> {
    const meeting = await VideoCall.findOne({ meetingId });
    if (!meeting) {
      throw new ApiError(404, "Meeting not found");
    }
    if (!meeting.participants.some((p) => p.userId === userId)) {
      meeting.participants.push({ userId, joinedAt: new Date() });
      await meeting.save();
    }
  }

  async removeParticipant(meetingId: string, userId: string): Promise<void> {
    const meeting = await VideoCall.findOne({ meetingId });
    if (!meeting) {
      throw new ApiError(404, "Meeting not found");
    }
    meeting.participants = meeting.participants.filter(
      (p) => p.userId !== userId
    );
    if (meeting.participants.length === 0) {
      meeting.endedAt = new Date();
    }
    await meeting.save();
  }

  async findMeeting(meetingId: string): Promise<VideoCall | null> {
    return await VideoCall.findOne({ meetingId });
  }
}

export default VideoCallRepository;
