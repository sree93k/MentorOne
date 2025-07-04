import { injectable } from "inversify";
import VideoCallModel from "../../models/VideoCall";
import { EVideoCall } from "../../entities/videoCallEntity";
import IVideoCallRepository from "../interface/IVideoCallRepository";
import BaseRepository from "./BaseRepository";

@injectable()
export default class VideoCallRepository
  extends BaseRepository<EVideoCall>
  implements IVideoCallRepository
{
  constructor() {
    super(VideoCallModel);
  }
  async createMeeting(meetingData: Partial<EVideoCall>): Promise<EVideoCall> {
    const meeting = new VideoCallModel(meetingData);
    return await meeting.save();
  }

  async findMeeting(meetingId: string): Promise<EVideoCall | null> {
    return await VideoCallModel.findOne({ meetingId }).exec();
  }

  async addParticipant(meetingId: string, userId: string): Promise<void> {
    await VideoCallModel.updateOne(
      { meetingId },
      {
        $addToSet: {
          participants: {
            userId,
            joinedAt: new Date(),
          },
        },
      }
    ).exec();
  }

  async removeParticipant(meetingId: string, userId: string): Promise<void> {
    const result = await VideoCallModel.updateOne(
      { meetingId },
      { $pull: { participants: { userId } } }
    ).exec();

    if (result.modifiedCount === 0) {
      console.warn(
        `[VideoCallRepository] Participant ${userId} not found in ${meetingId}`
      );
    }
  }

  async update(
    meetingId: string,
    updateData: Partial<EVideoCall>
  ): Promise<EVideoCall | null> {
    return await VideoCallModel.findOneAndUpdate({ meetingId }, updateData, {
      new: true,
    }).exec();
  }

  async endMeeting(meetingId: string): Promise<void> {
    await VideoCallModel.updateOne(
      { meetingId },
      { $set: { endedAt: new Date() } }
    ).exec();
  }
}
