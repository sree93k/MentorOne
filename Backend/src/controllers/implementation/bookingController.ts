import { NextFunction, Request, Response } from "express";
import PaymentService from "../../services/implementations/PaymentService";
import BookingService from "../../services/implementations/Bookingservice";
import { IPaymentService } from "../../services/interface/IPaymentService";
import { IBookingService } from "../../services/interface/IBookingService";
import { ApiError } from "../../middlewares/errorHandler";
import TestimonialService from "../../services/implementations/TestimonialService";
import { ITestimonialService } from "../../services/interface/ITestimonialService";
import stripe from "../../config/stripe";

class BookingController {
  private paymentService: IPaymentService;
  private bookingService: IBookingService;
  private testimonialService: ITestimonialService;
  constructor() {
    this.paymentService = new PaymentService();
    this.bookingService = new BookingService();
    this.testimonialService = new TestimonialService();
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

  // public submitTestimonial = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) => {
  //   const { bookingId } = req.params; // Fix: Extract from params
  //   const { comment, rating } = req.body;
  //   const menteeId = req?.user?.id;
  //   console.log(
  //     "BookingController submitTestimonial step 1 bookingId",
  //     bookingId
  //   );
  //   console.log("BookingController submitTestimonial step 2 comment", comment);
  //   console.log("BookingController submitTestimonial step 3 rating", rating);
  //   console.log(
  //     "BookingController submitTestimonial step 4 menteeId",
  //     menteeId
  //   );

  //   try {
  //     if (!menteeId) {
  //       throw new ApiError(400, "Mentee ID is required");
  //     }
  //     if (!bookingId) {
  //       throw new ApiError(400, "Booking ID is required");
  //     }

  //     // Verify booking exists
  //     const booking = await this.bookingService.findById(bookingId); // Use findById instead of verifyBookingBySessionId
  //     console.log(
  //       "BookingController submitTestimonial step 5 booking response",
  //       booking
  //     );
  //     if (!booking) {
  //       throw new ApiError(404, "Booking not found");
  //     }

  //     const testimonial = await this.testimonialService.saveTestimonial({
  //       menteeId,
  //       mentorId: booking.mentorId.toString(),
  //       serviceId: booking.serviceId.toString(),
  //       bookingId,
  //       comment,
  //       rating,
  //     });
  //     console.log(
  //       "BookingController submitTestimonial step 6 testimonial response",
  //       testimonial
  //     );

  //     res.json({
  //       message: "Testimonial submitted successfully",
  //       testimonial,
  //     });
  //   } catch (error: any) {
  //     console.error("Error submitting testimonial:", error);
  //     next(error);
  //   }
  // };
  public submitTestimonial = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { bookingId } = req.params;
    const { comment, rating } = req.body;
    const menteeId = req?.user?.id;
    console.log(
      "BookingController submitTestimonial step 1 bookingId",
      bookingId
    );
    console.log("BookingController submitTestimonial step 2 comment", comment);
    console.log("BookingController submitTestimonial step 3 rating", rating);
    console.log(
      "BookingController submitTestimonial step 4 menteeId",
      menteeId
    );

    try {
      if (!menteeId) {
        throw new ApiError(400, "Mentee ID is required");
      }
      if (!bookingId) {
        throw new ApiError(400, "Booking ID is required");
      }

      // Verify booking exists
      const booking = await this.bookingService.findById(bookingId);
      console.log(
        "BookingController submitTestimonial step 5 booking response",
        booking
      );
      if (!booking) {
        throw new ApiError(404, "Booking not found");
      }

      const testimonial = await this.testimonialService.saveTestimonial({
        menteeId,
        mentorId: booking.mentorId._id.toString(), // Extract _id as string
        serviceId: booking.serviceId._id.toString(), // Extract _id as string
        bookingId,
        comment,
        rating,
      });
      console.log(
        "BookingController submitTestimonial step 6 testimonial response",
        testimonial
      );

      res.json({
        message: "Testimonial submitted successfully",
        testimonial,
      });
    } catch (error: any) {
      console.error("Error submitting testimonial:", error);
      next(error);
    }
  };

  public updateTestimonial = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { comment, rating } = req.body;

    const testimonialId = req.params.testimonialId;
    const menteeId = req?.user?.id;
    console.log(
      "BookingController updateTestimonial step 1 testimonialId",
      testimonialId
    );
    console.log("BookingController updateTestimonial step 2 comment", comment);
    console.log("BookingController updateTestimonial step 3 rating", rating);
    console.log(
      "BookingController updateTestimonial step 4 menteeId",
      menteeId
    );
    try {
      if (!menteeId) {
        throw new ApiError(400, "Mentee ID is required");
      }

      const testimonial = await this.testimonialService.updateTestimonial({
        testimonialId,
        comment,
        rating,
      });
      console.log(
        "BookingController updateTestimonial step 4 testimonial reponse",
        testimonial
      );
      res.json({
        message: "Testimonial updated successfully",
        testimonial,
      });
    } catch (error: any) {
      console.error("Error updating testimonial:", error);
      next(error);
    }
  };

  public getTestimonialByBookingId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { bookingId } = req.params;
    console.log(
      "BookingController getTestimonialByBookingId step 1 bookingId",
      bookingId
    );

    try {
      if (!bookingId) {
        throw new ApiError(400, "Booking ID is required");
      }
      const testimonial =
        await this.testimonialService.getTestimonialByBookingId(bookingId);
      console.log(
        "BookingController getTestimonialByBookingId step 2 testimonial response",
        testimonial
      );

      res.status(200).json({
        message: testimonial
          ? "Testimonial fetched successfully"
          : "No testimonial found",
        testimonial,
      });
    } catch (error: any) {
      console.error("BookingController getTestimonialByBookingId error", error);
      next(error);
    }
  };

  public getTestimonialsByMentor = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const mentorId = req?.user?.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 9;
    console.log(
      "BookingController getTestimonialsByMentor step 1 mentorId",
      mentorId
    );
    console.log("BookingController getTestimonialsByMentor step 2 page", page);
    console.log(
      "BookingController getTestimonialsByMentor step 3 limit",
      limit
    );

    try {
      if (!mentorId) {
        throw new ApiError(400, "Mentor ID is required");
      }
      const { testimonials, total } =
        await this.testimonialService.getTestimonialsByMentor(
          mentorId,
          page,
          limit
        );
      console.log("BookingController getTestimonialsByMentor step 4 response", {
        testimonials,
        total,
      });

      res.status(200).json({
        message: "Testimonials fetched successfully",
        testimonials,
        total,
        page,
        limit,
      });
    } catch (error: any) {
      console.error("BookingController getTestimonialsByMentor error", error);
      next(error);
    }
  };
  public getTestimonialsByMentorAndService = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { mentorId, serviceId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    console.log(
      "TestimonialController getTestimonialsByMentorAndService step 1",
      {
        mentorId,
        serviceId,
        page,
        limit,
      }
    );

    try {
      if (!mentorId || !serviceId) {
        throw new ApiError(400, "Mentor ID and Service ID are required");
      }
      const { testimonials, total } =
        await this.testimonialService.getTestimonialsByMentorAndService(
          mentorId,
          serviceId,
          page,
          limit
        );
      // console.log("TestimonialController getTestimonialsByMentorAndService step 2", {
      //   testimonials.length,
      //   total,
      // });

      res.status(200).json({
        success: true,
        message: "Testimonials fetched successfully",
        testimonials,
        total,
        page,
        limit,
      });
    } catch (error: any) {
      console.error(
        "TestimonialController getTestimonialsByMentorAndService error",
        error
      );
      next(error);
    }
  };

  public updateBookingServiceStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { bookingId } = req.params;
    const { status } = req.body;
    const user = req.user; // Assuming auth middleware attaches user
    console.log("BookingController updateBookingServiceStatus step 1", {
      bookingId,
      status,
      userId: user?.id,
    });

    try {
      if (!bookingId || !status) {
        throw new ApiError(400, "Booking ID and status are required");
      }
      if (!["pending", "confirmed", "completed"].includes(status)) {
        throw new ApiError(400, "Invalid status");
      }
      // if (user?.role !== "mentor") {
      //   throw new ApiError(403, "Only mentors can update booking status");
      // }
      console.log("BookingController updateBookingServiceStatus step 2");

      const booking = await this.bookingService.updateBookingServiceStatus(
        bookingId,
        status
      );
      console.log(
        "BookingController updateBookingServiceStatus step 3",
        booking
      );
      res.status(200).json({
        success: true,
        message: "Booking status updated successfully",
        booking,
      });
    } catch (error: any) {
      console.error(
        "BookingController updateBookingServiceStatus error",
        error
      );
      next(error);
    }
  };
}

export default new BookingController();
