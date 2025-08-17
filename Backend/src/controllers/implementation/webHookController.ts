import { injectable, inject } from "inversify";
import { Request, Response, NextFunction } from "express";
import ApiResponse from "../../utils/apiResponse";
import { ApiError } from "../../middlewares/errorHandler";
import { IPaymentService } from "../../services/interface/IPaymentService";
import { IBookingService } from "../../services/interface/IBookingService";
import { HttpStatus } from "../../constants/HttpStatus";
import { TYPES } from "../../inversify/types";
import { Stripe } from "stripe";

@injectable()
class WebhookController {
  private paymentService: IPaymentService;
  private bookingService: IBookingService;

  constructor(
    @inject(TYPES.IPaymentService) paymentService: IPaymentService,
    @inject(TYPES.IBookingService) bookingService: IBookingService
  ) {
    this.paymentService = paymentService;
    this.bookingService = bookingService;
  }

  public handleWebhook = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("WebhookController handleWebhook step 1", {
        eventType: (req.body as any).type,
      });

      const event = await this.paymentService.constructEvent(
        req.body,
        req.headers["stripe-signature"] as string
      );

      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object as Stripe.Checkout.Session;
          const {
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
          } = session.metadata || {};

          if (
            !serviceId ||
            !mentorId ||
            !menteeId ||
            !bookingDate ||
            !startTime ||
            !endTime ||
            !day ||
            !slotIndex ||
            !amount ||
            !platformPercentage ||
            !platformCharge ||
            !total
          ) {
            throw new ApiError(
              HttpStatus.BAD_REQUEST,
              "Missing required metadata fields"
            );
          }

          if (session.payment_status !== "paid") {
            console.error("Payment not successful", {
              paymentStatus: session.payment_status,
            });
            throw new ApiError(
              HttpStatus.BAD_REQUEST,
              "Checkout session verification failed"
            );
          }

          await this.bookingService.saveBookingAndPayment({
            sessionId: session.id,
            serviceId,
            mentorId,
            menteeId,
            bookingDate,
            startTime,
            endTime,
            day,
            slotIndex: parseInt(slotIndex),
            amount: parseInt(amount),
            platformPercentage: parseInt(platformPercentage),
            platformCharge: parseInt(platformCharge),
            total: parseInt(total),
          });
          console.log("WebhookController handleWebhook step 2", {
            sessionId: session.id,
            action: "booking and payment saved",
          });
          break;
        }
        case "payment_intent.payment_failed": {
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          console.log("WebhookController handleWebhook step 2", {
            paymentIntentId: paymentIntent.id,
            action: "payment failed",
          });
          break;
        }
        default:
          console.log("WebhookController handleWebhook step 2", {
            eventType: event.type,
            action: "unhandled event",
          });
      }

      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(HttpStatus.OK, null, "Webhook processed successfully")
        );
    } catch (error) {
      console.error("Error in handleWebhook:", error);
      next(error);
    }
  };
}

export default WebhookController;
