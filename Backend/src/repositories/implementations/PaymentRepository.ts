// Updated PaymentRepository.ts following SOLID principles, InversifyJS, BaseRepository usage

import { injectable } from "inversify";
import BaseRepository from "../implementations/BaseRepository";
import Payment from "../../models/paymentModel";
import { EPayment } from "../../entities/paymentEntity";
import { IPaymentRepository } from "../interface/IPaymentRepository";
import { HttpStatus } from "../../constants/HttpStatus";
import logger from "../../utils/logger";
import AppError from "../../errors/appError";
import { Types } from "mongoose";

@injectable()
export default class PaymentRepository
  extends BaseRepository<EPayment>
  implements IPaymentRepository
{
  constructor() {
    super(Payment);
  }

  async findByBookingId(bookingId: string): Promise<EPayment | null> {
    try {
      return await this.model.findOne({ bookingId }).exec();
    } catch (error: any) {
      throw new Error(`Failed to find payment by bookingId: ${error.message}`);
    }
  }

  async findAllByMentorId(mentorId: string): Promise<{
    payments: EPayment[];
    totalAmount: number;
    totalCount: number;
  }> {
    try {
      if (!Types.ObjectId.isValid(mentorId)) {
        throw new AppError("Invalid mentorId", HttpStatus.BAD_REQUEST);
      }

      const payments = await this.model
        .find({ mentorId })
        .populate("bookingId", "serviceId status")
        .lean()
        .exec();

      const totalAmount = payments.reduce(
        (sum, payment) => sum + (payment.total || 0),
        0
      );
      const totalCount = payments.length;

      return { payments, totalAmount, totalCount };
    } catch (error) {
      logger.error("Error fetching mentor payments", {
        mentorId,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new AppError(
        "Failed to fetch mentor payments",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findAllByMenteeId(
    menteeId: string,
    page: number,
    limit: number
  ): Promise<{
    payments: any[];
    totalAmount: number;
    totalCount: number;
  }> {
    try {
      const [totalResult] = await this.model.aggregate([
        /* total count/amount aggregation */
      ]);
      const totalAmount = totalResult?.totalAmount || 0;
      const totalCount = totalResult?.totalCount || 0;

      const payments = await this.model.aggregate([
        /* paginated aggregation */
      ]);

      return { payments, totalAmount, totalCount };
    } catch (error: any) {
      throw new Error(`Failed to fetch mentee payments: ${error.message}`);
    }
  }

  // async findAllPayments(
  //   skip: number,
  //   limit: number,
  //   query: any
  // ): Promise<any[]> {
  //   try {
  //     return await this.model.aggregate([
  //       /* admin payments aggregation */
  //     ]);
  //   } catch (error: any) {
  //     throw new Error(`Failed to fetch all payments: ${error.message}`);
  //   }
  // }

  // async countAllPayments(query: any): Promise<number> {
  //   try {
  //     return await this.model.countDocuments(query).exec();
  //   } catch (error: any) {
  //     throw new Error(`Failed to count payments: ${error.message}`);
  //   }
  // }

  // async update(id: string, data: Partial<EPayment>): Promise<EPayment | null> {
  //   try {
  //     return await this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  //   } catch (error: any) {
  //     throw new Error(`Failed to update payment: ${error.message}`);
  //   }
  // }

  async updateByBookingId(
    bookingId: string,
    data: Partial<EPayment>
  ): Promise<EPayment | null> {
    try {
      return await this.model
        .findOneAndUpdate({ bookingId }, data, { new: true })
        .exec();
    } catch (error: any) {
      throw new Error(`Failed to update by booking ID: ${error.message}`);
    }
  }
}
