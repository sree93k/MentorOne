import { Model } from "mongoose";
import { EPayment } from "../../entities/paymentEntity";
import { IPaymentRepository } from "../interface/IPaymentRepository";
import BaseRepository from "./BaseRepository";
import { logger } from "../../utils/logger";
import { AppError } from "../../errors/appError";
import { HttpStatus } from "../../constants/HttpStatus";

export default class PaymentRepository
  extends BaseRepository<EPayment>
  implements IPaymentRepository
{
  constructor(model: Model<EPayment>) {
    super(model);
  }

  async findByBookingId(bookingId: string): Promise<EPayment | null> {
    try {
      return await this.model.findOne({ bookingId }).exec();
    } catch (error) {
      logger.error("Error finding payment by booking ID", {
        bookingId,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new AppError(
        "Failed to find payment by booking ID",
        HttpStatus.INTERNAL_SERVER,
        "error",
        "FIND_PAYMENT_BOOKING_ERROR"
      );
    }
  }

  async findAllByMentorId(mentorId: string): Promise<{
    payments: EPayment[];
    totalAmount: number;
    totalCount: number;
  }> {
    try {
      const payments = await this.model
        .aggregate([
          {
            $match: {
              mentorId: new this.model.mongo.Types.ObjectId(mentorId),
            },
          },
          {
            $lookup: {
              from: "bookings",
              localField: "bookingId",
              foreignField: "_id",
              as: "booking",
            },
          },
          { $unwind: "$booking" },
          {
            $lookup: {
              from: "users",
              localField: "menteeId",
              foreignField: "_id",
              as: "mentee",
            },
          },
          { $unwind: "$mentee" },
          {
            $project: {
              _id: 1,
              amount: 1,
              status: 1,
              mentorId: 1,
              menteeId: {
                _id: "$mentee._id",
                firstName: "$mentee.firstName",
                lastName: "$mentee.lastName",
              },
              bookingId: 1,
              createdAt: 1,
              updatedAt: 1,
            },
          },
        ])
        .exec();

      const totalAmount = payments.reduce(
        (sum: number, payment: any) => sum + (payment.amount || 0),
        0
      );
      const totalCount = payments.length;

      return { payments: payments as EPayment[], totalAmount, totalCount };
    } catch (error) {
      logger.error("Error fetching mentor payments", {
        mentorId,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new AppError(
        "Failed to fetch mentor payments",
        HttpStatus.INTERNAL_SERVER,
        "error",
        "FETCH_MENTOR_PAYMENTS_ERROR"
      );
    }
  }

  async findAllByMenteeId(
    menteeId: string,
    page: number,
    limit: number
  ): Promise<{
    payments: EPayment[];
    totalAmount: number;
    totalCount: number;
  }> {
    try {
      const [totalResult, payments] = await Promise.all([
        this.model
          .aggregate([
            {
              $match: {
                menteeId: new this.model.mongo.Types.ObjectId(menteeId),
              },
            },
            {
              $group: {
                _id: null,
                totalAmount: { $sum: "$amount" },
                totalCount: { $sum: 1 },
              },
            },
          ])
          .exec(),
        this.model
          .aggregate([
            {
              $match: {
                menteeId: new this.model.mongo.Types.ObjectId(menteeId),
              },
            },
            {
              $lookup: {
                from: "bookings",
                localField: "bookingId",
                foreignField: "_id",
                as: "booking",
              },
            },
            { $unwind: "$booking" },
            {
              $lookup: {
                from: "users",
                localField: "mentorId",
                foreignField: "_id",
                as: "mentor",
              },
            },
            { $unwind: "$mentor" },
            {
              $project: {
                _id: 1,
                amount: 1,
                status: 1,
                mentorId: {
                  _id: "$mentor._id",
                  firstName: "$mentor.firstName",
                  lastName: "$mentor.lastName",
                },
                bookingId: 1,
                createdAt: 1,
                updatedAt: 1,
              },
            },
            { $skip: (page - 1) * limit },
            { $limit: limit },
          ])
          .exec(),
      ]);

      const totalAmount = totalResult[0]?.totalAmount || 0;
      const totalCount = totalResult[0]?.totalCount || 0;

      return { payments: payments as EPayment[], totalAmount, totalCount };
    } catch (error) {
      logger.error("Error fetching mentee payments", {
        menteeId,
        page,
        limit,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new AppError(
        "Failed to fetch mentee payments",
        HttpStatus.INTERNAL_SERVER,
        "error",
        "FETCH_MENTEE_PAYMENTS_ERROR"
      );
    }
  }

  async findAllPayments(
    skip: number,
    limit: number,
    query: any
  ): Promise<EPayment[]> {
    try {
      return await this.model
        .find(query)
        .populate({
          path: "mentorId",
          select: "firstName lastName email",
        })
        .populate({
          path: "menteeId",
          select: "firstName lastName email",
        })
        .skip(skip)
        .limit(limit)
        .exec();
    } catch (error) {
      logger.error("Error fetching all payments", {
        query,
        skip,
        limit,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new AppError(
        "Failed to fetch all payments",
        HttpStatus.INTERNAL_SERVER,
        "error",
        "FETCH_ALL_PAYMENTS_ERROR"
      );
    }
  }

  async countAllPayments(query: any): Promise<number> {
    try {
      return await this.model.countDocuments(query).exec();
    } catch (error) {
      logger.error("Error counting all payments", {
        query,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new AppError(
        "Failed to count all payments",
        HttpStatus.INTERNAL_SERVER,
        "error",
        "COUNT_ALL_PAYMENTS_ERROR"
      );
    }
  }

  async update(id: string, data: Partial<EPayment>): Promise<EPayment | null> {
    try {
      return await this.model
        .findByIdAndUpdate(id, { $set: data }, { new: true })
        .exec();
    } catch (error) {
      logger.error("Error updating payment", {
        id,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new AppError(
        "Failed to update payment",
        HttpStatus.INTERNAL_SERVER,
        "error",
        "UPDATE_PAYMENT_ERROR"
      );
    }
  }

  async updateByBookingId(
    bookingId: string,
    data: Partial<EPayment>
  ): Promise<EPayment | null> {
    try {
      return await this.model
        .findOneAndUpdate({ bookingId }, { $set: data }, { new: true })
        .exec();
    } catch (error) {
      logger.error("Error updating payment by booking ID", {
        bookingId,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new AppError(
        "Failed to update payment by booking ID",
        HttpStatus.INTERNAL_SERVER,
        "error",
        "UPDATE_PAYMENT_BOOKING_ERROR"
      );
    }
  }
}
