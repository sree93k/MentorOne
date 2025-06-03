import Booking from "../../models/bookingModel";
import { ApiError } from "../../middlewares/errorHandler";
import { IBookingRepository } from "../interface/IBookingRepository";
import { EBooking } from "../../entities/bookingEntity";
import { response } from "express";

export default class BookingRepository implements IBookingRepository {
  async create(data: any) {
    try {
      const booking = new Booking(data);
      return await booking.save();
    } catch (error: any) {
      throw new ApiError(500, "Failed to create booking", error.message);
    }
  }

  async findById(id: string) {
    try {
      return await Booking.findById(id)
        .populate({
          path: "mentorId",
          select: "firstName lastName profilePicture",
        })
        .populate({
          path: "serviceId",
          select: "title technology price serviceType",
        });
    } catch (error: any) {
      throw new ApiError(500, "Failed to find booking", error.message);
    }
  }

  async findBySessionId(sessionId: string) {
    try {
      return await Booking.findOne({ "paymentDetails.sessionId": sessionId })
        .populate({
          path: "mentorId",
          select: "firstName lastName profilePicture",
        })
        .populate({
          path: "serviceId",
          select: "title technology price serviceType",
        });
    } catch (error: any) {
      throw new ApiError(500, "Failed to find booking", error.message);
    }
  }

  async findByMentee(
    menteeId: string,
    skip: number = 0,
    limit: number = 12,
    query: any = { menteeId }
  ) {
    try {
      console.log("booking repository findByMentee step 1", {
        menteeId,
        skip,
        limit,
        query,
      });

      const response = await Booking.find(query)
        .populate({
          path: "mentorId",
          select: "firstName lastName profilePicture",
        })
        .populate({
          path: "serviceId",
          select:
            "title technology amount type digitalProductType oneToOneType",
        })
        .skip(skip)
        .limit(limit)
        .lean();
      console.log("booking repository findByMentee step 2");
      return response;
    } catch (error: any) {
      console.log("booking repository findByMentee step 3 error", error);
      throw new ApiError(500, "Failed to find bookings", error.message);
    }
  }

  async countByMentee(menteeId: string, query: any = { menteeId }) {
    try {
      const total = await Booking.countDocuments(query);
      return total;
    } catch (error: any) {
      throw new ApiError(
        500,
        "Failed to count bookings by mentee",
        error.message
      );
    }
  }

  async findByMentor(mentorId: string, skip: number = 0, limit: number = 10) {
    try {
      return await Booking.find({ mentorId })
        .populate({
          path: "mentorId",
          select: "firstName lastName profilePicture",
        })
        .populate({
          path: "serviceId",
          select: "title type amount oneToOneType digitalProductType",
        })
        .populate("menteeId", "firstName lastName")
        .skip(skip)
        .limit(limit)
        .lean();
    } catch (error: any) {
      throw new ApiError(500, "Failed to find bookings", error.message);
    }
  }
  async countByMentor(mentorId: string) {
    try {
      const total = await Booking.countDocuments({ mentorId });
      return total;
    } catch (error: any) {
      throw new Error("Failed to count bookings by mentor");
    }
  }
  async update(id: string, data: any) {
    try {
      return await Booking.findByIdAndUpdate(id, data, { new: true })
        .populate({
          path: "mentorId",
          select: "firstName lastName profilePicture",
        })
        .populate({
          path: "serviceId",
          select: "title technology price serviceType",
        });
    } catch (error: any) {
      throw new ApiError(500, "Failed to update booking", error.message);
    }
  }

  async findByMenteeAndService(menteeId: string, serviceId: string) {
    try {
      console.log(
        "booking repository findByMenteeAndService step 1",
        menteeId,
        serviceId
      );
      const booking = await Booking.findOne({ menteeId, serviceId })
        .populate({
          path: "mentorId",
          select: "firstName lastName profilePicture",
        })
        .populate({
          path: "serviceId",
          select: "title technology amount serviceType",
        });
      console.log("booking repository findByMenteeAndService step 2", booking);
      return booking;
    } catch (error: any) {
      throw new ApiError(500, "Failed to find booking", error.message);
    }
  }

  async findAllBookings(
    skip: number,
    limit: number,
    query: any
  ): Promise<EBooking[]> {
    return await Booking.find(query)
      .populate("mentorId", "firstName lastName")
      .populate("menteeId", "firstName lastName email")
      .populate("serviceId", "title type")
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async countAllBookings(query: any): Promise<number> {
    return await Booking.countDocuments(query).exec();
  }

  // async findAllVideoCalls(
  //   mentorId: string,
  //   status?: string,
  //   limit?: number
  // ): Promise<EBooking[]> {
  //   console.log("BookingRepository findAllVideoCalls step 1", {
  //     mentorId,
  //     status,
  //     limit,
  //   });
  //   const query: any = { mentorId, status: status || { $exists: true } };
  //   console.log("BookingRepository findAllVideoCalls step 2", query);
  //   let bookingsQuery = Booking.find(query)
  //     .populate({
  //       path: "serviceId",
  //       match: { oneToOneType: "video" },
  //     })
  //     .populate("menteeId", "firstName lastName") // Populate mentee details
  //     .lean();
  //   console.log("BookingRepository findAllVideoCalls step 3", bookingsQuery);
  //   if (limit) {
  //     bookingsQuery = bookingsQuery.limit(limit);
  //   }

  //   const bookings = await bookingsQuery.exec();
  //   console.log("BookingRepository findAllVideoCalls step 4", bookings);
  //   const videoCallBookings = bookings.filter(
  //     (booking) => booking.serviceId !== null
  //   );
  //   console.log(
  //     "BookingRepository findAllVideoCalls step 5",
  //     videoCallBookings
  //   );

  //   return videoCallBookings;
  // }
  async findAllVideoCalls(
    mentorId: string,
    status?: string,
    limit?: number
  ): Promise<EBooking[]> {
    console.log("BookingRepository findAllVideoCalls step 1", {
      mentorId,
      status,
      limit,
    });
    const query: any = { mentorId };
    if (status) {
      query.status = status;
    }

    let bookingsQuery = Booking.find(query)
      .populate("serviceId")
      .populate("menteeId", "firstName lastName")
      .lean();

    if (limit) {
      bookingsQuery = bookingsQuery.limit(limit);
    }

    const bookings = await bookingsQuery.exec();
    console.log("BookingRepository findAllVideoCalls step 2", bookings);
    return bookings;
  }
}
