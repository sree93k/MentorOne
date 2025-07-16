export interface ETestimonial {
  _id: string;
  menteeId: { firstName: string; lastName: string };
  mentorId: string;
  serviceId: { title: string; type: string };
  bookingId: string;
  comment: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}
export interface TestimonialResponse {
  success: boolean;
  message: string;
  testimonials: ETestimonial[];
  total: number;
  page: number;
  limit: number;
}
