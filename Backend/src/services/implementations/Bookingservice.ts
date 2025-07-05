import { IBookingService } from "../interface/IBookingService";
import { BookingRepository } from "../../repositories/implementations/BookingRepository";
import { EBooking } from "../../entities/bookingEntity";
import { FetchBookingsQueryDto } from "../../dtos/adminDTO";
import { logger } from "../../utils/logger";
import { AppError } from "../../errors/appError";
import { HttpStatus } from "../../constants/HttpStatus";

export class BookingService implements IBookingService {
  constructor(private readonly bookingRepository: BookingRepository) {}

  async findAllBookings(): Promise<EBooking[]> {
    try {
      return await this.bookingRepository.findAllBookings();
    } catch (error) {
      logger.error("Error finding all bookings in BookingService", {
        error: error instanceof Error ? error.message : String(error),
      });
      throw new AppError(
        "Failed to fetch bookings",
        HttpStatus.INTERNAL_SERVER,
        "error",
        "FETCH_ALL_BOOKINGS_ERROR"
      );
    }
  }
}
