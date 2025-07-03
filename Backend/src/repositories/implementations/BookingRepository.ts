import { injectable, inject } from "inversify";
import { Types, Model, QueryOptions } from "mongoose";
import { IBookingRepository } from "../interface/IBookingRepository";
import BaseRepository from "./BaseRepository";
import { EBooking } from "../../entities/bookingEntity";
import { TYPES } from "../../inversify/types";
import { logger } from "../../utils/logger";
import AppError from "../../errors/appError";
import { HttpStatus } from "../../constants/HttpStatus";

@injectable()
export default class BookingRepository
  extends BaseRepository<EBooking>
  implements IBookingRepository
{
  constructor(@inject(TYPES.BookingModel) model: Model<EBooking>) {
    super(model);
  }

  async findByMenteeSimple(menteeId: string): Promise<EBooking[]> {
    try {
      if (!Types.ObjectId.isValid(menteeId)) {
        logger.error("Invalid mentee ID", { menteeId });
        throw new AppError("Invalid mentee ID", HttpStatus.BAD_REQUEST);
      }
      logger.debug("Fetching bookings by mentee", { menteeId });
      return await this.model
        .find({ menteeId })
        .select("mentorId serviceId date status")
        .lean()
        .exec();
    } catch (error) {
      logger.error("Error fetching bookings by mentee", {
        menteeId,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new AppError(
        "Failed to fetch bookings",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findAll(
    query: any = {},
    options: QueryOptions = {}
  ): Promise<EBooking[]> {
    try {
      logger.debug("Finding all bookings", { query, options });
      return await super.findAll(query);
    } catch (error) {
      logger.error("Error finding all bookings", {
        query,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new AppError(
        "Failed to fetch bookings",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findAllBookings(
    page: number,
    limit: number,
    searchQuery: string = "",
    service: string = "",
    status: string = ""
  ): Promise<EBooking[]> {
    try {
      logger.debug("Fetching all bookings with filters", {
        page,
        limit,
        searchQuery,
        service,
        status,
      });
      const query: any = {};
      if (searchQuery) {
        query.$or = [
          { "mentorId.firstName": { $regex: searchQuery, $options: "i" } },
          { "mentorId.lastName": { $regex: searchQuery, $options: "i" } },
          { "menteeId.firstName": { $regex: searchQuery, $options: "i" } },
          { "menteeId.lastName": { $regex: searchQuery, $options: "i" } },
        ];
      }
      if (service && Types.ObjectId.isValid(service)) {
        query.serviceId = service;
      }
      if (status) {
        query.status = status;
      }

      return await this.model
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
        .exec();
    } catch (error) {
      logger.error("Error fetching bookings", {
        error: error instanceof Error ? error.message : String(error),
      });
      throw new AppError(
        "Failed to fetch bookings",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async count(
    searchQuery: string = "",
    service: string = "",
    status: string = ""
  ): Promise<number> {
    try {
      logger.debug("Counting bookings", { searchQuery, service, status });
      const query: any = {};
      if (searchQuery) {
        query.$or = [
          { "mentorId.firstName": { $regex: searchQuery, $options: "i" } },
          { "mentorId.lastName": { $regex: searchQuery, $options: "i" } },
          { "menteeId.firstName": { $regex: searchQuery, $options: "i" } },
          { "menteeId.lastName": { $regex: searchQuery, $options: "i" } },
        ];
      }
      if (service && Types.ObjectId.isValid(service)) {
        query.serviceId = service;
      }
      if (status) {
        query.status = status;
      }

      return await this.model.countDocuments(query).exec();
    } catch (error) {
      logger.error("Error counting bookings", {
        error: error instanceof Error ? error.message : String(error),
      });
      throw new AppError(
        "Failed to count bookings",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
