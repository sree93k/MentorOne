export interface CreatePaymentIntentParams {
  amount: number;
  serviceId: string;
  mentorId: string;
  menteeId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  day: string;
  slotIndex: number;
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string | number;
}

export interface Payment {
  _id: string;
  bookingId: string;
  menteeId: string;
  amount: number;
  status: string;
  transactionId: string;
  createdAt: string;
  serviceName: string;
  mentorName: string;
  paymentMode: string;
}
