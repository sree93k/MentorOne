import VideoCall from "../../models/VideoCall";
import { EVideoCall } from "../../entities/videoCallEntity";
import IVideoCallRepository from "../interface/IVideoCallRepository";
import BaseRepository from "./BaseRepository";

export default class VideoCallRepository
  extends BaseRepository<EVideoCall>
  implements IVideoCallRepository
{
  constructor() {
    super(VideoCall);
  }
  async createMeeting(meetingData: Partial<EVideoCall>): Promise<EVideoCall> {
    const videoCall = new VideoCall(meetingData);
    return await videoCall.save();
  }

  async findMeeting(meetingId: string): Promise<EVideoCall | null> {
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
    const result = await VideoCall.updateOne(
      { meetingId },
      { $pull: { participants: { userId } } }
    );
    if (result.modifiedCount === 0) {
      console.warn(
        `VideoCallRepository: No participant ${userId} found in meeting ${meetingId}`
      );
    } else {
      console.log(
        `VideoCallRepository: Removed participant ${userId} from meeting ${meetingId}`
      );
    }
  }
  async update(
    meetingId: string,
    updateData: Partial<EVideoCall>
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

  // ADD these methods if they don't exist:

  async findActiveMeetingsByUser(userId: string): Promise<any[]> {
    try {
      // Adjust this query based on your VideoCall model structure
      const meetings = await this.model.find({
        $or: [{ creatorId: userId }, { "participants.userId": userId }],
        status: { $ne: "ended" }, // Assuming you have a status field
      });

      return meetings;
    } catch (error) {
      console.error("Error finding active meetings by user:", error);
      return [];
    }
  }

  async removeUserFromMeeting(
    meetingId: string,
    userId: string
  ): Promise<boolean> {
    try {
      const result = await this.model.updateOne(
        { _id: meetingId },
        {
          $pull: { participants: { userId } }, // Remove user from participants array
        }
      );

      return result.modifiedCount > 0;
    } catch (error) {
      console.error("Error removing user from meeting:", error);
      return false;
    }
  }
}
