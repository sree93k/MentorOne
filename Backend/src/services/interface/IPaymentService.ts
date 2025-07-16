import Stripe from "stripe";
import { EPayment } from "../../entities/paymentEntity";

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

// Base DTO with required fields
export interface BasePaymentDTO {
  bookingId: string;
  menteeId: string;
  amount: number;
  status: "pending" | "completed" | "failed" | "refunded" | "transferred";
  transactionId: string;
}

// Complete DTO for full payment creation (saveBookingAndPayment)
export interface CreatePaymentDTO extends BasePaymentDTO {
  mentorId: string;
  platformPercentage: number;
  platformCharge: number;
  total: number;
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string;
}

// Simplified DTO for basic payment creation (bookService)
export interface CreateSimplePaymentDTO extends BasePaymentDTO {
  mentorId?: string;
  platformPercentage?: number;
  platformCharge?: number;
  total?: number;
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string;
}

// DTO for updating payments
export interface UpdatePaymentDTO {
  status?: "pending" | "completed" | "failed" | "refunded" | "transferred";
  amount?: number;
  platformPercentage?: number;
  platformCharge?: number;
  total?: number;
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string;
  updatedAt?: Date;
}

export interface IPaymentService {
  createCheckoutSession(
    params: CreateCheckoutSessionParams
  ): Promise<Stripe.Checkout.Session>;

  createPaymentIntent(
    params: CreateCheckoutSessionParams
  ): Promise<Stripe.PaymentIntent>;

  constructEvent(payload: Buffer, signature: string): Promise<Stripe.Event>;

  getAllMenteePayments(
    menteeId: string,
    page: number,
    limit: number
  ): Promise<{
    payments: any[];
    totalAmount: number;
    totalCount: number;
  }>;

  getAllMentorPayments(mentorId: string): Promise<{
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

  getMenteeWallet(userId: string): Promise<any>;

  // Flexible payment creation methods
  createPayment(data: CreatePaymentDTO): Promise<EPayment>;
  createSimplePayment(data: CreateSimplePaymentDTO): Promise<EPayment>;

  updatePaymentByBookingId(
    bookingId: string,
    data: UpdatePaymentDTO
  ): Promise<EPayment | null>;

  findPaymentById(id: string): Promise<EPayment | null>;

  findPaymentByBookingId(bookingId: string): Promise<EPayment | null>;
}
