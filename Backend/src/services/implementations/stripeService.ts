import { Request } from "express";
import stripe from "../../config/stripe";

export class StripeService {
  public async constructWebhookEvent(payload: Buffer, signature: string) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error("Webhook secret is not configured");
    }
    try {
      return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (error: any) {
      throw new Error(error.message || "Webhook signature verification failed");
    }
  }
}
