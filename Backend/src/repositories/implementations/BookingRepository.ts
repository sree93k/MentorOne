// import { injectable } from "inversify";
// import mongoose from "mongoose";
// import Booking from "../../models/bookingModel";
// import BaseRepository from "../implementations/BaseRepository";
// import { IBookingRepository } from "../interface/IBookingRepository";
// import { EBooking } from "../../entities/bookingEntity";

// @injectable()
// export default class BookingRepository
//   extends BaseRepository<EBooking>
//   implements IBookingRepository
// {
//   constructor() {
//     super(Booking);
//   }

//   async findBySessionId(sessionId: string): Promise<EBooking | null> {
//     return Booking.findOne({ "paymentDetails.sessionId": sessionId })
//       .populate("mentorId", "firstName lastName profilePicture")
//       .populate("serviceId", "title technology price serviceType")
//       .exec();
//   }

//   async findByMentee(
//     menteeId: string,
//     skip = 0,
//     limit = 12,
//     query: any = { menteeId }
//   ): Promise<EBooking[]> {
//     return Booking.find(query)
//       .populate("mentorId", "firstName lastName profilePicture")
//       .populate(
//         "serviceId",
//         "title technology amount type digitalProductType oneToOneType slot"
//       )
//       .populate("testimonials", "rating")
//       .skip(skip)
//       .limit(limit)
//       .lean()
//       .exec();
//   }

//   async countByMentee(
//     menteeId: string,
//     query: any = { menteeId }
//   ): Promise<number> {
//     return Booking.countDocuments(query).exec();
//   }

//   async findByMentor(
//     mentorId: string,
//     skip = 0,
//     limit = 10
//   ): Promise<EBooking[]> {
//     return Booking.find({ mentorId })
//       .populate("mentorId", "firstName lastName profilePicture")
//       .populate(
//         "serviceId",
//         "title type amount oneToOneType digitalProductType"
//       )
//       .populate("menteeId", "firstName lastName")
//       .skip(skip)
//       .limit(limit)
//       .lean()
//       .exec();
//   }

//   async countByMentor(mentorId: string): Promise<number> {
//     return Booking.countDocuments({ mentorId }).exec();
//   }

//   async findByMenteeAndService(
//     menteeId: string,
//     serviceId: string
//   ): Promise<EBooking | null> {
//     return Booking.findOne({ menteeId, serviceId })
//       .populate("mentorId", "firstName lastName profilePicture")
//       .populate("serviceId", "title technology amount serviceType")
//       .exec();
//   }

//   async findAllBookings(
//     skip: number,
//     limit: number,
//     query: any
//   ): Promise<EBooking[]> {
//     return Booking.find(query)
//       .populate("mentorId", "firstName lastName")
//       .populate("menteeId", "firstName lastName email")
//       .populate("serviceId", "title type")
//       .skip(skip)
//       .limit(limit)
//       .exec();
//   }

//   async countAllBookings(query: any): Promise<number> {
//     return Booking.countDocuments(query).exec();
//   }

//   async findAllVideoCalls(
//     mentorId: string,
//     status?: string[],
//     limit?: number
//   ): Promise<EBooking[]> {
//     const pipeline: any[] = [
//       {
//         $match: {
//           mentorId: new mongoose.Types.ObjectId(mentorId),
//           ...(status && { status: { $in: status } }),
//         },
//       },
//       {
//         $lookup: {
//           from: "service",
//           localField: "serviceId",
//           foreignField: "_id",
//           as: "service",
//         },
//       },
//       { $unwind: "$service" },
//       {
//         $match: {
//           "service.oneToOneType": "video",
//         },
//       },
//       {
//         $lookup: {
//           from: "users",
//           localField: "menteeId",
//           foreignField: "_id",
//           as: "mentee",
//         },
//       },
//       { $unwind: "$mentee" },
//       {
//         $project: {
//           _id: 1,
//           serviceId: "$service",
//           mentorId: 1,
//           menteeId: {
//             _id: "$mentee._id",
//             firstName: "$mentee.firstName",
//             lastName: "$mentee.lastName",
//           },
//           day: 1,
//           slotIndex: 1,
//           startTime: 1,
//           bookingDate: 1,
//           status: 1,
//           paymentDetails: 1,
//           createdAt: 1,
//           updatedAt: 1,
//         },
//       },
//     ];

//     if (limit) pipeline.push({ $limit: limit });

//     return Booking.aggregate(pipeline).exec();
//   }

//   async findByMenteeWithTestimonials(
//     menteeId: string,
//     skip = 0,
//     limit = 12,
//     query: any = { menteeId }
//   ): Promise<EBooking[]> {
//     return Booking.find(query)
//       .populate("mentorId", "firstName lastName profilePicture")
//       .populate(
//         "serviceId",
//         "title technology amount type digitalProductType oneToOneType slot"
//       )
//       .populate("testimonials", "comment rating")
//       .skip(skip)
//       .limit(limit)
//       .lean()
//       .exec();
//   }

//   async updateBookingStatus(
//     bookingId: string,
//     status: "pending" | "confirmed" | "completed"
//   ): Promise<EBooking> {
//     if (!mongoose.Types.ObjectId.isValid(bookingId)) {
//       throw new Error("Invalid Booking ID");
//     }

//     const booking = await Booking.findByIdAndUpdate(
//       bookingId,
//       { status },
//       { new: true }
//     );

//     if (!booking) {
//       throw new Error("Booking not found");
//     }

//     return booking;
//   }

//   async getBookingsByDashboard(
//     dashboard: "mentor" | "mentee",
//     bookingId: string
//   ): Promise<EBooking> {
//     if (!mongoose.Types.ObjectId.isValid(bookingId)) {
//       throw new Error("Invalid Booking ID");
//     }

//     const booking = await Booking.findOne({ _id: bookingId }).select(
//       "_id status userId mentorId"
//     );

//     if (!booking) {
//       throw new Error("Booking not found");
//     }

//     return booking;
//   }
// }

import { Model } from "mongoose";
import { EBooking } from "../../entities/bookingEntity";
import { IBookingRepository } from "../interface/IBookingRepository";
import BaseRepository from "./BaseRepository";
import { logger } from "../../utils/logger";
import { AppError } from "../../errors/appError";
import { HttpStatus } from "../../constants/HttpStatus";

export class BookingRepository
  extends BaseRepository<EBooking>
  implements IBookingRepository
{
  constructor(model: Model<EBooking>) {
    super(model);
  }

  async findBySessionId(sessionId: string): Promise<EBooking | null> {
    try {
      return await this.model
        .findOne({ "paymentDetails.sessionId": sessionId })
        .populate("mentorId", "firstName lastName profilePicture")
        .populate("serviceId", "title technology price serviceType")
        .exec();
    } catch (error) {
      logger.error("Error finding booking by session ID", {
        sessionId,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new AppError(
        "Failed to find booking by session ID",
        HttpStatus.INTERNAL_SERVER,
        "error",
        "FIND_BOOKING_ERROR"
      );
    }
  }

  async findByMentee(
    menteeId: string,
    skip = 0,
    limit = 12,
    query: any = { menteeId }
  ): Promise<EBooking[]> {
    try {
      return await this.model
        .find(query)
        .populate("mentorId", "firstName lastName profilePicture")
        .populate(
          "serviceId",
          "title technology amount type digitalProductType oneToOneType slot"
        )
        .populate("testimonials", "rating")
        .skip(skip)
        .limit(limit)
        .lean()
        .exec();
    } catch (error) {
      logger.error("Error finding bookings by mentee", {
        menteeId,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new AppError(
        "Failed to find bookings by mentee",
        HttpStatus.INTERNAL_SERVER,
        "error",
        "FIND_MENTEE_BOOKINGS_ERROR"
      );
    }
  }

  async countByMentee(
    menteeId: string,
    query: any = { menteeId }
  ): Promise<number> {
    try {
      return await this.model.countDocuments(query).exec();
    } catch (error) {
      logger.error("Error counting bookings by mentee", {
        menteeId,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new AppError(
        "Failed to count bookings by mentee",
        HttpStatus.INTERNAL_SERVER,
        "error",
        "COUNT_MENTEE_BOOKINGS_ERROR"
      );
    }
  }

  async findByMentor(
    mentorId: string,
    skip = 0,
    limit = 10
  ): Promise<EBooking[]> {
    try {
      return await this.model
        .find({ mentorId })
        .populate("mentorId", "firstName lastName profilePicture")
        .populate(
          "serviceId",
          "title type amount oneToOneType digitalProductType"
        )
        .populate("menteeId", "firstName lastName")
        .skip(skip)
        .limit(limit)
        .lean()
        .exec();
    } catch (error) {
      logger.error("Error finding bookings by mentor", {
        mentorId,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new AppError(
        "Failed to find bookings by mentor",
        HttpStatus.INTERNAL_SERVER,
        "error",
        "FIND_MENTOR_BOOKINGS_ERROR"
      );
    }
  }

  async countByMentor(mentorId: string): Promise<number> {
    try {
      return await this.model.countDocuments({ mentorId }).exec();
    } catch (error) {
      logger.error("Error counting bookings by mentor", {
        mentorId,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new AppError(
        "Failed to count bookings by mentor",
        HttpStatus.INTERNAL_SERVER,
        "error",
        "COUNT_MENTOR_BOOKINGS_ERROR"
      );
    }
  }

  async findByMenteeAndService(
    menteeId: string,
    serviceId: string
  ): Promise<EBooking | null> {
    try {
      return await this.model
        .findOne({ menteeId, serviceId })
        .populate("mentorId", "firstName lastName profilePicture")
        .populate("serviceId", "title technology amount serviceType")
        .exec();
    } catch (error) {
      logger.error("Error finding booking by mentee and service", {
        menteeId,
        serviceId,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new AppError(
        "Failed to find booking by mentee and service",
        HttpStatus.INTERNAL_SERVER,
        "error",
        "FIND_MENTEE_SERVICE_BOOKING_ERROR"
      );
    }
  }

  async findAllBookings(
    skip: number,
    limit: number,
    query: any
  ): Promise<EBooking[]> {
    try {
      return await this.model
        .find(query)
        .populate("mentorId", "firstName lastName")
        .populate("menteeId", "firstName lastName email")
        .populate("serviceId", "title type")
        .skip(skip)
        .limit(limit)
        .exec();
    } catch (error) {
      logger.error("Error finding all bookings", {
        query,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new AppError(
        "Failed to find all bookings",
        HttpStatus.INTERNAL_SERVER,
        "error",
        "FIND_ALL_BOOKINGS_ERROR"
      );
    }
  }

  async countAllBookings(query: any): Promise<number> {
    try {
      return await this.model.countDocuments(query).exec();
    } catch (error) {
      logger.error("Error counting all bookings", {
        query,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new AppError(
        "Failed to count all bookings",
        HttpStatus.INTERNAL_SERVER,
        "error",
        "COUNT_ALL_BOOKINGS_ERROR"
      );
    }
  }

  async findAllVideoCalls(
    mentorId: string,
    status?: string[],
    limit?: number
  ): Promise<EBooking[]> {
    try {
      const pipeline: any[] = [
        {
          $match: {
            mentorId: new this.model.mongo.Types.ObjectId(mentorId),
            ...(status && { status: { $in: status } }),
          },
        },
        {
          $lookup: {
            from: "services",
            localField: "serviceId",
            foreignField: "_id",
            as: "service",
          },
        },
        { $unwind: "$service" },
        {
          $match: {
            "service.oneToOneType": "video",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "menteeId",
            foreignField: "_id",
            as: "mentee",
          },
        },
        { $unwind: "$mentee" },
        {
          $project: {
            _id: 1,
            serviceId: "$service",
            mentorId: 1,
            menteeId: {
              _id: "$mentee._id",
              firstName: "$mentee.firstName",
              lastName: "$mentee.lastName",
            },
            day: 1,
            slotIndex: 1,
            startTime: 1,
            bookingDate: 1,
            status: 1,
            paymentDetails: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        },
      ];

      if (limit) pipeline.push({ $limit: limit });

      return await this.model.aggregate(pipeline).exec();
    } catch (error) {
      logger.error("Error finding video calls", {
        mentorId,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new AppError(
        "Failed to find video calls",
        HttpStatus.INTERNAL_SERVER,
        "error",
        "FIND_VIDEO_CALLS_ERROR"
      );
    }
  }

  async findByMenteeWithTestimonials(
    menteeId: string,
    skip = 0,
    limit = 12,
    query: any = { menteeId }
  ): Promise<EBooking[]> {
    try {
      return await this.model
        .find(query)
        .populate("mentorId", "firstName lastName profilePicture")
        .populate(
          "serviceId",
          "title technology amount type digitalProductType oneToOneType slot"
        )
        .populate("testimonials", "comment rating")
        .skip(skip)
        .limit(limit)
        .lean()
        .exec();
    } catch (error) {
      logger.error("Error finding bookings with testimonials", {
        menteeId,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new AppError(
        "Failed to find bookings with testimonials",
        HttpStatus.INTERNAL_SERVER,
        "error",
        "FIND_BOOKINGS_TESTIMONIALS_ERROR"
      );
    }
  }

  async updateBookingStatus(
    bookingId: string,
    status: "pending" | "confirmed" | "completed"
  ): Promise<EBooking> {
    try {
      if (!this.model.mongo.Types.ObjectId.isValid(bookingId)) {
        throw new AppError(
          "Invalid Booking ID",
          HttpStatus.BAD_REQUEST,
          "warn",
          "INVALID_BOOKING_ID"
        );
      }

      const booking = await this.model
        .findByIdAndUpdate(bookingId, { status }, { new: true })
        .exec();

      if (!booking) {
        throw new AppError(
          "Booking not found",
          HttpStatus.NOT_FOUND,
          "warn",
          "BOOKING_NOT_FOUND"
        );
      }

      return booking;
    } catch (error) {
      logger.error("Error updating booking status", {
        bookingId,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error instanceof AppError
        ? error
        : new AppError(
            "Failed to update booking status",
            HttpStatus.INTERNAL_SERVER,
            "error",
            "UPDATE_BOOKING_STATUS_ERROR"
          );
    }
  }

  async getBookingsByDashboard(
    dashboard: "mentor" | "mentee",
    bookingId: string
  ): Promise<EBooking> {
    try {
      if (!this.model.mongo.Types.ObjectId.isValid(bookingId)) {
        throw new AppError(
          "Invalid Booking ID",
          HttpStatus.BAD_REQUEST,
          "warn",
          "INVALID_BOOKING_ID"
        );
      }

      const booking = await this.model
        .findOne({ _id: bookingId })
        .select("_id status userId mentorId")
        .exec();

      if (!booking) {
        throw new AppError(
          "Booking not found",
          HttpStatus.NOT_FOUND,
          "warn",
          "BOOKING_NOT_FOUND"
        );
      }

      return booking;
    } catch (error) {
      logger.error("Error fetching booking by dashboard", {
        bookingId,
        dashboard,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error instanceof AppError
        ? error
        : new AppError(
            "Failed to fetch booking by dashboard",
            HttpStatus.INTERNAL_SERVER,
            "error",
            "FETCH_BOOKING_DASHBOARD_ERROR"
          );
    }
  }
}
