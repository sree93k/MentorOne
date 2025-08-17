import { Request, Response, NextFunction } from "express";

/**
 * 🔹 DIP COMPLIANCE: Payment Controller Interface
 * Defines all payment management operations
 */
export interface IPaymentController {
  // Payment Intent Management
  createPaymentIntent(
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void>;

  // Payment Retrieval
  getAllPayments(
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void>;

  getAllMentorPayments(
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void>;

  // Payment Processing
  confirmPayment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  // Webhook Handling
  handleStripeWebhook(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}