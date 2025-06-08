import { ETestimonial } from "../../entities/testimonialEntity";

export interface ITestimonialService {
  saveTestimonial(params: {
    menteeId: string;
    mentorId: string;
    serviceId: string;
    bookingId: string;
    comment: string;
    rating: number;
  }): Promise<ETestimonial>;
  updateTestimonial(params: {
    testimonialId: string;
    comment?: string;
    rating?: number;
  }): Promise<ETestimonial>;
  getTestimonialsByMentor(
    mentorId: string,
    page: number,
    limit: number
  ): Promise<{ testimonials: ETestimonial[]; total: number }>;
  getTestimonialByBookingId(bookingId: string): Promise<ETestimonial | null>;
  getTestimonialsByMentorAndService(
    mentorId: string,
    serviceId: string,
    page: number,
    limit: number
  ): Promise<{ testimonials: ETestimonial[]; total: number }>;
}
