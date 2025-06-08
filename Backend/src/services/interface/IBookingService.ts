import { EService } from "../../entities/serviceEntity";
import { EBooking } from "../../entities/bookingEntity";
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
  platformPercentage: number;
  platformCharge: number;
  total: number;
}

interface BookServiceParams {
  serviceId: string;
  mentorId: string;
  menteeId: string;
  sessionId: string;
}
interface RescheduleParams {
  requestedDate?: string;
  requestedTime?: string;
  requestedSlotIndex?: number;
  mentorDecides: boolean;
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
  getAllVideoCalls(
    mentorId: string,
    status?: string[],
    limit?: number
  ): Promise<EBooking[]>;
  // updateBookingStatus(
  //   bookingId: string,
  //   status: string,
  //   mentorId: string
  // ): Promise<EBooking>;
  // updateBookingStatus(
  //   bookingId: string,
  //   updates: {
  //     status: string;
  //     bookingDate?: string;
  //     startTime?: string;
  //     slotIndex?: number;
  //     rescheduleRequest?: {
  //       rescheduleStatus: "approved" | "rejected";
  //     };
  //   },
  //   mentorId: string
  // ): Promise<EBooking>;
  updateBookingStatus(
    bookingId: string,
    updates: {
      status: string;
      bookingDate?: string;
      startTime?: string;
      slotIndex?: number;
      rescheduleRequest?: {
        rescheduleStatus: "noreschedule" | "pending" | "accepted" | "rejected";
      };
    },
    mentorId: string
  ): Promise<EBooking>;
  requestReschedule(
    bookingId: string,
    menteeId: string,
    params: RescheduleParams
  ): Promise<EBooking>;
  getBookingsWithTestimonialsByMentee(
    menteeId: string,
    page: number,
    limit: number,
    searchQuery: string
  ): Promise<{ bookings: any[]; total: number }>;
  findById(bookingId: string): Promise<any>;
}
