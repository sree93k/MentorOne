import stripe from "../../config/stripe";
import { ApiError } from "../../middlewares/errorHandler";
import mongoose from "mongoose";
import {
  IPaymentService,
  CreateCheckoutSessionParams,
  Payment,
} from "../interface/IPaymentService";
import Stripe from "stripe";
import PaymentRepository from "../../repositories/implementations/PaymentRepository";
import BookingRepository from "../../repositories/implementations/BookingRepository";
import UserRepository from "../../repositories/implementations/UserRepository";
import ServiceRepository from "../../repositories/implementations/ServiceRepository";
import { IBookingRepository } from "../../repositories/interface/IBookingRepository";
import { IUserRepository } from "../../repositories/interface/IUserRepository";
import { IServiceRepository } from "../../repositories/interface/IServiceRepository";
export default class PaymentService implements IPaymentService {
  private paymentRepository: PaymentRepository;
  private bookingRepository: BookingRepository;
  private userRepository: UserRepository;
  private serviceRepository: ServiceRepository;

  constructor() {
    this.paymentRepository = new PaymentRepository();
    this.bookingRepository = new BookingRepository();
    this.userRepository = new UserRepository();
    this.serviceRepository = new ServiceRepository();
  }

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

    console.log("payment service createCheckoutSession params: step 1", params);

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
      console.log("payment service createCheckoutSession params: step 2");
      if (amount <= 0) {
        console.error("Invalid amount:", amount);
        throw new ApiError(400, "Amount must be positive", "Invalid amount");
      }

      console.log("payment service createCheckoutSession params: step 3");
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

  async getAllMenteePayments(menteeId: string): Promise<{
    payments: Payment[];
    totalAmount: number;
    totalCount: number;
  }> {
    try {
      console.log("payment service getAllMenteePayments step 1", menteeId);

      const result = await this.paymentRepository.findAllByMenteeId(menteeId);

      console.log("payment service getAllMenteePayments step 2", result);

      return result;
    } catch (error: any) {
      console.error("Error in getAllMenteePayments service:", error);
      throw new ApiError(500, "Failed to fetch mentee payments", error.message);
    }
  }

  async getAllMentorPayments(mentorId: string): Promise<{
    payments: Payment[];
    totalAmount: number;
    totalCount: number;
  }> {
    try {
      console.log("payment service getAllMentorPayments step 1", mentorId);

      const result = await this.paymentRepository.findAllByMentorId(mentorId);

      console.log("payment service getAllMentorPayments step 2", result);

      return result;
    } catch (error: any) {
      console.error("Error in getAllMentorPayments service:", error);
      throw new ApiError(500, "Failed to fetch mentee payments", error.message);
    }
  }
  async getAllPayments(
    page: number,
    limit: number,
    searchQuery: string,
    status: string
  ): Promise<{
    payments: any[];
    total: number;
  }> {
    try {
      console.log("payment service getAllPayments step 1", {
        page,
        limit,
        searchQuery,
        status,
      });

      const skip = (page - 1) * limit;
      let query: any = {};

      if (status && status !== "All") {
        query.status = status;
      }

      if (searchQuery) {
        const userIds = await this.userRepository.findUsersByNameOrEmail(
          searchQuery
        );
        if (userIds.length > 0) {
          query.$or = [
            { menteeId: { $in: userIds.map((u) => u._id) } },
            { "mentorDetails._id": { $in: userIds.map((u) => u._id) } },
          ];
        } else {
          query.$or = [
            {
              "mentorDetails.firstName": { $regex: searchQuery, $options: "i" },
            },
            {
              "mentorDetails.lastName": { $regex: searchQuery, $options: "i" },
            },
            { "menteeId.firstName": { $regex: searchQuery, $options: "i" } },
            { "menteeId.lastName": { $regex: searchQuery, $options: "i" } },
          ];
        }
      }

      const payments = await this.paymentRepository.findAllPayments(
        skip,
        limit,
        query
      );
      const total = await this.paymentRepository.countAllPayments(query);

      console.log("payment service getAllPayments step 2", {
        payments: payments.length,
        total,
      });
      return { payments, total };
    } catch (error: any) {
      console.error("Error in getAllPayments service:", error);
      throw new ApiError(500, "Failed to fetch payments", error.message);
    }
  }

  async transferToMentor(
    paymentId: string,
    mentorId: string,
    amount: number
  ): Promise<any> {
    try {
      console.log("payment service transferToMentor step 1", {
        paymentId,
        mentorId,
        amount,
      });

      // Verify payment exists and is in pending status
      const payment = await this.paymentRepository.findById(paymentId);
      if (!payment) {
        throw new ApiError(404, "Payment not found");
      }
      if (payment.status !== "pending") {
        throw new ApiError(400, "Payment is not in pending status");
      }

      // Verify mentor exists
      const mentor = await this.userRepository.findById(mentorId);
      if (!mentor) {
        throw new ApiError(404, "Mentor not found");
      }

      const transfer = {
        id: `mock_transfer_${paymentId}`,
        amount: Math.round(amount * 100),
        currency: "inr",
        destination: mentorId,
        status: "succeeded",
      };

      // Update payment status to "transferred"
      const updatedPayment = await this.paymentRepository.update(paymentId, {
        status: "transferred",
        updatedAt: new Date(),
      });

      console.log("payment service transferToMentor step 2", {
        transfer,
        updatedPayment,
      });
      return { transfer, payment: updatedPayment };
    } catch (error: any) {
      console.error("Error in transferToMentor service:", error);
      throw error instanceof ApiError
        ? error
        : new ApiError(
            500,
            "Failed to transfer payment to mentor",
            error.message
          );
    }
  }
}
