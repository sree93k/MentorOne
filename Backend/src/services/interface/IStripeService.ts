import { Stripe } from "stripe";

/**
 * 🔹 DIP COMPLIANCE: Stripe Service Interface
 * Defines Stripe webhook and payment processing operations
 */
export interface IStripeService {
  // Webhook Operations
  constructWebhookEvent(
    payload: Buffer,
    signature: string
  ): Promise<Stripe.Event>;

  // Payment Operations
  createPaymentIntent?(
    amount: number,
    currency: string,
    metadata?: Record<string, string>
  ): Promise<Stripe.PaymentIntent>;

  confirmPaymentIntent?(
    paymentIntentId: string
  ): Promise<Stripe.PaymentIntent>;

  retrievePaymentIntent?(
    paymentIntentId: string
  ): Promise<Stripe.PaymentIntent>;

  // Customer Operations
  createCustomer?(
    email: string,
    name?: string,
    metadata?: Record<string, string>
  ): Promise<Stripe.Customer>;

  retrieveCustomer?(
    customerId: string
  ): Promise<Stripe.Customer>;
}