import { EBooking } from "../../entities/bookingEntity";

export interface IBookingService {
  findAllBookings(): Promise<EBooking[]>;
}
