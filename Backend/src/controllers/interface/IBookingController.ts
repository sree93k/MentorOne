import { Request, Response, NextFunction } from "express";

/**
 * 🔹 DIP COMPLIANCE: Booking Controller Interface
 * Defines all booking management operations
 */
export interface IBookingController {
  // Booking Management
  createBooking(
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void>;

  getBookings(
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void>;

  getMentorBookings(
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void>;

  cancelBooking(
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void>;

  getBookingData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  // Booking Status Management
  updateBookingStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  updateBookingServiceStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  updateBookingResheduleStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  // Reschedule Management
  requestReschedule(
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void>;

  // Video Calls
  getAllVideoCallsByMentor(
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void>;

  // Testimonials
  submitTestimonial(
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void>;

  updateTestimonial(
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void>;

  getTestimonialByBookingId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  getTestimonialsByMentor(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  getTestimonialsByMentorAndService(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}