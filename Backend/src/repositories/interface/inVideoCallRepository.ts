import VideoCall from "../../models/VideoCall";

interface IVideoCallRepository {
  createMeeting(meetingId: string, creatorId: string): Promise<VideoCall>;
  addParticipant(meetingId: string, userId: string): Promise<void>;
  removeParticipant(meetingId: string, userId: string): Promise<void>;
  findMeeting(meetingId: string): Promise<VideoCall | null>;
}

export default IVideoCallRepository;
