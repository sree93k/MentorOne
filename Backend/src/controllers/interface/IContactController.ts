import { Request, Response } from "express";

/**
 * 🔹 DIP COMPLIANCE: Contact Controller Interface
 * Defines all contact message management operations
 */
export interface IContactController {
  // Message Creation & Retrieval
  createMessage(req: Request, res: Response): Promise<void>;
  getAllMessages(req: Request, res: Response): Promise<void>;
  getMessageById(req: Request, res: Response): Promise<void>;
  searchMessages(req: Request, res: Response): Promise<void>;

  // Message Status Management
  markAsRead(req: Request, res: Response): Promise<void>;
  bulkMarkAsSeen(req: Request, res: Response): Promise<void>;
  bulkUpdateStatus(req: Request, res: Response): Promise<void>;

  // Message Updates
  addResponse(req: Request, res: Response): Promise<void>;
  addInternalNote(req: Request, res: Response): Promise<void>;
  updateMessage(req: Request, res: Response): Promise<void>;

  // Analytics & Statistics
  getStatistics(req: Request, res: Response): Promise<void>;
  getMessageCountByInquiryType(req: Request, res: Response): Promise<void>;
  getAverageResponseTime(req: Request, res: Response): Promise<void>;

  // Data Management
  deleteMessage(req: Request, res: Response): Promise<void>;
  exportMessages(req: Request, res: Response): Promise<void>;
}