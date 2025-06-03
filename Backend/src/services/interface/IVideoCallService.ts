export interface IVideoCallService {
  // createMeeting(userId: string): Promise<string>;
  createMeeting(
    userId: string,
    menteeId?: string,
    bookingId?: string
  ): Promise<string>;
  validateMeeting(meetingId: string): Promise<boolean>;
  joinMeeting(
    meetingId: string,
    userId: string,
    userName: string,
    peerId: string
  ): Promise<{ success: boolean; message: string; meeting: any }>;
  leaveMeeting(meetingId: string, userId: string): Promise<void>;
  endMeeting(meetingId: string, userId: string): Promise<void>;
  notifyMentee(
    mentorId: string,
    menteeId: string,
    meetingId: string,
    bookingId: string
  ): Promise<void>;
}
