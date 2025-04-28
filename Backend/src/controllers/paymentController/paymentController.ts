import { Request, Response, NextFunction } from "express";
import imPaymentService from "../../services/implementations/imPaymentService";
import { inPaymentService } from "../../services/interface/inPaymentService";
import { ApiError } from "../../middlewares/errorHandler";
import ApiResponse from "../../utils/apiResponse";

class PaymentController {
  private paymentService: inPaymentService;

  constructor() {
    this.paymentService = new imPaymentService();
  }

  private handleStripeError = (
    error: any,
    res: Response,
    next: NextFunction
  ) => {
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
      startTime,
      endTime,
      day,
      slotIndex,
    } = req.body;

    try {
      const checkoutSession = await this.paymentService.createCheckoutSession({
        serviceId,
        mentorId,
        menteeId,
        amount,
        bookingDate,
        startTime,
        endTime,
        day,
        slotIndex,
      });
      res.json({ id: checkoutSession.id });
    } catch (error) {
      next(error);
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
      startTime,
      endTime,
      day,
      slotIndex,
    } = req.body;

    try {
      const paymentIntent = await this.paymentService.createPaymentIntent({
        amount,
        serviceId,
        mentorId,
        menteeId,
        bookingDate,
        startTime,
        endTime,
        day,
        slotIndex,
      });
      res.json({ data: { clientSecret: paymentIntent.client_secret } });
    } catch (error) {
      this.handleStripeError(error, res, next);
    }
  };

  public saveBooking = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const {
      serviceId,
      mentorId,
      menteeId,
      bookingDate,
      startTime,
      endTime,
      day,
      slotIndex,
      paymentIntentId,
      amount,
    } = req.body;

    try {
      const result = await this.paymentService.saveBookingAndPayment({
        sessionId: paymentIntentId,
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
      res.json(new ApiResponse(200, result, "Booking and payment saved"));
    } catch (error) {
      next(error);
    }
  };
}

export default new PaymentController();
