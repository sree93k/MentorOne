// import { Request, Response } from "express";
// import imPaymentService from "../../services/implementations/imPaymentService";
// import { inPaymentService } from "../../services/interface/inPaymentService";
// import { ApiError } from "../../middlewares/errorHandler";

// class WebhookController {
//   private paymentService: inPaymentService;

//   constructor() {
//     this.paymentService = new imPaymentService();
//   }

//   public handleWebhook = async (req: Request, res: Response) => {
//     try {
//       const event = await this.paymentService.constructEvent(
//         req.body,
//         req.headers["stripe-signature"] as string
//       );

//       switch (event.type) {
//         case "payment_intent.succeeded": {
//           const paymentIntent = event.data.object as any;
//           const {
//             serviceId,
//             mentorId,
//             menteeId,
//             bookingDate,
//             startTime,
//             endTime,
//             day,
//             slotIndex,
//             amount,
//           } = paymentIntent.metadata;
//           await this.paymentService.saveBookingAndPayment({
//             sessionId: paymentIntent.id,
//             serviceId,
//             mentorId,
//             menteeId,
//             bookingDate,
//             startTime,
//             endTime,
//             day,
//             slotIndex: parseInt(slotIndex),
//             amount: parseInt(amount),
//           });
//           console.log(
//             `PaymentIntent ${paymentIntent.id} succeeded and booking saved.`
//           );
//           break;
//         }
//         case "checkout.session.completed": {
//           const session = event.data.object as any;
//           const {
//             serviceId,
//             mentorId,
//             menteeId,
//             bookingDate,
//             startTime,
//             endTime,
//             day,
//             slotIndex,
//             amount,
//           } = session.metadata;
//           await this.paymentService.saveBookingAndPayment({
//             sessionId: session.id,
//             serviceId,
//             mentorId,
//             menteeId,
//             bookingDate,
//             startTime,
//             endTime,
//             day,
//             slotIndex: parseInt(slotIndex),
//             amount: parseInt(amount),
//           });
//           console.log(
//             `Checkout session ${session.id} completed and booking saved.`
//           );
//           break;
//         }
//         case "payment_intent.payment_failed":
//           console.log(`PaymentIntent ${event.data.object.id} failed.`);
//           break;
//         default:
//           console.log(`Unhandled event type ${event.type}`);
//       }
//       res.sendStatus(200);
//     } catch (error: any) {
//       console.error(`Webhook error: ${error.message}`);
//       res.status(400).send(`Webhook Error: ${error.message}`);
//     }
//   };
// }
// export default new WebhookController();
import { Request, Response } from "express";
import imPaymentService from "../../services/implementations/imPaymentService";
import imBookingService from "../../services/implementations/imBookingservice";
import { inPaymentService } from "../../services/interface/inPaymentService";
import { inBookingService } from "../../services/interface/inBookingService";
import { ApiError } from "../../middlewares/errorHandler";
import stripe from "../../config/stripe";

class WebhookController {
  private paymentService: inPaymentService;
  private bookingService: inBookingService;

  constructor() {
    this.paymentService = new imPaymentService();
    this.bookingService = new imBookingService();
  }

  public handleWebhook = async (req: Request, res: Response) => {
    try {
      console.log("Webhook received:", req.body);
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
