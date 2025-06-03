import { Request, Response, NextFunction } from "express";
import PaymentService from "../../services/implementations/PaymentService";
import BookingService from "../../services/implementations/Bookingservice";
import { IPaymentService } from "../../services/interface/IPaymentService";
import { IBookingService } from "../../services/interface/IBookingService";
import { ApiError } from "../../middlewares/errorHandler";
import ApiResponse from "../../utils/apiResponse";
import stripe from "../../config/stripe";

class PaymentController {
  private paymentService: IPaymentService;
  private bookingService: IBookingService;

  constructor() {
    this.paymentService = new PaymentService();
    this.bookingService = new BookingService();
  }

  private handleStripeError = (
    error: any,
    res: Response,
    next: NextFunction
  ) => {
    console.log("payemntController handleStripeError step 1");
    if (
      error.type === "StripeInvalidRequestError" &&
      error.code === "payment_intent_unexpected_state"
    ) {
      res.status(400).json({
        error:
          "This PaymentIntent has already succeeded and cannot be confirmed again.",
      });
    } else if (
      error.type === "StripeInvalidRequestError" &&
      error.code === "resource_missing"
    ) {
      res
        .status(404)
        .json(
          new ApiError(
            404,
            "PaymentIntent not found",
            "This PaymentIntent does not exist"
          )
        );
    } else {
      next(error);
    }
  };

  public createCheckoutSession = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const {
      serviceId,
      mentorId,
      menteeId,
      amount,
      bookingDate,
      platformPercentage,
      platformCharge,
      total,
      startTime,
      endTime,
      day,
      slotIndex,
    } = req.body;

    console.log(
      "payemntcontroller createCheckoutSession request: step 1",
      req.body
    );
    try {
      console.log("payemntcontroller createCheckoutSession request: step 2");
      const checkoutSession = await this.paymentService.createCheckoutSession({
        serviceId,
        mentorId,
        menteeId,
        amount,
        bookingDate,
        platformPercentage,
        platformCharge,
        total,
        startTime,
        endTime,
        day,
        slotIndex,
      });
      console.log(
        "payemntcontroller createCheckoutSession request: step 3",
        checkoutSession
      );
      res.json({ sessionId: checkoutSession.id });
    } catch (error: any) {
      console.error("Error in createCheckoutSession controller:", error);
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({ error: error.message });
      } else if (error.type === "StripeInvalidRequestError") {
        res
          .status(400)
          .json({ error: error.message || "Invalid request to Stripe API" });
      } else {
        res.status(500).json({ error: "Failed to create checkout session" });
      }
    }
  };

  public createPaymentIntent = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const {
      amount,
      serviceId,
      mentorId,
      menteeId,
      bookingDate,
      platformPercentage,
      platformCharge,
      total,
      startTime,
      endTime,
      day,
      slotIndex,
    } = req.body;

    try {
      console.log("payemntcontroller createPaymentIntent step 1");
      const paymentIntent = await this.paymentService.createPaymentIntent({
        amount,
        serviceId,
        mentorId,
        menteeId,
        bookingDate,
        platformPercentage,
        platformCharge,
        total,
        startTime,
        endTime,
        day,
        slotIndex,
      });
      console.log("payemntcontroller createPaymentIntent step 2");
      res.json({ data: { clientSecret: paymentIntent.client_secret } });
    } catch (error) {
      console.log("payemntcontroller createPaymentIntent step 4", error);
      this.handleStripeError(error, res, next);
    }
  };

  public verifySession = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { sessionId } = req.params;

    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.payment_status !== "paid") {
        throw new ApiError(
          400,
          "Payment not completed",
          "Invalid payment status"
        );
      }

      const booking = await this.bookingService.verifyBookingBySessionId(
        sessionId
      );
      res.json({ bookingId: booking._id });
    } catch (error: any) {
      console.error("Error verifying session:", error);
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Failed to verify session" });
      }
    }
  };

  public getAllPayments = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { page = 1, limit = 10, searchQuery = "", status = "" } = req.query;
    const mentorId = req.user?.id; // Assuming req.user is set by authenticate middleware

    try {
      console.log("paymentController getAllPayments step 1", {
        mentorId,
        page,
        limit,
        searchQuery,
        status,
      });
      const result = await this.paymentService.getAllPayments(
        Number(page),
        Number(limit),
        String(searchQuery),
        String(status)
      );
      console.log("paymentController getAllPayments step 2", result);
      res.json(result);
    } catch (error: any) {
      console.error("Error in getAllPayments controller:", error);
      next(error);
    }
  };

  public getAllMentorPayments = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log("paymentcontroller getAllMentorPayments step 1");
      const menteeId = req.user?.id;
      if (!menteeId) {
        throw new ApiError(
          401,
          "Unauthorized: No mentee ID",
          "Authentication required"
        );
      }

      const paymentData = await this.paymentService.getAllMentorPayments(
        menteeId.toString()
      );
      console.log("paymentcontroller getAllMentorPayments step 2", paymentData);

      res.json(
        new ApiResponse(
          200,
          "Mentee payments fetched successfully",
          paymentData
        )
      );
    } catch (error) {
      console.error("Error in getAllMentorPayments controller:", error);
      next(error);
    }
  };
}

export default new PaymentController();
