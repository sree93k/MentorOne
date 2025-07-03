import { injectable, inject } from "inversify";
import { IBookingService } from "../interface/IBookingService";
import { IBookingRepository } from "../../repositories/interface/IBookingRepository";
import { TYPES } from "../../inversify/types";
import { EBooking } from "../../entities/bookingEntity";
import { logger } from "../../utils/logger";
import AppError from "../../errors/appError";
import { HttpStatus } from "../../constants/HttpStatus";

@injectable()
export class BookingService implements IBookingService {
  constructor(
    @inject(TYPES.IBookingRepository)
    private bookingRepository: IBookingRepository
  ) {}

  async getAllBookings(
    page: number,
    limit: number,
    searchQuery?: string,
    service?: string,
    status?: string
  ): Promise<{ bookings: EBooking[]; total: number }> {
    try {
      logger.debug("Fetching bookings in service", {
        page,
        limit,
        searchQuery,
        service,
        status,
      });
      const [bookings, total] = await Promise.all([
        this.bookingRepository.findAllBookings(
          page,
          limit,
          searchQuery,
          service,
          status
        ),
        this.bookingRepository.count(searchQuery, service, status),
      ]);
      return { bookings, total };
    } catch (error) {
      logger.error("Error fetching bookings in service", {
        error: error instanceof Error ? error.message : String(error),
      });
      throw new AppError(
        "Failed to fetch bookings",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findByMenteeSimple(menteeId: string): Promise<EBooking[]> {
    try {
      logger.debug("Fetching bookings by mentee in service", { menteeId });
      return await this.bookingRepository.findByMenteeSimple(menteeId);
    } catch (error) {
      logger.error("Error fetching bookings by mentee in service", {
        menteeId,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new AppError(
        "Failed to fetch bookings",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
