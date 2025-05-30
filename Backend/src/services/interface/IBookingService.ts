import { EService } from "../../entities/serviceEntity";

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

interface SaveBookingAndPaymentParams {
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
}

interface BookServiceParams {
  serviceId: string;
  mentorId: string;
  menteeId: string;
  sessionId: string;
}

export interface IBookingService {
  createBooking(params: BookingParams): Promise<any>;
  getBookingsByMentee(
    menteeId: string,
    page: number,
    limit: number,
    searchQuery: string
  ): Promise<{ bookings: any[]; total: number }>;
  getBookingsByMentor(
    mentorId: string,
    page: number,
    limit: number
  ): Promise<any[]>;
  cancelBooking(bookingId: string): Promise<void>;
  verifyBookingBySessionId(sessionId: string): Promise<any>;
  saveBookingAndPayment(
    params: SaveBookingAndPaymentParams
  ): Promise<{ booking: any; payment: any; chat?: any }>;
  getAllVideoTutorials(
    type?: string,
    searchQuery?: string,
    page?: number,
    limit?: number
  ): Promise<{ tutorials: any[]; total: number }>;
  getTutorialById(tutorialId: string): Promise<any>;
  checkBookingStatus(menteeId: string, serviceId: string): Promise<boolean>;
  bookService(params: BookServiceParams): Promise<any>;
  getAllBookings(
    page: number,
    limit: number,
    searchQuery: string,
    service: string,
    status: string
  ): Promise<{ bookings: any[]; total: number }>;
  getServiceById(serviceId: string): Promise<EService | null>;
}
