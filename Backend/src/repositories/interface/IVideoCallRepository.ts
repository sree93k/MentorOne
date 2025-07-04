import { EVideoCall } from "../../entities/videoCallEntity";

export default interface IVideoCallRepository {
  createMeeting(meetingData: Partial<EVideoCall>): Promise<EVideoCall>;
  findMeeting(meetingId: string): Promise<EVideoCall | null>;
  addParticipant(meetingId: string, userId: string): Promise<void>;
  removeParticipant(meetingId: string, userId: string): Promise<void>;
  endMeeting(meetingId: string): Promise<void>;
  update(
    meetingId: string,
    updateData: Partial<EVideoCall>
  ): Promise<EVideoCall | null>;
}
