import { NextFunction, Request, Response } from "express";
import imPaymentService from "../../services/implementations/imPaymentService";
import imBookingService from "../../services/implementations/imBookingservice";
import { inPaymentService } from "../../services/interface/inPaymentService";
import { inBookingService } from "../../services/interface/inBookingService";
import { ApiError } from "../../middlewares/errorHandler";
import stripe from "../../config/stripe";

class BookingController {
  private paymentService: inPaymentService;
  private bookingService: inBookingService;

  constructor() {
    this.paymentService = new imPaymentService();
    this.bookingService = new imBookingService();
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
    const menteeId = req?.user?.id; // Extract from JWT

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

  public getBookings = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log("booking controller get bookings step 1");

      const menteeId = req?.user?.id;
      console.log("booking controller get bookings step 2", menteeId);
      if (!menteeId) {
        throw new ApiError(400, "Mentee ID is required");
      }
      const bookings = await this.bookingService.getBookingsByMentee(menteeId);
      console.log("booking controller get bookings step 3", bookings);
      res.json(bookings);
    } catch (error: any) {
      console.log("booking controller get bookings step error", error);
      console.error("Error fetching bookings:", error);
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
