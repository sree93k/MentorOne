import Testimonial from "../../models/testimonialsModel";
import Booking from "../../models/bookingModel";
import { ITestimonialRepository } from "../interface/ITestimonialRepository";
import { ApiError } from "../../middlewares/errorHandler";
import { ETestimonial } from "../../entities/testimonialEntity";
import mongoose from "mongoose";
export default class TestimonialRepository implements ITestimonialRepository {
  //   async create(data: any): Promise<ETestimonial> {
  //     try {
  //       console.log("TestimonialRepository create step 1", data);

  //       const testimonial = new Testimonial(data);
  //       console.log("TestimonialRepository create step 2", testimonial);
  //       return await testimonial.save();
  //     } catch (error: any) {
  //       throw new ApiError(500, "Failed to create testimonial", error.message);
  //     }
  //   }
  async create(data: any): Promise<ETestimonial> {
    try {
      console.log("TestimonialRepository create step 1", data);

      // Validate ObjectId fields
      if (!mongoose.Types.ObjectId.isValid(data.menteeId)) {
        throw new ApiError(400, "Invalid Mentee ID");
      }
      if (!mongoose.Types.ObjectId.isValid(data.mentorId)) {
        throw new ApiError(400, "Invalid Mentor ID");
      }
      if (!mongoose.Types.ObjectId.isValid(data.serviceId)) {
        throw new ApiError(400, "Invalid Service ID");
      }
      if (!mongoose.Types.ObjectId.isValid(data.bookingId)) {
        throw new ApiError(400, "Invalid Booking ID");
      }

      const testimonial = new Testimonial(data);
      console.log("TestimonialRepository create step 2", testimonial);
      const savedTestimonial = await testimonial.save();
      console.log("TestimonialRepository create step 3", savedTestimonial);
      return savedTestimonial;
    } catch (error: any) {
      console.error("TestimonialRepository create error", error);
      throw new ApiError(500, "Failed to create testimonial", error.message);
    }
  }

  async findById(id: string): Promise<ETestimonial | null> {
    try {
      console.log("TestimonialRepository findById step 1", id);
      const repsonse = await Testimonial.findById(id)
        .populate("menteeId")
        .populate("serviceId", "title type");
      console.log("TestimonialRepository findById step 2", repsonse);
      return repsonse;
    } catch (error: any) {
      throw new ApiError(500, "Failed to find testimonial", error.message);
    }
  }

  async findByBookingId(bookingId: string): Promise<ETestimonial | null> {
    try {
      console.log("TestimonialRepository findByBookingId step 1", bookingId);
      const repsonse = await Testimonial.findOne({ bookingId })
        .populate("menteeId")
        .populate("serviceId", "title type");
      console.log("TestimonialRepository findByBookingId step 2", repsonse);
      return repsonse;
    } catch (error: any) {
      throw new ApiError(500, "Failed to find testimonial", error.message);
    }
  }

  async findByMentor(
    mentorId: string,
    skip: number,
    limit: number
  ): Promise<ETestimonial[]> {
    try {
      console.log("TestimonialRepository findByMentor step 1", mentorId);
      const response = await Testimonial.find({ mentorId })
        .populate("menteeId")
        .populate("serviceId", "title type")
        .skip(skip)
        .limit(limit)
        .lean();
      console.log("TestimonialRepository findByMentor step 2", response);
      return response;
    } catch (error: any) {
      throw new ApiError(500, "Failed to find testimonials", error.message);
    }
  }

  async countByMentor(mentorId: string): Promise<number> {
    try {
      console.log("TestimonialRepository countByMentor step 1", mentorId);
      const response = await Testimonial.countDocuments({ mentorId });
      console.log("TestimonialRepository countByMentor step 2", response);
      return response;
    } catch (error: any) {
      throw new ApiError(500, "Failed to count testimonials", error.message);
    }
  }

  async update(id: string, data: any): Promise<ETestimonial> {
    try {
      console.log("TestimonialRepository update step 1", id);
      console.log("TestimonialRepository update step 2", data);
      const testimonial = await Testimonial.findByIdAndUpdate(id, data, {
        new: true,
      })
        .populate("menteeId")
        .populate("serviceId", "title type");
      if (!testimonial) {
        throw new ApiError(404, "Testimonial not found");
      }
      console.log("TestimonialRepository update step 3", testimonial);
      return testimonial;
    } catch (error: any) {
      throw new ApiError(500, "Failed to update testimonial", error.message);
    }
  }

  async findBookingById(bookingId: string): Promise<any> {
    try {
      console.log("TestimonialRepository findBookingById step 1", bookingId);
      const response = await Booking.findById(bookingId)
        .populate("mentorId", "firstName lastName")
        .populate("serviceId", "title type")
        .populate("menteeId", "firstName lastName");
      console.log("TestimonialRepository findBookingById step 2", response);
      if (!response) {
        throw new ApiError(404, "Booking not found");
      }
      return response;
    } catch (error: any) {
      throw new ApiError(500, "Failed to find booking", error.message);
    }
  }

  async updateBookingWithTestimonial(
    bookingId: string,
    testimonialId: string
  ): Promise<void> {
    try {
      console.log(
        "TestimonialRepository updateBookingWithTestimonial step 1",
        bookingId
      );
      console.log(
        "TestimonialRepository updateBookingWithTestimonial step 2",
        testimonialId
      );
      const response = await Booking.findByIdAndUpdate(bookingId, {
        testimonials: testimonialId,
      });
      console.log(
        "TestimonialRepository updateBookingWithTestimonial step 3",
        response
      );
    } catch (error: any) {
      throw new ApiError(
        500,
        "Failed to update booking with testimonial",
        error.message
      );
    }
  }
}
