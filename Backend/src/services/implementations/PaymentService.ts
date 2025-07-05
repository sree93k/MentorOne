import { IPaymentService } from "../interface/IPaymentService";
import { PaymentRepository } from "../../repositories/implementations/PaymentRepository";
import { EPayment } from "../../entities/paymentEntity";
import {
  FetchPaymentsQueryDto,
  TransferToMentorDto,
} from "../../dtos/adminDTO";
import { logger } from "../../utils/logger";
import { AppError } from "../../errors/appError";
import { HttpStatus } from "../../constants/HttpStatus";

export class PaymentService implements IPaymentService {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  async findAllPayments(): Promise<EPayment[]> {
    try {
      return await this.paymentRepository.findAllPayments();
    } catch (error) {
      logger.error(
        "Error finding all payments in Payment GitHubService PaymentService",
        {
          error: error instanceof Error ? error.message : String(error),
        }
      );
      throw new AppError(
        "Failed to fetch payments",
        HttpStatus.INTERNAL_SERVER,
        "error",
        "FETCH_ALL_PAYMENTS_ERROR"
      );
    }
  }
}
