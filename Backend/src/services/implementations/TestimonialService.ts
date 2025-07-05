// import TestimonialRepository from "../../repositories/implementations/TestimonialRepository";
// import { ITestimonialRepository } from "../../repositories/interface/ITestimonialRepository";
// import { ETestimonial } from "../../entities/testimonialEntity";
// import mongoose from "mongoose";
// interface SaveTestimonialParams {
//   menteeId: string;
//   mentorId: string;
//   serviceId: string;
//   bookingId: string;
//   comment: string;
//   rating: number;
// }

// interface UpdateTestimonialParams {
//   testimonialId: string;
//   comment?: string;
//   rating?: number;
// }

// export default class TestimonialService {
//   private testimonialRepository: ITestimonialRepository;

//   constructor() {
//     this.testimonialRepository = new TestimonialRepository();
//   }

//   async saveTestimonial(params: SaveTestimonialParams): Promise<ETestimonial> {
//     try {
//       const { menteeId, mentorId, serviceId, bookingId, comment, rating } =
//         params;
//       console.log(
//         "Testimonialservice saveTestimonial step 1 menteeId",
//         menteeId
//       );
//       console.log(
//         "Testimonialservice saveTestimonial step 2 mentorId",
//         mentorId
//       );
//       console.log(
//         "Testimonialservice saveTestimonial step 3 serviceId",
//         serviceId
//       );
//       console.log(
//         "Testimonialservice saveTestimonial step 4 bookingId",
//         bookingId
//       );
//       console.log("Testimonialservice saveTestimonial step 5 comment", comment);
//       console.log("Testimonialservice saveTestimonial step 6 rating", rating);

//       // Validate inputs
//       if (!mongoose.Types.ObjectId.isValid(menteeId)) {
//         throw new Error("Invalid Mentee ID");
//       }
//       if (!mongoose.Types.ObjectId.isValid(mentorId)) {
//         throw new Error("Invalid Mentor ID");
//       }
//       if (!mongoose.Types.ObjectId.isValid(serviceId)) {
//         throw new Error("Invalid Service ID");
//       }
//       if (!mongoose.Types.ObjectId.isValid(bookingId)) {
//         throw new Error("Invalid Booking ID");
//       }
//       if (!comment || comment.trim() === "") {
//         throw new Error("Comment is required");
//       }
//       if (!rating || rating < 1 || rating > 5) {
//         throw new Error("Rating must be between 1 and 5");
//       }

//       // Check if booking exists and is completed
//       const booking = await this.testimonialRepository.findBookingById(
//         bookingId
//       );
//       console.log(
//         "Testimonialservice saveTestimonial step 7 booking response",
//         booking
//       );
//       if (!booking) {
//         console.log("Testimonialservice saveTestimonial step 7.1");
//         throw new Error("Booking not found");
//       }
//       if (booking.status !== "completed") {
//         console.log("Testimonialservice saveTestimonial step 7.2");
//         throw new Error("Booking must be completed to leave a testimonial");
//       }
//       if (booking.menteeId._id.toString() !== menteeId) {
//         console.log(
//           "Testimonialservice saveTestimonial step 7.3",
//           menteeId,
//           booking.menteeId._id.toString()
//         );
//         throw new Error(
//           "Not authorized to leave a testimonial for this booking"
//         );
//       }
//       console.log("Testimonialservice saveTestimonial step 7.4");

//       // Check if testimonial already exists for this booking
//       const existingTestimonial =
//         await this.testimonialRepository.findByBookingId(bookingId);
//       console.log(
//         "Testimonialservice saveTestimonial step 8 existingTestimonial response",
//         existingTestimonial
//       );
//       if (existingTestimonial) {
//         throw new Error("Testimonial already exists for this booking");
//       }

//       const testimonial = await this.testimonialRepository.create({
//         menteeId: new mongoose.Types.ObjectId(menteeId),
//         mentorId: new mongoose.Types.ObjectId(mentorId),
//         serviceId: new mongoose.Types.ObjectId(serviceId),
//         bookingId: new mongoose.Types.ObjectId(bookingId),
//         comment,
//         rating,
//       });
//       console.log(
//         "Testimonialservice saveTestimonial step 9 testimonial response",
//         testimonial
//       );

//       // Update booking with testimonial reference
//       await this.testimonialRepository.updateBookingWithTestimonial(
//         bookingId,
//         testimonial._id.toString()
//       );
//       console.log(
//         "Testimonialservice saveTestimonial step 10 booking updated with testimonial"
//       );

//       return testimonial;
//     } catch (error: any) {
//       console.error("Testimonialservice saveTestimonial error", error);
//       throw new Error(error.message || "Failed to save testimonial");
//     }
//   }

//   async updateTestimonial(
//     params: UpdateTestimonialParams
//   ): Promise<ETestimonial> {
//     try {
//       const { testimonialId, comment, rating } = params;
//       console.log(
//         "Testimonialservice updateTestimonial step 1 testimonialId",
//         testimonialId
//       );
//       console.log(
//         "Testimonialservice updateTestimonial step 2 comment",
//         comment
//       );
//       console.log("Testimonialservice updateTestimonial step 3 rating", rating);

//       // Validate inputs
//       if (comment && comment.trim() === "") {
//         throw new Error("Comment cannot be empty");
//       }
//       if (rating !== undefined && (rating < 0 || rating > 5)) {
//         throw new Error("Rating must be between 0 and 5");
//       }

//       const testimonial = await this.testimonialRepository.findById(
//         testimonialId
//       );
//       console.log(
//         "Testimonialservice updateTestimonial step 4 testimonial",
//         testimonial
//       );
//       if (!testimonial) {
//         throw new Error("Testimonial not found");
//       }

//       const updatedTestimonial = await this.testimonialRepository.update(
//         testimonialId,
//         {
//           comment: comment || testimonial.comment,
//           rating: rating !== undefined ? rating : testimonial.rating,
//           updatedAt: new Date(),
//         }
//       );
//       console.log(
//         "Testimonialservice updateTestimonial step 5 updatedTestimonial",
//         updatedTestimonial
//       );
//       return updatedTestimonial;
//     } catch (error: any) {
//       throw new Error(error.message || "Failed to update testimonial");
//     }
//   }

//   async getTestimonialsByMentor(
//     mentorId: string,
//     page: number = 1,
//     limit: number = 10
//   ): Promise<{ testimonials: ETestimonial[]; total: number }> {
//     try {
//       if (!mongoose.Types.ObjectId.isValid(mentorId)) {
//         throw new Error("Invalid Mentor ID");
//       }
//       const skip = (page - 1) * limit;
//       console.log(
//         "Testimonialservice getTestimonialsByMentor step 1 mentorId",
//         mentorId
//       );

//       const [testimonials, total] = await Promise.all([
//         this.testimonialRepository.findByMentor(mentorId, skip, limit),
//         this.testimonialRepository.countByMentor(mentorId),
//       ]);
//       console.log(
//         "Testimonialservice getTestimonialsByMentor step 2 testimonials response",
//         testimonials
//       );
//       console.log(
//         "Testimonialservice getTestimonialsByMentor step 2 total response",
//         total
//       );
//       return { testimonials, total };
//     } catch (error: any) {
//       console.error("Testimonialservice getTestimonialsByMentor error", error);
//       throw new Error(
//         process.env.NODE_ENV === "development"
//           ? error.message
//           : "Failed to fetch testimonials"
//       );
//     }
//   }

//   async getTestimonialByBookingId(
//     bookingId: string
//   ): Promise<ETestimonial | null> {
//     try {
//       console.log(
//         "Testimonialservice getTestimonialByBookingId step 1 bookingId",
//         bookingId
//       );
//       const testimonial = await this.testimonialRepository.findByBookingId(
//         bookingId
//       );
//       console.log(
//         "Testimonialservice getTestimonialByBookingId step 2 findByBookingId response",
//         testimonial
//       );
//       return testimonial;
//     } catch (error: any) {
//       throw new Error(error.message || "Failed to fetch testimonial");
//     }
//   }

//   async getTestimonialsByMentorAndService(
//     mentorId: string,
//     serviceId: string,
//     page: number = 1,
//     limit: number = 10
//   ): Promise<{ testimonials: ETestimonial[]; total: number }> {
//     try {
//       const skip = (page - 1) * limit;
//       console.log(
//         "TestimonialService getTestimonialsByMentorAndService step 1",
//         { mentorId, serviceId }
//       );

//       const [testimonials, total] = await Promise.all([
//         this.testimonialRepository.findByMentorAndService(
//           mentorId,
//           serviceId,
//           skip,
//           limit
//         ),
//         this.testimonialRepository.countByMentorAndService(mentorId, serviceId),
//       ]);
//       console.log(
//         "TestimonialService getTestimonialsByMentorAndService step 2 testimonials response",
//         testimonials
//       );
//       console.log(
//         "TestimonialService getTestimonialsByMentorAndService step 2 total response",
//         total
//       );
//       return { testimonials, total };
//     } catch (error: any) {
//       console.error(
//         "TestimonialService getTestimonialsByMentorAndService error",
//         error
//       );
//       throw new Error(
//         process.env.NODE_ENV === "development"
//           ? error.message
//           : "Failed to fetch testimonials"
//       );
//     }
//   }
//   async getTopTestimonials(limit: number = 20): Promise<ETestimonial[]> {
//     try {
//       console.log("getTopTestimonials service step 1", { limit });
//       const testimonials = await this.testimonialRepository.getTopTestimonials(
//         limit
//       );
//       console.log("getTopTestimonials service step 2", testimonials.length);
//       return testimonials;
//     } catch (error: any) {
//       console.error("getTopTestimonials service error", error);
//       throw new Error(`Failed to fetch top testimonials: ${error.message}`);
//     }
//   }
// }
