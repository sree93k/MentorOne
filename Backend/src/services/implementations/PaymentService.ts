import { injectable, inject } from "inversify";
import stripe from "../../config/stripe";
import { Types } from "mongoose";
import {
  IPaymentService,
  CreateCheckoutSessionParams,
  Payment,
} from "../interface/IPaymentService";
import { TYPES } from "../../inversify/types";
import { IPaymentRepository } from "../../repositories/interface/IPaymentRepository";
import { IBookingRepository } from "../../repositories/interface/IBookingRepository";
import { IUserRepository } from "../../repositories/interface/IUserRepository";
import { IServiceRepository } from "../../repositories/interface/IServiceRepository";
import { IWalletRepository } from "../../repositories/interface/IWalletRepository";
import Stripe from "stripe";
import { logger } from "../../utils/logger";
import AppError from "../../errors/appError";
import { HttpStatus } from "../../constants/HttpStatus";

@injectable()
export default class PaymentService implements IPaymentService {
  constructor(
    @inject(TYPES.IPaymentRepository)
    private paymentRepository: IPaymentRepository,
    @inject(TYPES.IBookingRepository)
    private bookingRepository: IBookingRepository,
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository,
    @inject(TYPES.IServiceRepository)
    private serviceRepository: IServiceRepository,
    @inject(TYPES.IWalletRepository) private walletRepository: IWalletRepository
  ) {}

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

    logger.debug("Creating checkout session", { params });

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
        logger.error("Missing required fields", { params });
        throw new AppError("Missing required fields", HttpStatus.BAD_REQUEST);
      }

      if (amount <= 0 || platformCharge < 0 || total <= 0) {
        logger.error("Invalid amounts", { amount, platformCharge, total });
        throw new AppError("Amounts must be valid", HttpStatus.BAD_REQUEST);
      }

      if (
        !Types.ObjectId.isValid(serviceId) ||
        !Types.ObjectId.isValid(mentorId) ||
        !Types.ObjectId.isValid(menteeId)
      ) {
        logger.error("Invalid ObjectId", { serviceId, mentorId, menteeId });
        throw new AppError("Invalid ObjectId", HttpStatus.BAD_REQUEST);
      }

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
              unit_amount: Math.round(total * 100),
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${
          process.env.STRIPE_SUCCESS_URL ||
          "http://localhost:5173/seeker/bookings"
        }?status=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${
          process.env.STRIPE_CANCEL_URL ||
          "http://localhost:5173/seeker/mentorservice"
        }?status=cancel`,
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

      let wallet = await this.walletRepository.findByUserId(mentorId);
      if (!wallet) {
        wallet = await this.walletRepository.createWallet(mentorId);
      }

      logger.info("Created checkout session", { sessionId: session.id });
      return session;
    } catch (error) {
      logger.error("Error creating checkout session", { error });
      throw error instanceof AppError
        ? error
        : new AppError(
            error.message || "Failed to create checkout session",
            HttpStatus.INTERNAL_SERVER_ERROR
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

    logger.debug("Creating payment intent", { params });

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
        logger.error("Missing required fields", { params });
        throw new AppError("Missing required fields", HttpStatus.BAD_REQUEST);
      }

      if (
        !Types.ObjectId.isValid(serviceId) ||
        !Types.ObjectId.isValid(mentorId) ||
        !Types.ObjectId.isValid(menteeId)
      ) {
        logger.error("Invalid ObjectId", { serviceId, mentorId, menteeId });
        throw new AppError("Invalid ObjectId", HttpStatus.BAD_REQUEST);
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

      logger.info("Created payment intent", {
        paymentIntentId: paymentIntent.id,
      });
      return paymentIntent;
    } catch (error) {
      logger.error("Error creating payment intent", { error });
      throw error instanceof AppError
        ? error
        : new AppError(
            error.message || "Failed to create payment intent",
            HttpStatus.INTERNAL_SERVER_ERROR
          );
    }
  }

  async constructEvent(
    payload: Buffer,
    signature: string
  ): Promise<Stripe.Event> {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      logger.error("Missing STRIPE_WEBHOOK_SECRET");
      throw new AppError(
        "Webhook secret is not configured",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    try {
      return await stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret
      );
    } catch (error) {
      logger.error("Webhook signature verification failed", { error });
      throw new AppError(
        error.message || "Webhook signature verification failed",
        HttpStatus.BAD_REQUEST
      );
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
    logger.debug("Fetching all mentee payments", { menteeId, page, limit });

    try {
      if (!Types.ObjectId.isValid(menteeId)) {
        logger.error("Invalid mentee ID", { menteeId });
        throw new AppError("Invalid mentee ID", HttpStatus.BAD_REQUEST);
      }

      const result = await this.paymentRepository.findAllByMenteeId(
        menteeId,
        page,
        limit
      );
      logger.info("Fetched mentee payments", {
        menteeId,
        totalCount: result.totalCount,
      });
      return result;
    } catch (error) {
      logger.error("Error fetching mentee payments", { error });
      throw error instanceof AppError
        ? error
        : new AppError(
            error.message || "Failed to fetch mentee payments",
            HttpStatus.INTERNAL_SERVER_ERROR
          );
    }
  }

  async getAllMentorPayments(mentorId: string): Promise<{
    payments: Payment[];
    totalAmount: number;
    totalCount: number;
  }> {
    logger.debug("Fetching all mentor payments", { mentorId });

    try {
      if (!Types.ObjectId.isValid(mentorId)) {
        logger.error("Invalid mentor ID", { mentorId });
        throw new AppError("Invalid mentor ID", HttpStatus.BAD_REQUEST);
      }

      const result = await this.paymentRepository.findAllByMentorId(mentorId);
      logger.info("Fetched mentor payments", {
        mentorId,
        totalCount: result.totalCount,
      });
      return result;
    } catch (error) {
      logger.error("Error fetching mentor payments", { error });
      throw error instanceof AppError
        ? error
        : new AppError(
            error.message || "Failed to fetch mentor payments",
            HttpStatus.INTERNAL_SERVER_ERROR
          );
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
    logger.debug("Fetching all payments", { page, limit, searchQuery, status });

    try {
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

      const payments = await this.paymentRepository.findAll(query, skip, limit);
      const total = await this.paymentRepository.countDocuments(query);

      logger.info("Fetched all payments", { payments: payments.length, total });
      return { payments, total };
    } catch (error) {
      logger.error("Error fetching all payments", { error });
      throw error instanceof AppError
        ? error
        : new AppError(
            error.message || "Failed to fetch payments",
            HttpStatus.INTERNAL_SERVER_ERROR
          );
    }
  }

  async transferToMentor(
    paymentId: string,
    mentorId: string,
    amount: number
  ): Promise<any> {
    logger.debug("Transferring to mentor", { paymentId, mentorId, amount });

    try {
      if (
        !Types.ObjectId.isValid(paymentId) ||
        !Types.ObjectId.isValid(mentorId)
      ) {
        logger.error("Invalid payment or mentor ID", { paymentId, mentorId });
        throw new AppError(
          "Invalid payment or mentor ID",
          HttpStatus.BAD_REQUEST
        );
      }

      const payment = await this.paymentRepository.findById(paymentId);
      if (!payment) {
        logger.error("Payment not found", { paymentId });
        throw new AppError("Payment not found", HttpStatus.NOT_FOUND);
      }
      if (payment.status !== "completed") {
        logger.error("Payment is not in completed status", {
          paymentId,
          status: payment.status,
        });
        throw new AppError(
          "Payment is not in completed status",
          HttpStatus.BAD_REQUEST
        );
      }
      if (payment.mentorId.toString() !== mentorId) {
        logger.error("Mentor ID does not match payment", {
          paymentId,
          mentorId,
        });
        throw new AppError(
          "Mentor ID does not match payment",
          HttpStatus.BAD_REQUEST
        );
      }

      const mentor = await this.userRepository.findById(mentorId);
      if (!mentor) {
        logger.error("Mentor not found", { mentorId });
        throw new AppError("Mentor not found", HttpStatus.NOT_FOUND);
      }
      if (!mentor.stripeAccountId) {
        logger.error("Mentor has no Stripe account", { mentorId });
        throw new AppError(
          "Mentor has no Stripe account",
          HttpStatus.BAD_REQUEST
        );
      }

      const transferAmount = payment.amount;

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
        destination: mentor.stripeAccountId,
        transfer_group: paymentId,
      });

      logger.info("Transferred to mentor", {
        transferId: transfer.id,
        paymentId,
      });
      return { transfer, payment: updatedPayment, wallet };
    } catch (error) {
      logger.error("Error transferring to mentor", { error });
      throw error instanceof AppError
        ? error
        : new AppError(
            error.message || "Failed to transfer payment to mentor",
            HttpStatus.INTERNAL_SERVER_ERROR
          );
    }
  }

  async getMenteeWallet(userId: string): Promise<any> {
    logger.debug("Fetching mentee wallet", { userId });

    try {
      if (!Types.ObjectId.isValid(userId)) {
        logger.error("Invalid user ID", { userId });
        throw new AppError("Invalid user ID", HttpStatus.BAD_REQUEST);
      }

      const walletData = await this.walletRepository.findOne(userId);
      logger.info("Fetched mentee wallet", { userId, walletData });
      return walletData;
    } catch (error) {
      logger.error("Error fetching mentee wallet", { error });
      throw error instanceof AppError
        ? error
        : new AppError(
            error.message || "Failed to fetch mentee wallet",
            HttpStatus.INTERNAL_SERVER_ERROR
          );
    }
  }
}
