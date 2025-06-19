import stripe from "../../config/stripe";
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
import WalletRepository from "../../repositories/implementations/WalletRepository";
import { IWalletRepository } from "../../repositories/interface/IWalletRepository";
export default class PaymentService implements IPaymentService {
  private paymentRepository: PaymentRepository;
  private bookingRepository: BookingRepository;
  private userRepository: UserRepository;
  private serviceRepository: ServiceRepository;
  private walletRepository: WalletRepository;

  constructor() {
    this.paymentRepository = new PaymentRepository();
    this.bookingRepository = new BookingRepository();
    this.userRepository = new UserRepository();
    this.serviceRepository = new ServiceRepository();
    this.walletRepository = new WalletRepository();
  }

  async createCheckoutSession(
    params: CreateCheckoutSessionParams
  ): Promise<Stripe.Checkout.Session> {
    const {
      serviceId,
      mentorId,
      menteeId,
      amount,
      platformPercentage,
      platformCharge,
      total,
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
        !platformPercentage ||
        !platformCharge ||
        !total ||
        !startTime ||
        !endTime ||
        !day ||
        slotIndex === undefined
      ) {
        console.error("Missing required fields:", params);
        throw new Error("Missing required fields");
      }
      console.log("payment service createCheckoutSession params: step 2");

      if (amount <= 0 || platformCharge < 0 || total <= 0) {
        console.error("Invalid amounts:", { amount, platformCharge, total });
        throw new Error("Amounts must be valid");
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
              unit_amount: Math.round(total * 100), // Use total for Stripe
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
          platformPercentage: platformPercentage.toString(),
          platformCharge: platformCharge.toString(),
          total: total.toString(),
        },
      });
      // Initialize mentor's wallet if it doesn't exist
      let wallet = await this.walletRepository.findByUserId(mentorId);
      if (!wallet) {
        wallet = await this.walletRepository.createWallet(mentorId);
      }
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
        throw new Error("Missing required fields");
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
      throw new Error(error.message || "Failed to create payment intent");
    }
  }

  async constructEvent(
    payload: Buffer,
    signature: string
  ): Promise<Stripe.Event> {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("Missing STRIPE_WEBHOOK_SECRET");
      throw new Error("Webhook secret is not configured");
    }
    try {
      return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (error: any) {
      console.error("Webhook constructEvent error:", error);
      throw new Error(error.message || "Webhook signature verification failed");
    }
  }

  async getAllMenteePayments(
    menteeId: string,
    page: number,
    limit: number
  ): Promise<{
    payments: any[];
    totalAmount: number;
    totalCount: number;
  }> {
    try {
      console.log("payment service getAllMenteePayments step 1", menteeId);

      const result = await this.paymentRepository.findAllByMenteeId(
        menteeId,
        page,
        limit
      );

      console.log("payment service getAllMenteePayments step 2", result);

      return result;
    } catch (error: any) {
      console.error("Error in getAllMenteePayments service:", error);
      throw new Error("Failed to fetch mentee payments", error.message);
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
      throw new Error("Failed to fetch mentee payments", error.message);
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
      throw new Error("Failed to fetch payments", error.message);
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

      const payment = await this.paymentRepository.findById(paymentId);
      if (!payment) {
        throw new Error("Payment not found");
      }
      if (payment.status !== "completed") {
        throw new Error("Payment is not in completed status");
      }
      if (payment.mentorId.toString() !== mentorId) {
        throw new Error("Mentor ID does not match payment");
      }

      const mentor = await this.userRepository.findById(mentorId);
      if (!mentor) {
        throw new Error("Mentor not found");
      }

      const transferAmount = payment.amount; // Excludes platformCharge

      const wallet = await this.walletRepository.releasePendingBalance(
        mentorId,
        transferAmount,
        paymentId
      );

      const updatedPayment = await this.paymentRepository.update(paymentId, {
        status: "transferred",
        updatedAt: new Date(),
      });

      const transfer = await stripe.transfers.create({
        amount: Math.round(transferAmount * 100),
        currency: "inr",
        destination: mentor?.stripeAccountId, // Assumes mentor has a connected Stripe account
        transfer_group: paymentId,
      });

      console.log("payment service transferToMentor step 2", {
        transfer,
        updatedPayment,
        wallet,
      });
      return { transfer, payment: updatedPayment, wallet };
    } catch (error: any) {
      console.error("Error in transferToMentor service:", error);
      throw error instanceof Error
        ? error
        : new Error("Failed to transfer payment to mentor", error.message);
    }
  }

  async getMenteeWallet(userId: string): Promise<any> {
    try {
      console.log("paymentservice getMenteeWallet step 1", userId);

      const walletData = await this.walletRepository.findByUserId(userId);

      console.log("paymentservice getMenteeWallet step 2", walletData);
      return walletData;
    } catch (error) {
      throw error;
    }
  }
}
