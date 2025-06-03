import { Request, Response } from "express";
import PaymentService from "../../services/implementations/PaymentService";
import BookingService from "../../services/implementations/Bookingservice";
import { IPaymentService } from "../../services/interface/IPaymentService";
import { IBookingService } from "../../services/interface/IBookingService";
import { ApiError } from "../../middlewares/errorHandler";
import stripe from "../../config/stripe";

class WebhookController {
  private paymentService: IPaymentService;
  private bookingService: IBookingService;

  constructor() {
    this.paymentService = new PaymentService();
    this.bookingService = new BookingService();
  }

  // public handleWebhook = async (req: Request, res: Response) => {
  //   try {
  //     console.log("Webhook received:", req.body);
  //     const event = await this.paymentService.constructEvent(
  //       req.body,
  //       req.headers["stripe-signature"] as string
  //     );

  //     switch (event.type) {
  //       case "checkout.session.completed": {
  //         const session = event.data.object as any;
  //         const {
  //           serviceId,
  //           mentorId,
  //           menteeId,
  //           bookingDate,
  //           startTime,
  //           endTime,
  //           day,
  //           slotIndex,
  //           amount,
  //         } = session.metadata;

  //         if (session.payment_status !== "paid") {
  //           console.error("Payment not successful:", session.payment_status);
  //           throw new ApiError(
  //             400,
  //             "Payment not successful",
  //             "Checkout session verification failed"
  //           );
  //         }

  //         await this.bookingService.saveBookingAndPayment({
  //           sessionId: session.id,
  //           serviceId,
  //           mentorId,
  //           menteeId,
  //           bookingDate,
  //           startTime,
  //           endTime,
  //           day,
  //           slotIndex: parseInt(slotIndex),
  //           amount: parseInt(amount),
  //         });
  //         console.log(
  //           `Checkout session ${session.id} completed and booking saved.`
  //         );
  //         break;
  //       }
  //       case "payment_intent.payment_failed": {
  //         console.log(`PaymentIntent ${event.data.object.id} failed.`);
  //         break;
  //       }
  //       default:
  //         console.log(`Unhandled event type ${event.type}`);
  //     }

  //     res.sendStatus(200);
  //   } catch (error: any) {
  //     console.error(`Webhook error: ${error.message}`);
  //     res.status(400).send(`Webhook Error: ${error.message}`);
  //   }
  // };
  public handleWebhook = async (req: Request, res: Response) => {
    try {
      const event = await this.paymentService.constructEvent(
        req.body,
        req.headers["stripe-signature"] as string
      );

      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object as any;
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
          } = session.metadata;

          if (session.payment_status !== "paid") {
            console.error("Payment not successful:", session.payment_status);
            throw new ApiError(
              400,
              "Payment not successful",
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
          console.log(
            `Checkout session ${session.id} completed and booking saved.`
          );
          break;
        }
        case "payment_intent.payment_failed": {
          console.log(`PaymentIntent ${event.data.object.id} failed.`);
          break;
        }
        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      res.sendStatus(200);
    } catch (error: any) {
      console.error(`Webhook error: ${error.message}`);
      res.status(400).send(`Webhook Error: ${error.message}`);
    }
  };
}

export default new WebhookController();
