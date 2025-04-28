import stripe from "../../config/stripe";
import { ApiError } from "../../middlewares/errorHandler";
import Booking from "../../models/bookingModel";
import Payment from "../../models/paymentModel";
import Schedule from "../../models/ScheduleModel";
import {
  inPaymentService,
  SaveBookingAndPaymentParams,
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

    console.log("createCheckoutSession params:", params);

    try {
      // Validate inputs
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

      if (amount <= 0) {
        console.error("Invalid amount:", amount);
        throw new ApiError(400, "Amount must be positive", "Invalid amount");
      }

      // Validate schedule
      console.log("Querying Schedule:", { mentorId, day, slotIndex });
      const schedule = await Schedule.findOne({
        mentorId,
        day,
        "slots.index": slotIndex,
        "slots.isAvailable": true,
      }).lean();
      console.log("Schedule result:", schedule);
      if (!schedule) {
        console.error("Schedule not found or slot unavailable:", {
          mentorId,
          day,
          slotIndex,
        });
        throw new ApiError(
          400,
          "Selected slot is not available",
          "Invalid schedule"
        );
      }

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
              unit_amount: Math.round(amount * 100), // Convert to paise
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url:
          process.env.STRIPE_SUCCESS_URL ||
          "http://localhost:5173/seeker/dashboard",
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
      throw new ApiError(
        500,
        error.message || "Failed to create checkout session",
        "Error during checkout session creation"
      );
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

      const schedule = await Schedule.findOne({
        mentorId,
        day,
        "slots.index": slotIndex,
        "slots.isAvailable": true,
      });
      if (!schedule) {
        console.error("Schedule not found:", { mentorId, day, slotIndex });
        throw new ApiError(
          400,
          "Selected slot is not available",
          "Invalid schedule"
        );
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

  async saveBookingAndPayment(
    params: SaveBookingAndPaymentParams
  ): Promise<{ booking: any; payment: any }> {
    const {
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
    } = params;

    console.log("saveBookingAndPayment params:", params);

    try {
      // Validate session
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      console.log(
        "Retrieved session:",
        session.id,
        "payment_status:",
        session.payment_status
      );
      if (session.payment_status !== "paid") {
        console.error("Payment not successful:", session.payment_status);
        throw new ApiError(
          400,
          "Payment not successful",
          "Checkout session verification failed"
        );
      }

      // Validate schedule
      const schedule = await Schedule.findOne({
        mentorId,
        day,
        "slots.index": slotIndex,
        "slots.isAvailable": true,
      });
      console.log("Schedule for saveBooking:", schedule);
      if (!schedule) {
        console.error("Schedule not found:", { mentorId, day, slotIndex });
        throw new ApiError(
          400,
          "Selected slot is not available",
          "Invalid schedule"
        );
      }

      // Mark slot as unavailable
      schedule.slots[slotIndex].isAvailable = false;
      await schedule.save();
      console.log("Updated schedule, slot marked unavailable:", slotIndex);

      const booking = new Booking({
        scheduleId: schedule._id,
        serviceId,
        mentorId,
        menteeId,
        day,
        slotIndex,
        startTime,
        endTime,
        bookingDate: new Date(bookingDate),
        status: "confirmed",
        paymentDetails: {
          sessionId,
          amount,
          currency: "inr",
          status: "paid",
          createdAt: new Date(),
        },
      });
      await booking.save();
      console.log("Saved booking:", booking._id);

      const payment = new Payment({
        bookingId: booking._id,
        menteeId,
        amount,
        status: "completed",
        transactionId: sessionId,
      });
      await payment.save();
      console.log("Saved payment:", payment._id);

      return { booking, payment };
    } catch (error: any) {
      console.error("Detailed error in saveBookingAndPayment:", error);
      throw new ApiError(
        500,
        error.message || "Failed to save booking and payment",
        "Error during booking and payment creation"
      );
    }
  }
}
