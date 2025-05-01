// import { Request, Response, NextFunction } from "express";
// import imPaymentService from "../../services/implementations/imPaymentService";
// import { inPaymentService } from "../../services/interface/inPaymentService";
// import { ApiError } from "../../middlewares/errorHandler";
// import ApiResponse from "../../utils/apiResponse";

// class PaymentController {
//   private paymentService: inPaymentService;

//   constructor() {
//     this.paymentService = new imPaymentService();
//   }

//   private handleStripeError = (
//     error: any,
//     res: Response,
//     next: NextFunction
//   ) => {
//     console.log("payemntController handleStripeError step 1");
//     if (
//       error.type === "StripeInvalidRequestError" &&
//       error.code === "payment_intent_unexpected_state"
//     ) {
//       console.log("payemntController handleStripeError step 2");
//       res.status(400).json({
//         error:
//           "This PaymentIntent has already succeeded and cannot be confirmed again.",
//       });
//       console.log("payemntController handleStripeError step 3");
//     } else if (
//       error.type === "StripeInvalidRequestError" &&
//       error.code === "resource_missing"
//     ) {
//       console.log("payemntController handleStripeError step 4");
//       res
//         .status(404)
//         .json(
//           new ApiError(
//             404,
//             "PaymentIntent not found",
//             "This PaymentIntent does not exist"
//           )
//         );
//     } else {
//       console.log("payemntController handleStripeError step 5 errro ", error);
//       next(error);
//     }
//   };

//   public createCheckoutSession = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) => {
//     const {
//       serviceId,
//       mentorId,
//       menteeId,
//       amount,
//       bookingDate,
//       startTime,
//       endTime,
//       day,
//       slotIndex,
//     } = req.body;

//     console.log(
//       "payemntcontroller createCheckoutSession request: step 1",
//       req.body
//     );
//     try {
//       console.log("payemntcontroller createCheckoutSession request: step 2");
//       const checkoutSession = await this.paymentService.createCheckoutSession({
//         serviceId,
//         mentorId,
//         menteeId,
//         amount,
//         bookingDate,
//         startTime,
//         endTime,
//         day,
//         slotIndex,
//       });
//       console.log(
//         "payemntcontroller createCheckoutSession request: step 3",
//         checkoutSession
//       );
//       res.json({ sessionId: checkoutSession.id }); // Changed from { id: ... } to { sessionId: ... }
//     } catch (error: any) {
//       console.log(
//         "payemntcontroller createCheckoutSession request: step 4 error",
//         error
//       );
//       console.error("Error in createCheckoutSession controller:", error);
//       if (error instanceof ApiError) {
//         res.status(error.statusCode).json({ error: error.message });
//       } else if (error.type === "StripeInvalidRequestError") {
//         console.log(
//           "payemntcontroller createCheckoutSession request: step 5 errror",
//           error
//         );
//         res
//           .status(400)
//           .json({ error: error.message || "Invalid request to Stripe API" });
//       } else {
//         res.status(500).json({ error: "Failed to create checkout session" });
//       }
//     }
//   };

//   public createPaymentIntent = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) => {
//     const {
//       amount,
//       serviceId,
//       mentorId,
//       menteeId,
//       bookingDate,
//       startTime,
//       endTime,
//       day,
//       slotIndex,
//     } = req.body;

//     try {
//       console.log("payemntcontroller createPaymentIntent step 1");

//       const paymentIntent = await this.paymentService.createPaymentIntent({
//         amount,
//         serviceId,
//         mentorId,
//         menteeId,
//         bookingDate,
//         startTime,
//         endTime,
//         day,
//         slotIndex,
//       });
//       console.log("payemntcontroller createPaymentIntent step 2");
//       res.json({ data: { clientSecret: paymentIntent.client_secret } });
//       console.log("payemntcontroller createPaymentIntent step 3");
//     } catch (error) {
//       console.log("payemntcontroller createPaymentIntent step 4", error);
//       this.handleStripeError(error, res, next);
//     }
//   };

//   public saveBooking = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) => {
//     const {
//       serviceId,
//       mentorId,
//       menteeId,
//       bookingDate,
//       startTime,
//       endTime,
//       day,
//       slotIndex,
//       paymentIntentId,
//       amount,
//     } = req.body;

//     try {
//       console.log("payemntcontroller saveBooking step 1");
//       const result = await this.paymentService.saveBookingAndPayment({
//         sessionId: paymentIntentId,
//         serviceId,
//         mentorId,
//         menteeId,
//         bookingDate,
//         startTime,
//         endTime,
//         day,
//         slotIndex,
//         amount,
//       });
//       console.log("payemntcontroller saveBooking step 2");
//       res.json(new ApiResponse(200, result, "Booking and payment saved"));
//     } catch (error) {
//       next(error);
//     }
//   };
// }

// export default new PaymentController();
import { Request, Response, NextFunction } from "express";
import imPaymentService from "../../services/implementations/imPaymentService";
import imBookingService from "../../services/implementations/imBookingservice";
import { inPaymentService } from "../../services/interface/inPaymentService";
import { inBookingService } from "../../services/interface/inBookingService";
import { ApiError } from "../../middlewares/errorHandler";
import ApiResponse from "../../utils/apiResponse";
import stripe from "../../config/stripe";

class PaymentController {
  private paymentService: inPaymentService;
  private bookingService: inBookingService;

  constructor() {
    this.paymentService = new imPaymentService();
    this.bookingService = new imBookingService();
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
}

export default new PaymentController();
