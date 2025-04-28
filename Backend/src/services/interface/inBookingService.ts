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

export interface inBookingService {
  createBooking(params: BookingParams): Promise<any>;
  getBookingsByMentee(menteeId: string): Promise<any[]>;
  getBookingsByMentor(mentorId: string): Promise<any[]>;
  cancelBooking(bookingId: string): Promise<void>;
}
