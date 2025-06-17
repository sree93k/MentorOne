import { Request } from "express";
import stripe from "../../config/stripe";
import { ApiError } from "../../middlewares/errorHandler";
import { HttpStatus } from "../../constants/HttpStatus";
export class StripeService {
  public async constructWebhookEvent(payload: Buffer, signature: string) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new ApiError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Webhook secret is not configured",
        "Missing STRIPE_WEBHOOK_SECRET"
      );
    }
    try {
      return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (error: any) {
      throw new ApiError(
        HttpStatus.BAD_REQUEST,
        error.message || "Webhook signature verification failed",
        "Error in constructWebhookEvent"
      );
    }
  }
}
