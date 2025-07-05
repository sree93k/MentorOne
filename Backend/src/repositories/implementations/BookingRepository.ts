import { Model } from "mongoose";
import BaseRepository from "./BaseRepository";
import { EBooking } from "../../entities/bookingEntity";
import { FetchBookingsQueryDto } from "../../dtos/adminDTO";
import { logger } from "../../utils/logger";
import { AppError } from "../../errors/appError";
import { HttpStatus } from "../../constants/HttpStatus";

export class BookingRepository extends BaseRepository<EBooking> {
  constructor(model: Model<EBooking>) {
    super(model);
  }

  async findAllBookings(): Promise<EBooking[]> {
    try {
      return await this.model
        .find({})
        .populate("serviceId mentorId menteeId")
        .exec();
    } catch (error) {
      logger.error("Error finding all bookings", {
        error: error instanceof Error ? error.message : String(error),
      });
      throw new AppError(
        "Failed to find bookings",
        HttpStatus.INTERNAL_SERVER,
        "error",
        "FIND_ALL_BOOKINGS_ERROR"
      );
    }
  }
}
