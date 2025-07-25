import { ETestimonial } from "../../entities/testimonialEntity";

export interface ITestimonialRepository {
  create(data: any): Promise<ETestimonial>;
  findById(id: string): Promise<ETestimonial | null>;
  findByBookingId(bookingId: string): Promise<ETestimonial | null>;
  findByMentor(
    mentorId: string,
    skip: number,
    limit: number
  ): Promise<ETestimonial[]>;
  countByMentor(mentorId: string): Promise<number>;
  update(id: string, data: any): Promise<ETestimonial>;
  findBookingById(bookingId: string): Promise<any>;
  updateBookingWithTestimonial(
    bookingId: string,
    testimonialId: string
  ): Promise<void>;
  findByMentorAndService(
    mentorId: string,
    serviceId: string,
    skip: number,
    limit: number
  ): Promise<ETestimonial[]>;
  countByMentorAndService(mentorId: string, serviceId: string): Promise<number>;
  getTopTestimonials(limit: number): Promise<ETestimonial[]>;
  getAverageRatingByService(serviceId: string): Promise<number>;
}
