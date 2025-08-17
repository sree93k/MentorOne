import { Request, Response, NextFunction } from "express";

/**
 * 🔹 DIP COMPLIANCE: Webhook Controller Interface
 * Defines all webhook handling operations
 */
export interface IWebHookController {
  // Webhook Processing
  handleWebhook(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  // Stripe Webhooks
  handleStripeWebhook(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  // Payment Webhooks
  handlePaymentSuccess(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  handlePaymentFailure(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  // Event Processing
  processWebhookEvent(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}