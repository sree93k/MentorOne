import Stripe from "stripe";

export interface CreateCheckoutSessionParams {
  serviceId: string;
  mentorId: string;
  menteeId: string;
  amount: number;
  platformPercentage: number;
  platformCharge: number;
  total: number;
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

export interface IPaymentService {
  createCheckoutSession(
    params: CreateCheckoutSessionParams
  ): Promise<Stripe.Checkout.Session>;
  createPaymentIntent(
    params: CreateCheckoutSessionParams
  ): Promise<Stripe.PaymentIntent>;
  constructEvent(payload: Buffer, signature: string): Promise<Stripe.Event>;
  getAllMenteePayments(menteeId: string): Promise<{
    payments: Payment[];
    totalAmount: number;
    totalCount: number;
  }>;
  getAllMentorPayments(mentoeId: string): Promise<{
    payments: Payment[];
    totalAmount: number;
    totalCount: number;
  }>;
  getAllPayments(
    page: number,
    limit: number,
    searchQuery: string,
    status: string
  ): Promise<{
    payments: any[];
    total: number;
  }>;
  transferToMentor(
    paymentId: string,
    mentorId: string,
    amount: number
  ): Promise<any>;
}
