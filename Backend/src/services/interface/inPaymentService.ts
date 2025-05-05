// import Stripe from "stripe";

// export interface SaveBookingAndPaymentParams {
//   sessionId: string;
//   serviceId: string;
//   mentorId: string;
//   menteeId: string;
//   bookingDate: string;
//   startTime: string;
//   endTime: string;
//   day: string;
//   slotIndex: number;
//   amount: number;
// }

// export interface CreateCheckoutSessionParams {
//   serviceId: string;
//   mentorId: string;
//   menteeId: string;
//   amount: number;
//   bookingDate: string;
//   startTime: string;
//   endTime: string;
//   day: string;
//   slotIndex: number;
// }

// export interface inPaymentService {
//   createCheckoutSession(
//     params: CreateCheckoutSessionParams
//   ): Promise<Stripe.Checkout.Session>;
//   createPaymentIntent(
//     params: CreateCheckoutSessionParams
//   ): Promise<Stripe.PaymentIntent>;
//   constructEvent(payload: Buffer, signature: string): Promise<Stripe.Event>;
// }
import Stripe from "stripe";

export interface CreateCheckoutSessionParams {
  serviceId: string;
  mentorId: string;
  menteeId: string;
  amount: number;
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

export interface inPaymentService {
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
}
