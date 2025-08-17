import { Request, Response, NextFunction } from "express";

/**
 * 🔹 DIP COMPLIANCE: Chatbot Controller Interface
 * Defines all chatbot operations
 */
export interface IChatbotController {
  // Message Handling
  handleMessage(
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void>;

  // Rate Limiting
  getRateLimitStatus(
    req: Request,
    res: Response
  ): Promise<void>;

  // Conversation Management
  getConversationHistory(
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void>;

  clearConversationHistory(
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void>;

  // Admin Operations
  getSystemStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}