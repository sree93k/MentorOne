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

  // public getBookings = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) => {
  //   try {
  //     console.log("booking controller get bookings step 1");

  //     const menteeId = req?.user?.id;
  //     const page = parseInt(req.query.page as string) || 1;
  //     const limit = parseInt(req.query.limit as string) || 12;
  //     const searchQuery = (req.query.searchQuery as string) || "";
  //     console.log("booking controller get bookings step 2", {
  //       menteeId,
  //       page,
  //       limit,
  //       searchQuery,
  //     });
  //     if (!menteeId) {
  //       throw new ApiError(400, "Mentee ID is required");
  //     }
  //     const { bookings, total } = await this.bookingService.getBookingsByMentee(
  //       menteeId,
  //       page,
  //       limit,
  //       searchQuery
  //     );
  //     console.log("booking controller get bookings step 3", {
  //       bookings,
  //       total,
  //     });
  //     res.json({ data: bookings, total });
  //   } catch (error: any) {
  //     console.log("booking controller get bookings step error", error);
  //     console.error("Error fetching bookings:", error);
  //     next(error);
  //   }
  // };
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
}

export default new BookingController();
