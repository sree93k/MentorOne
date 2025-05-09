// import { v4 as uuidv4 } from "uuid";
// import VideoCall from "../../models/VideoCall";
// import IVideoCallRepository from "../interface/inVideoCallRepository";
// import { ApiError } from "../../middlewares/errorHandler";

// class VideoCallRepository implements IVideoCallRepository {
//   async createMeeting(
//     meetingId: string,
//     creatorId: string
//   ): Promise<VideoCall> {
//     const meeting = new VideoCall({
//       meetingId,
//       creatorId,
//       participants: [{ userId: creatorId, joinedAt: new Date() }],
//     });
//     return await meeting.save();
//   }

//   async addParticipant(meetingId: string, userId: string): Promise<void> {
//     const meeting = await VideoCall.findOne({ meetingId });
//     if (!meeting) {
//       throw new ApiError(404, "Meeting not found");
//     }
//     if (!meeting.participants.some((p) => p.userId === userId)) {
//       meeting.participants.push({ userId, joinedAt: new Date() });
//       await meeting.save();
//     }
//   }

//   async removeParticipant(meetingId: string, userId: string): Promise<void> {
//     const meeting = await VideoCall.findOne({ meetingId });
//     if (!meeting) {
//       throw new ApiError(404, "Meeting not found");
//     }
//     meeting.participants = meeting.participants.filter(
//       (p) => p.userId !== userId
//     );
//     if (meeting.participants.length === 0) {
//       meeting.endedAt = new Date();
//     }
//     await meeting.save();
//   }

//   async findMeeting(meetingId: string): Promise<VideoCall | null> {
//     return await VideoCall.findOne({ meetingId });
//   }
// }

// export default VideoCallRepository;
// Repository for handling database operations
import VideoCall from "../../models/VideoCall";
import { IVideoCall } from "../../models/VideoCall"; // Make sure to export the interface from your model

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
      { $push: { participants: { userId, joinedAt: new Date() } } }
    );
  }

  async endMeeting(meetingId: string): Promise<void> {
    await VideoCall.updateOne({ meetingId }, { $set: { endedAt: new Date() } });
  }
}

export default VideoCallRepository;
