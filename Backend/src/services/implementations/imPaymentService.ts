import stripe from "../../config/stripe";
import { ApiError } from "../../middlewares/errorHandler";
import {
  inPaymentService,
  CreateCheckoutSessionParams,
} from "../interface/inPaymentService";
import Stripe from "stripe";

export default class PaymentService implements inPaymentService {
  async createCheckoutSession(
    params: CreateCheckoutSessionParams
  ): Promise<Stripe.Checkout.Session> {
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
    } = params;

    console.log(
      "payment serviuce createCheckoutSession params: step 1",
      params
    );

    try {
      if (
        !serviceId ||
        !mentorId ||
        !menteeId ||
        !amount ||
        !bookingDate ||
        !startTime ||
        !endTime ||
        !day ||
        slotIndex === undefined
      ) {
        console.error("Missing required fields:", params);
        throw new ApiError(400, "Missing required fields", "Invalid input");
      }
      console.log("payment serviuce createCheckoutSession params: step 2");
      if (amount <= 0) {
        console.error("Invalid amount:", amount);
        throw new ApiError(400, "Amount must be positive", "Invalid amount");
      }

      console.log("payment serviuce createCheckoutSession params: step 3");
      console.log("Calling stripe.checkout.sessions.create");
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "inr",
              product_data: {
                name: "Mentorship Session",
                metadata: { serviceId, mentorId, menteeId },
              },
              unit_amount: Math.round(amount * 100),
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${
          process.env.STRIPE_SUCCESS_URL ||
          "http://localhost:5173/seeker/bookings"
        }?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url:
          process.env.STRIPE_CANCEL_URL ||
          "http://localhost:5173/seeker/mentorservice",
        metadata: {
          serviceId,
          mentorId,
          menteeId,
          bookingDate,
          startTime,
          endTime,
          day,
          slotIndex: slotIndex.toString(),
          amount: amount.toString(),
        },
      });

      console.log("Created checkout session:", session.id);
      return session;
    } catch (error: any) {
      console.error("Detailed error in createCheckoutSession:", error);
      throw error;
    }
  }

  async createPaymentIntent(
    params: CreateCheckoutSessionParams
  ): Promise<Stripe.PaymentIntent> {
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
    } = params;

    console.log("createPaymentIntent params:", params);

    try {
      if (
        !serviceId ||
        !mentorId ||
        !menteeId ||
        !amount ||
        !bookingDate ||
        !startTime ||
        !endTime ||
        !day ||
        slotIndex === undefined
      ) {
        console.error("Missing required fields:", params);
        throw new ApiError(400, "Missing required fields", "Invalid input");
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: "inr",
        payment_method_types: ["card"],
        metadata: {
          serviceId,
          mentorId,
          menteeId,
          bookingDate,
          startTime,
          endTime,
          day,
          slotIndex: slotIndex.toString(),
          amount: amount.toString(),
        },
      });

      console.log("Created payment intent:", paymentIntent.id);
      return paymentIntent;
    } catch (error: any) {
      console.error("Detailed error in createPaymentIntent:", error);
      throw new ApiError(
        500,
        error.message || "Failed to create payment intent",
        "Error during payment intent creation"
      );
    }
  }

  async constructEvent(
    payload: Buffer,
    signature: string
  ): Promise<Stripe.Event> {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("Missing STRIPE_WEBHOOK_SECRET");
      throw new ApiError(
        500,
        "Webhook secret is not configured",
        "Missing STRIPE_WEBHOOK_SECRET"
      );
    }
    try {
      return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (error: any) {
      console.error("Webhook constructEvent error:", error);
      throw new ApiError(
        400,
        error.message || "Webhook signature verification failed",
        "Error in constructEvent"
      );
    }
  }
}
