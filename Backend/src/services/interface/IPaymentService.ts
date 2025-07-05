import { EPayment } from "../../entities/paymentEntity";

export interface IPaymentService {
  findAllPayments(): Promise<EPayment[]>;
}
