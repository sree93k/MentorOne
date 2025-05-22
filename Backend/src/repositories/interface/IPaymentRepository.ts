export interface IPaymentRepository {
  create(data: any): Promise<any>;
  findById(id: string): Promise<any>;
  findByBookingId(bookingId: string): Promise<any>;
  findAllByMenteeId(menteeId: string): Promise<{
    payments: any[];
    totalAmount: number;
    totalCount: number;
  }>;
}
