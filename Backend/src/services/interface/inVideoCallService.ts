interface IVideoCallService {
  createMeeting(userId: string): Promise<string>;
  startMeeting(creatorId: string): Promise<string>;
  joinMeeting(meetingId: string, userId: string): Promise<void>;
  leaveMeeting(meetingId: string, userId: string): Promise<void>;
  validateMeeting(meetingId: string): Promise<boolean>;
}

export default IVideoCallService;
