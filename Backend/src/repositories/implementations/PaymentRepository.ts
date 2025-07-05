import { Model } from "mongoose";
import BaseRepository from "./BaseRepository";
import { EPayment } from "../../entities/paymentEntity";
import {
  FetchPaymentsQueryDto,
  TransferToMentorDto,
} from "../../dtos/adminDTO";
import { logger } from "../../utils/logger";
import { AppError } from "../../errors/appError";
import { HttpStatus } from "../../constants/HttpStatus";

export class PaymentRepository extends BaseRepository<EPayment> {
  constructor(model: Model<EPayment>) {
    super(model);
  }

  async findAllPayments(): Promise<EPayment[]> {
    try {
      return await this.model.find({}).populate("menteeId mentorId").exec();
    } catch (error) {
      logger.error("Error finding all payments", {
        error: error instanceof Error ? error.message : String(error),
      });
      throw new AppError(
        "Failed to find payments",
        HttpStatus.INTERNAL_SERVER,
        "error",
        "FIND_ALL_PAYMENTS_ERROR"
      );
    }
  }
}
