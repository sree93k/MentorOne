import { NextFunction, Request, Response } from "express";
import PaymentService from "../../services/implementations/PaymentService";
import BookingService from "../../services/implementations/Bookingservice";
import { IPaymentService } from "../../services/interface/IPaymentService";
import { IBookingService } from "../../services/interface/IBookingService";
import { ApiError } from "../../middlewares/errorHandler";
import stripe from "../../config/stripe";

class BookingController {
  private paymentService: IPaymentService;
  private bookingService: IBookingService;

  constructor() {
    this.paymentService = new PaymentService();
    this.bookingService = new BookingService();
  }

  public createBooking = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const {
      serviceId,
      mentorId,
      bookingDate,
      startTime,
      endTime,
      day,
      slotIndex,
      amount,
      sessionId,
      platformPercentage,
      platformCharge,
      total,
    } = req.body;
    const menteeId = req?.user?.id;
    if (!menteeId) {
      return next(new ApiError(400, "Mentee ID is required"));
    }

    try {
      const result = await this.bookingService.saveBookingAndPayment({
        sessionId,
        serviceId,
        mentorId,
        menteeId,
        bookingDate,
        startTime,
        endTime,
        day,
        slotIndex,
        amount,
        platformPercentage,
        platformCharge,
        total,
      });
      res.json({
        bookingId: result.booking._id,
        paymentId: result.payment._id,
      });
    } catch (error: any) {
      console.error("Error saving booking:", error);
      next(error);
    }
  };

  public getBookings = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log("booking controller get bookings step 1");

      const menteeId = req?.user?.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 12;
      const searchQuery = (req.query.searchQuery as string) || "";
      console.log("booking controller get bookings step 2", {
        menteeId,
        page,
        limit,
        searchQuery,
      });
      if (!menteeId) {
        throw new ApiError(400, "Mentee ID is required");
      }
      const { bookings, total } = await this.bookingService.getBookingsByMentee(
        menteeId,
        page,
        limit,
        searchQuery
      );
      console.log("booking controller get bookings step 3", {
        bookings,
        total,
      });
      res.json({ data: bookings, total });
    } catch (error: any) {
      console.log("booking controller get bookings step error", error);
      console.error("Error fetching bookings:", error);
      next(error);
    }
  };

  public getMentorBookings = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log("booking controller get mentor bookings step 1");

      const mentorId = req?.user?.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      console.log(
        "booking controller get mentor bookings step 2",
        mentorId,
        page,
        limit
      );
      if (!mentorId) {
        throw new ApiError(400, "Mentor ID is required");
      }
      const { bookings, total } = await this.bookingService.getBookingsByMentor(
        mentorId,
        page,
        limit
      );
      console.log(
        "booking controller get mentor bookings step 3",
        bookings,
        total
      );
      res.json({ data: bookings, total });
    } catch (error: any) {
      console.log("booking controller get mentor bookings step error", error);
      console.error("Error fetching mentor bookings:", error);
      next(error);
    }
  };

  public deleteBooking = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { bookingId } = req.params;
    try {
      await this.bookingService.cancelBooking(bookingId);
      res.json({ message: "Booking cancelled" });
    } catch (error: any) {
      console.error("Error cancelling booking:", error);
      next(error);
    }
  };

  public getAllVideoCallsByMentor = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log("BookingController getAllVideoCallsByMentor step 1");
      const mentorId = req?.user?.id;
      const status = req.query.status
        ? Array.isArray(req.query.status)
          ? req.query.status
          : [req.query.status as string]
        : ["confirmed", "rescheduled"]; // Default statuses
      const limit: number = parseInt(req.query.limit as string) || 5;

      if (!mentorId) {
        throw new ApiError(400, "Invalid input");
      }

      const bookings = await this.bookingService.getAllVideoCalls(
        mentorId,
        status,
        limit
      );
      console.log(
        "BookingController getAllVideoCallsByMentor step 2",
        bookings
      );
      res.json({ data: bookings, total: bookings.length });
    } catch (error: any) {
      console.error("Error fetching video call bookings:", error);
      next(error);
    }
  };

  // public updateBookingStatus = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) => {
  //   const { bookingId } = req.params;
  //   const { status, bookingDate, startTime, slotIndex } = req.body;
  //   const mentorId = req?.user?.id;

  //   try {
  //     if (!mentorId) {
  //       throw new ApiError(400, "Mentor ID is required");
  //     }
  //     if (!status) {
  //       throw new ApiError(400, "Status is required");
  //     }
  //     const validStatuses = [
  //       "confirmed",
  //       "rescheduled",
  //       "cancelled",
  //       "pending",
  //       "completed",
  //     ];
  //     if (!validStatuses.includes(status)) {
  //       throw new ApiError(400, "Invalid status value");
  //     }
  //     console.log(
  //       "bookingserviuc update status step 1",
  //       bookingId,
  //       status,
  //       mentorId
  //     );
  //     const updates: any = {
  //       status,
  //       rescheduleRequest: {
  //         rescheduleStatus: status === "rescheduled" ? "approved" : "rejected",
  //       },
  //     };
  //     if (bookingDate) updates.bookingDate = bookingDate;
  //     if (startTime) updates.startTime = startTime;
  //     if (slotIndex !== undefined) updates.slotIndex = slotIndex;

  //     console.log("BookingController updateBookingStatus step 1", {
  //       bookingId,
  //       updates,
  //       mentorId,
  //     });
  //     const updatedBooking = await this.bookingService.updateBookingStatus(
  //       bookingId,
  //       status,
  //       mentorId
  //     );
  //     console.log("bookingserviuc update status step 2");
  //     res.json({
  //       message: "Booking status updated successfully",
  //       booking: updatedBooking,
  //     });
  //   } catch (error: any) {
  //     console.error("Error updating booking status:", error);
  //     next(error);
  //   }
  // };
  // BookingController.ts
  public updateBookingStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { bookingId } = req.params;
    const { status, bookingDate, startTime, slotIndex, rescheduleRequest } =
      req.body;
    const mentorId = req?.user?.id;

    try {
      if (!mentorId) {
        throw new ApiError(400, "Mentor ID is required");
      }
      if (!status) {
        throw new ApiError(400, "Status is required");
      }
      const validStatuses = [
        "confirmed",
        "rescheduled",
        "cancelled",
        "pending",
        "completed",
      ];
      if (!validStatuses.includes(status)) {
        throw new ApiError(400, "Invalid status value");
      }
      if (
        rescheduleRequest &&
        !["noreschedule", "pending", "accepted", "rejected"].includes(
          rescheduleRequest.rescheduleStatus
        )
      ) {
        throw new ApiError(400, "Invalid reschedule status value");
      }

      const updates: any = { status };
      if (bookingDate) updates.bookingDate = bookingDate;
      if (startTime) updates.startTime = startTime;
      if (slotIndex !== undefined) updates.slotIndex = slotIndex;
      if (rescheduleRequest) updates.rescheduleRequest = rescheduleRequest;

      console.log("BookingController updateBookingStatus step 1", {
        bookingId,
        updates,
        mentorId,
      });

      const updatedBooking = await this.bookingService.updateBookingStatus(
        bookingId,
        updates,
        mentorId
      );
      console.log("BookingController updateBookingStatus step 2");
      res.json({
        message: "Booking status updated successfully",
        booking: updatedBooking,
      });
    } catch (error: any) {
      console.error("Error updating booking status:", error);
      next(error);
    }
  };

  // BookingController.ts
  public requestReschedule = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { bookingId } = req.params;
    const { requestedDate, requestedTime, requestedSlotIndex, mentorDecides } =
      req.body;
    const menteeId = req?.user?.id;

    try {
      if (!menteeId) {
        return next(new ApiError(400, "Mentee ID is required"));
      }

      if (
        !mentorDecides &&
        (!requestedDate || !requestedTime || requestedSlotIndex === undefined)
      ) {
        return next(
          new ApiError(
            400,
            "Requested date, time, and slot index are required unless mentor decides"
          )
        );
      }

      const updatedBooking = await this.bookingService.requestReschedule(
        bookingId,
        menteeId,
        {
          requestedDate,
          requestedTime,
          requestedSlotIndex,
          mentorDecides,
        }
      );

      res.json({
        message: "Reschedule request submitted successfully",
        booking: updatedBooking,
      });
    } catch (error: any) {
      console.error("Error requesting reschedule:", error);
      next(error);
    }
  };
}

export default new BookingController();
