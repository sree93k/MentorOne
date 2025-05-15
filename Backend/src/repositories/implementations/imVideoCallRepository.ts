import VideoCall from "../../models/VideoCall";
import { IVideoCall } from "../../models/VideoCall";

class VideoCallRepository {
  async createMeeting(meetingData: Partial<IVideoCall>): Promise<IVideoCall> {
    const videoCall = new VideoCall(meetingData);
    return await videoCall.save();
  }

  async findMeeting(meetingId: string): Promise<IVideoCall | null> {
    return await VideoCall.findOne({ meetingId });
  }

  async addParticipant(meetingId: string, userId: string): Promise<void> {
    await VideoCall.updateOne(
      { meetingId },
      {
        $addToSet: {
          participants: { userId, joinedAt: new Date() },
        },
      }
    );
  }

  async removeParticipant(meetingId: string, userId: string): Promise<void> {
    await VideoCall.updateOne(
      { meetingId },
      { $pull: { participants: { userId } } }
    );
  }
  async update(
    meetingId: string,
    updateData: Partial<IVideoCall>
  ): Promise<any> {
    const result = await VideoCall.updateOne(
      { meetingId },
      { $set: updateData }
    );
    return result;
  }
  async endMeeting(meetingId: string): Promise<void> {
    await VideoCall.updateOne({ meetingId }, { $set: { endedAt: new Date() } });
  }
}

export default VideoCallRepository;
