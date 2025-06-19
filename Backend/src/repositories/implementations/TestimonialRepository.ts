import Testimonial from "../../models/testimonialsModel";
import Booking from "../../models/bookingModel";
import { ITestimonialRepository } from "../interface/ITestimonialRepository";

import { ETestimonial } from "../../entities/testimonialEntity";
import mongoose from "mongoose";
export default class TestimonialRepository implements ITestimonialRepository {
  async create(data: any): Promise<ETestimonial> {
    try {
      console.log("TestimonialRepository create step 1", data);

      // Validate ObjectId fields
      if (!mongoose.Types.ObjectId.isValid(data.menteeId)) {
        throw new Error("Invalid Mentee ID");
      }
      if (!mongoose.Types.ObjectId.isValid(data.mentorId)) {
        throw new Error("Invalid Mentor ID");
      }
      if (!mongoose.Types.ObjectId.isValid(data.serviceId)) {
        throw new Error("Invalid Service ID");
      }
      if (!mongoose.Types.ObjectId.isValid(data.bookingId)) {
        throw new Error("Invalid Booking ID");
      }

      const testimonial = new Testimonial(data);
      console.log("TestimonialRepository create step 2", testimonial);
      const savedTestimonial = await testimonial.save();
      console.log("TestimonialRepository create step 3", savedTestimonial);
      return savedTestimonial;
    } catch (error: any) {
      console.error("TestimonialRepository create error", error);
      throw new Error("Failed to create testimonial", error.message);
    }
  }

  async findById(id: string): Promise<ETestimonial | null> {
    try {
      console.log("TestimonialRepository findById step 1", id);

      const testimonial = await Testimonial.findById(id)
        .populate({
          path: "menteeId",
          select: "firstName lastName",
          model: "Users", // Explicitly specify model
        })
        .populate({
          path: "serviceId",
          select: "title type",
          model: "Service", // Explicitly specify model
        });
      console.log("TestimonialRepository findById step 2", testimonial);
      return testimonial;
    } catch (error: any) {
      throw new Error("Failed to find testimonial", error.message);
    }
  }

  async findByBookingId(bookingId: string): Promise<ETestimonial | null> {
    try {
      console.log("TestimonialRepository findByBookingId step 1", bookingId);
      const testimonial = await Testimonial.findOne({ bookingId })
        .populate({
          path: "menteeId",
          select: "firstName lastName",
          model: "Users", // Explicitly specify model
        })
        .lean();
      console.log("TestimonialRepository findByBookingId step 2", testimonial);
      return testimonial;
    } catch (error: any) {
      throw new Error("Failed to find testimonial", error.message);
    }
  }

  async findByMentor(
    mentorId: string,
    skip: number,
    limit: number
  ): Promise<ETestimonial[]> {
    try {
      console.log("TestimonialRepository findByMentor step 1", mentorId);
      if (!mongoose.Types.ObjectId.isValid(mentorId)) {
        throw new Error("Invalid Mentor ID");
      }
      const response = await Testimonial.find({ mentorId })
        .populate({
          path: "menteeId",
          select: "firstName lastName",
          model: "Users",
        })
        .populate({
          path: "serviceId",
          select: "title type",
          model: "Service",
        })
        .skip(skip)
        .limit(limit)
        .lean();
      console.log("TestimonialRepository findByMentor step 2", response);
      return response;
    } catch (error: any) {
      console.error("TestimonialRepository findByMentor error", error);
      throw new Error("Failed to find testimonials", error.message);
    }
  }
  async countByMentor(mentorId: string): Promise<number> {
    try {
      console.log("TestimonialRepository countByMentor step 1", mentorId);
      if (!mongoose.Types.ObjectId.isValid(mentorId)) {
        throw new Error("Invalid Mentor ID");
      }
      const response = await Testimonial.countDocuments({ mentorId });
      console.log("TestimonialRepository countByMentor step 2", response);
      return response;
    } catch (error: any) {
      console.error("TestimonialRepository countByMentor error", error);
      throw new Error("Failed to count testimonials", error.message);
    }
  }

  async update(id: string, data: any): Promise<ETestimonial> {
    try {
      console.log("TestimonialRepository update step 1", id);
      console.log("TestimonialRepository update step 2", data);

      const testimonial = await Testimonial.findByIdAndUpdate(id, data, {
        new: true,
      })
        .populate({
          path: "menteeId",
          select: "firstName lastName",
          model: "Users", // Explicitly specify model
        })
        .populate({
          path: "serviceId",
          select: "title type",
          model: "Service", // Explicitly specify model
        });
      if (!testimonial) {
        throw new Error("Testimonial not found");
      }
      console.log("TestimonialRepository update step 3", testimonial);
      return testimonial;
    } catch (error: any) {
      throw new Error("Failed to update testimonial", error.message);
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
        throw new Error("Booking not found");
      }
      return response;
    } catch (error: any) {
      throw new Error("Failed to find booking", error.message);
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
      throw new Error(
        "Failed to update booking with testimonial",
        error.message
      );
    }
  }

  async findByMentorAndService(
    mentorId: string,
    serviceId: string,
    skip: number,
    limit: number
  ): Promise<ETestimonial[]> {
    try {
      console.log("TestimonialRepository findByMentorAndService step 1", {
        mentorId,
        serviceId,
      });
      if (
        !mongoose.Types.ObjectId.isValid(mentorId) ||
        !mongoose.Types.ObjectId.isValid(serviceId)
      ) {
        throw new Error("Invalid Mentor or Service ID");
      }
      const response = await Testimonial.find({ mentorId, serviceId })
        .populate({
          path: "menteeId",
          select: "firstName lastName",
          model: "Users",
        })
        .populate({
          path: "serviceId",
          select: "title type",
          model: "Service",
        })
        .skip(skip)
        .limit(limit)
        .lean();
      console.log(
        "TestimonialRepository findByMentorAndService step 2",
        response
      );
      return response;
    } catch (error: any) {
      console.error(
        "TestimonialRepository findByMentorAndService error",
        error
      );
      throw new Error("Failed to find testimonials", error.message);
    }
  }

  async countByMentorAndService(
    mentorId: string,
    serviceId: string
  ): Promise<number> {
    try {
      console.log("TestimonialRepository countByMentorAndService step 1", {
        mentorId,
        serviceId,
      });
      if (
        !mongoose.Types.ObjectId.isValid(mentorId) ||
        !mongoose.Types.ObjectId.isValid(serviceId)
      ) {
        throw new Error("Invalid Mentor or Service ID");
      }
      const response = await Testimonial.countDocuments({
        mentorId,
        serviceId,
      });
      console.log(
        "TestimonialRepository countByMentorAndService step 2",
        response
      );
      return response;
    } catch (error: any) {
      console.error(
        "TestimonialRepository countByMentorAndService error",
        error
      );
      throw new Error("Failed to count testimonials", error.message);
    }
  }

  async getTopTestimonials(limit: number): Promise<ETestimonial[]> {
    try {
      console.log("BookingRepository getTopTestimonials step 1", { limit });
      const testimonials = await Testimonial.find()
        .populate({
          path: "menteeId",
          select: "firstName lastName profilePicture",
        })
        .populate({
          path: "mentorId",
          select: "firstName lastName",
        })
        .populate({
          path: "serviceId",
          select: "title",
        })
        .sort({ rating: -1, createdAt: -1 })
        .limit(limit)
        .lean();
      console.log(
        "BookingRepository getTopTestimonials step 2",
        testimonials.length
      );
      return testimonials;
    } catch (error: any) {
      console.error("BookingRepository getTopTestimonials error", error);
      throw new Error("Failed to fetch top testimonials", error.message);
    }
  }

  async getAverageRatingByService(serviceId: string): Promise<number> {
    try {
      console.log(
        "TestimonialRepository getAverageRatingByService step 1",
        serviceId
      );
      if (!mongoose.Types.ObjectId.isValid(serviceId)) {
        throw new Error("Invalid Service ID");
      }
      const ratingStats = await Testimonial.aggregate([
        { $match: { serviceId: new mongoose.Types.ObjectId(serviceId) } },
        {
          $group: {
            _id: null,
            averageRating: { $avg: "$rating" },
          },
        },
      ]);
      const averageRating =
        ratingStats.length > 0 ? ratingStats[0].averageRating || 0 : 0;
      console.log(
        "TestimonialRepository getAverageRatingByService step 2",
        averageRating
      );
      return parseFloat(averageRating.toFixed(1));
    } catch (error: any) {
      console.error(
        "TestimonialRepository getAverageRatingByService error",
        error
      );
      throw new Error("Failed to compute average rating", error.message);
    }
  }
}
