export interface BookingParams {
  serviceId: string;
  mentorId: string;
  menteeId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  day: string;
  slotIndex: number;
}

export interface BookServiceParams {
  serviceId: string;
  mentorId: string;
  menteeId: string;
  sessionId: string;
}

export interface inBookingService {
  createBooking(params: BookingParams): Promise<any>;
  saveBookingAndPayment(params: {
    sessionId: string;
    serviceId: string;
    mentorId: string;
    menteeId: string;
    bookingDate: string;
    startTime: string;
    endTime: string;
    day: string;
    slotIndex: number;
    amount: number;
  }): Promise<{ booking: any; payment: any; chat?: any }>;
  getBookingsByMentee(menteeId: string): Promise<any[]>;
  getBookingsByMentor(mentorId: string): Promise<any[]>;
  cancelBooking(bookingId: string): Promise<void>;
  verifyBookingBySessionId(sessionId: string): Promise<any>;
  getAllVideoTutorials(): Promise<any[]>;
  getTutorialById(tutorialId: string): Promise<any>;
  checkBookingStatus(menteeId: string, serviceId: string): Promise<boolean>;
  bookService(params: BookServiceParams): Promise<any>;
}
