// import { Request, Response, NextFunction } from "express";
// import PaymentService from "../../services/implementations/PaymentService";
// import BookingService from "../../services/implementations/Bookingservice";
// import { IPaymentService } from "../../services/interface/IPaymentService";
// import { IBookingService } from "../../services/interface/IBookingService";
// import { ApiError } from "../../middlewares/errorHandler";
// import ApiResponse from "../../utils/apiResponse";
// import stripe from "../../config/stripe";
// import { HttpStatus } from "../../constants/HttpStatus";

// interface AuthUser {
//   id: string;
// }

// class PaymentController {
//   private paymentService: IPaymentService;
//   private bookingService: IBookingService;

//   constructor() {
//     this.paymentService = new PaymentService();
//     this.bookingService = new BookingService();
//   }

//   private handleStripeError = (error: any): ApiError => {
//     console.log("PaymentController handleStripeError step 1", { error });
//     if (
//       error.type === "StripeInvalidRequestError" &&
//       error.code === "payment_intent_unexpected_state"
//     ) {
//       return new ApiError(
//         HttpStatus.BAD_REQUEST,
//         "This PaymentIntent has already succeeded and cannot be confirmed again"
//       );
//     } else if (
//       error.type === "StripeInvalidRequestError" &&
//       error.code === "resource_missing"
//     ) {
//       return new ApiError(
//         HttpStatus.NOT_FOUND,
//         "PaymentIntent not found",
//         "This PaymentIntent does not exist"
//       );
//     } else {
//       return new ApiError(
//         HttpStatus.INTERNAL_SERVER_ERROR,
//         "Stripe error occurred",
//         error.message
//       );
//     }
//   };

//   public createCheckoutSession = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       const {
//         serviceId,
//         mentorId,
//         menteeId,
//         amount,
//         bookingDate,
//         platformPercentage,
//         platformCharge,
//         total,
//         startTime,
//         endTime,
//         day,
//         slotIndex,
//       } = req.body;
//       console.log("PaymentController createCheckoutSession step 1", {
//         reqBody: req.body,
//       });

//       if (!serviceId || !mentorId || !menteeId || !amount || !total) {
//         throw new ApiError(
//           HttpStatus.BAD_REQUEST,
//           "Required fields missing: serviceId, mentorId, menteeId, amount, total"
//         );
//       }

//       // const checkoutSession = await this.paymentService.createCheckoutSession({
//       //   serviceId,
//       //   mentorId,
//       //   menteeId,
//       //   amount,
//       //   bookingDate,
//       //   platformPercentage,
//       //   platformCharge,
//       //   total,
//       //   startTime,
//       //   endTime,
//       //   day,
//       //   slotIndex,
//       // });
//       const checkoutSession = await this.paymentService.createCheckoutSession({
//         serviceId,
//         mentorId,
//         menteeId,
//         amount,
//         bookingDate,
//         platformPercentage,
//         platformCharge,
//         total,
//         startTime,
//         endTime,
//         day,
//         slotIndex,
//         testFailure: req.body.testFailure || false, // 👈 add this
//       });
//       console.log("PaymentController createCheckoutSession step 2", {
//         sessionId: checkoutSession.id,
//       });

//       res
//         .status(HttpStatus.OK)
//         .json(
//           new ApiResponse(
//             HttpStatus.OK,
//             { sessionId: checkoutSession.id },
//             "Checkout session created successfully"
//           )
//         );
//     } catch (error) {
//       console.error("Error in createCheckoutSession:", error);
//       if (error instanceof ApiError) {
//         next(error);
//       } else {
//         next(this.handleStripeError(error));
//       }
//     }
//   };

//   public createPaymentIntent = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       const {
//         amount,
//         serviceId,
//         mentorId,
//         menteeId,
//         bookingDate,
//         platformPercentage,
//         platformCharge,
//         total,
//         startTime,
//         endTime,
//         day,
//         slotIndex,
//       } = req.body;
//       console.log("PaymentController createPaymentIntent step 1", {
//         reqBody: req.body,
//       });

//       if (!amount || !serviceId || !mentorId || !menteeId || !total) {
//         throw new ApiError(
//           HttpStatus.BAD_REQUEST,
//           "Required fields missing: amount, serviceId, mentorId, menteeId, total"
//         );
//       }

//       const paymentIntent = await this.paymentService.createPaymentIntent({
//         amount,
//         serviceId,
//         mentorId,
//         menteeId,
//         bookingDate,
//         platformPercentage,
//         platformCharge,
//         total,
//         startTime,
//         endTime,
//         day,
//         slotIndex,
//       });
//       console.log("PaymentController createPaymentIntent step 2", {
//         clientSecret: paymentIntent.client_secret,
//       });

//       res
//         .status(HttpStatus.OK)
//         .json(
//           new ApiResponse(
//             HttpStatus.OK,
//             { clientSecret: paymentIntent.client_secret },
//             "Payment intent created successfully"
//           )
//         );
//     } catch (error) {
//       console.error("Error in createPaymentIntent:", error);
//       next(this.handleStripeError(error));
//     }
//   };

//   public verifySession = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       const { sessionId } = req.params;
//       if (!sessionId) {
//         throw new ApiError(HttpStatus.BAD_REQUEST, "Session ID is required");
//       }
//       console.log("PaymentController verifySession step 1", { sessionId });

//       const session = await stripe.checkout.sessions.retrieve(sessionId);
//       if (session.payment_status !== "paid") {
//         throw new ApiError(
//           HttpStatus.BAD_REQUEST,
//           "Payment not completed",
//           "Invalid payment status"
//         );
//       }

//       const booking = await this.bookingService.verifyBookingBySessionId(
//         sessionId
//       );
//       if (!booking) {
//         throw new ApiError(HttpStatus.NOT_FOUND, "Booking not found");
//       }
//       console.log("PaymentController verifySession step 2", {
//         bookingId: booking._id,
//       });

//       res
//         .status(HttpStatus.OK)
//         .json(
//           new ApiResponse(
//             HttpStatus.OK,
//             { bookingId: booking._id },
//             "Session verified successfully"
//           )
//         );
//     } catch (error) {
//       console.error("Error in verifySession:", error);
//       if (error instanceof ApiError) {
//         next(error);
//       } else {
//         next(this.handleStripeError(error));
//       }
//     }
//   };

//   public getAllPayments = async (
//     req: Request & { user?: AuthUser },
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       const {
//         page = "1",
//         limit = "10",
//         searchQuery = "",
//         status = "",
//       } = req.query;
//       const mentorId = req.user?.id;
//       console.log("PaymentController getAllPayments step 1", {
//         mentorId,
//         page,
//         limit,
//         searchQuery,
//         status,
//       });

//       if (!mentorId) {
//         throw new ApiError(HttpStatus.UNAUTHORIZED, "User ID is required");
//       }

//       const result = await this.paymentService.getAllPayments(
//         parseInt(page as string, 10),
//         parseInt(limit as string, 10),
//         searchQuery as string,
//         status as string
//       );
//       console.log("PaymentController getAllPayments step 2", { result });

//       res
//         .status(HttpStatus.OK)
//         .json(
//           new ApiResponse(
//             HttpStatus.OK,
//             result,
//             "Payments fetched successfully"
//           )
//         );
//     } catch (error) {
//       console.error("Error in getAllPayments:", error);
//       next(error);
//     }
//   };

//   public getAllMentorPayments = async (
//     req: Request & { user?: AuthUser },
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       const menteeId = req.user?.id;
//       if (!menteeId) {
//         throw new ApiError(HttpStatus.UNAUTHORIZED, "User ID is required");
//       }
//       console.log("PaymentController getAllMentorPayments step 1", {
//         menteeId,
//       });

//       const paymentData = await this.paymentService.getAllMentorPayments(
//         menteeId
//       );
//       console.log("PaymentController getAllMentorPayments step 2", {
//         paymentData,
//       });

//       res
//         .status(HttpStatus.OK)
//         .json(
//           new ApiResponse(
//             HttpStatus.OK,
//             paymentData,
//             "Mentor payments fetched successfully"
//           )
//         );
//     } catch (error) {
//       console.error("Error in getAllMentorPayments:", error);
//       next(error);
//     }
//   };

//   public getMenteeWallet = async (
//     req: Request & { user?: AuthUser },
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       const userId = req.user?.id;
//       const { page = "1", limit = "10" } = req.query;
//       if (!userId) {
//         throw new ApiError(HttpStatus.UNAUTHORIZED, "User ID is required");
//       }
//       console.log("PaymentController getMenteeWallet step 1", {
//         userId,
//         page,
//         limit,
//       });

//       const walletData = await this.paymentService.getMenteeWallet(
//         userId,
//         parseInt(page as string, 10),
//         parseInt(limit as string, 10)
//       );
//       console.log("PaymentController getMenteeWallet step 2", { walletData });

//       res
//         .status(HttpStatus.OK)
//         .json(
//           new ApiResponse(
//             HttpStatus.OK,
//             walletData,
//             "Mentee wallet fetched successfully"
//           )
//         );
//     } catch (error) {
//       console.error("Error in getMenteeWallet:", error);
//       next(error);
//     }
//   };
// }

// export default new PaymentController();
