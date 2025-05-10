import { IVideoCall } from "../../models/VideoCall";

interface IVideoCallRepository {
  createMeeting(meetingId: string, creatorId: string): Promise<IVideoCall>;
  findMeeting(meetingId: string): Promise<IVideoCall | null>;
  addParticipant(meetingId: string, userId: string): Promise<void>;
  removeParticipant(meetingId: string, userId: string): Promise<void>;
  endMeeting(meetingId: string): Promise<void>;
}

export default IVideoCallRepository;
