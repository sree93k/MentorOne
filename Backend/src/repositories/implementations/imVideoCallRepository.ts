// import VideoCall from "../../models/VideoCall";
// import { IVideoCall } from "../../models/VideoCall"; // Make sure to export the interface from your model

// class VideoCallRepository {
//   async createMeeting(meetingData: Partial<IVideoCall>): Promise<IVideoCall> {
//     const videoCall = new VideoCall(meetingData);
//     return await videoCall.save();
//   }

//   async findMeeting(meetingId: string): Promise<IVideoCall | null> {
//     return await VideoCall.findOne({ meetingId });
//   }

//   async addParticipant(meetingId: string, userId: string): Promise<void> {
//     await VideoCall.updateOne(
//       { meetingId },
//       { $push: { participants: { userId, joinedAt: new Date() } } }
//     );
//   }

//   async endMeeting(meetingId: string): Promise<void> {
//     await VideoCall.updateOne({ meetingId }, { $set: { endedAt: new Date() } });
//   }
// }

// export default VideoCallRepository;
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
      { $push: { participants: { userId, joinedAt: new Date() } } }
    );
  }

  async removeParticipant(meetingId: string, userId: string): Promise<void> {
    await VideoCall.updateOne(
      { meetingId },
      { $pull: { participants: { userId } } }
    );
  }

  async endMeeting(meetingId: string): Promise<void> {
    await VideoCall.updateOne({ meetingId }, { $set: { endedAt: new Date() } });
  }
}

export default VideoCallRepository;
