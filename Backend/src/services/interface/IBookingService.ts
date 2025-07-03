import { EBooking } from "../../entities/bookingEntity";

export interface IBookingService {
  getAllBookings(
    page: number,
    limit: number,
    searchQuery?: string,
    service?: string,
    status?: string
  ): Promise<{ bookings: EBooking[]; total: number }>;
  findByMenteeSimple(menteeId: string): Promise<EBooking[]>;
}
