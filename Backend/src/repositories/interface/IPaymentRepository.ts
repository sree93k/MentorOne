import { EPayment } from "../../entities/paymentEntity";
export interface IPaymentRepository {
  create(data: any): Promise<any>;
  findById(id: string): Promise<any>;
  findByBookingId(bookingId: string): Promise<any>;
  // findAllByMenteeId(menteeId: string): Promise<{
  //   payments: any[];
  //   totalAmount: number;
  //   totalCount: number;
  // }>;
  findAllByMenteeId(
    menteeId: string,
    page: number,
    limit: number
  ): Promise<{
    payments: any[];
    totalAmount: number;
    totalCount: number;
  }>;
  findAllByMentorId(mentorId: string): Promise<{
    payments: any[];
    totalAmount: number;
    totalCount: number;
  }>;

  findAllPayments(skip: number, limit: number, query: any): Promise<any[]>;
  countAllPayments(query: any): Promise<number>;
  update(id: string, data: any): Promise<any>;
}
