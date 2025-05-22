import { EVideoCall } from "../../entities/videoCallEntity";

interface IVideoCallRepository {
  createMeeting(meetingData: Partial<EVideoCall>): Promise<EVideoCall>;
  findMeeting(meetingId: string): Promise<EVideoCall | null>;
  addParticipant(meetingId: string, userId: string): Promise<void>;
  removeParticipant(meetingId: string, userId: string): Promise<void>;
  endMeeting(meetingId: string): Promise<void>;
}

export default IVideoCallRepository;
