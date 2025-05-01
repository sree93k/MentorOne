import Payment from "../../models/paymentModel";
import { ApiError } from "../../middlewares/errorHandler";

export default class PaymentRepository {
  async create(data: any) {
    try {
      const payment = new Payment(data);
      return await payment.save();
    } catch (error: any) {
      throw new ApiError(500, "Failed to create payment", error.message);
    }
  }

  async findById(id: string) {
    try {
      return await Payment.findById(id);
    } catch (error: any) {
      throw new ApiError(500, "Failed to find payment", error.message);
    }
  }

  async findByBookingId(bookingId: string) {
    try {
      return await Payment.findOne({ bookingId });
    } catch (error: any) {
      throw new ApiError(500, "Failed to find payment", error.message);
    }
  }
}
