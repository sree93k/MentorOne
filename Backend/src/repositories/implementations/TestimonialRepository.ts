// repositories/testimonial/TestimonialRepository.ts
import { injectable } from "inversify";
import mongoose, { Types } from "mongoose";
import TestimonialModel from "../../models/testimonialsModel";
import { ITestimonialRepository } from "../interface/ITestimonialRepository";
import { ETestimonial } from "../../entities/testimonialEntity";
import BaseRepository from "../implementations/BaseRepository";

@injectable()
export default class TestimonialRepository
  extends BaseRepository<ETestimonial>
  implements ITestimonialRepository
{
  constructor() {
    super(TestimonialModel);
  }

  private validateObjectId(id: string, label: string): void {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error(`Invalid ${label} ID`);
    }
  }

  async create(data: Partial<ETestimonial>): Promise<ETestimonial> {
    ["menteeId", "mentorId", "serviceId", "bookingId"].forEach((field) => {
      this.validateObjectId(String(data[field as keyof ETestimonial]), field);
    });
    const testimonial = new this.model(data);
    return await testimonial.save();
  }

  async findById(id: string): Promise<ETestimonial | null> {
    return await this.model
      .findById(id)
      .populate("menteeId", "firstName lastName", "Users")
      .populate("serviceId", "title type", "Service");
  }

  async findByBookingId(bookingId: string): Promise<ETestimonial | null> {
    return await this.model
      .findOne({ bookingId })
      .populate("menteeId", "firstName lastName", "Users")
      .lean();
  }

  async findByMentor(
    mentorId: string,
    skip: number,
    limit: number
  ): Promise<ETestimonial[]> {
    this.validateObjectId(mentorId, "Mentor");
    return await this.model
      .find({ mentorId })
      .populate("menteeId", "firstName lastName", "Users")
      .populate("serviceId", "title type", "Service")
      .skip(skip)
      .limit(limit)
      .lean();
  }

  async countByMentor(mentorId: string): Promise<number> {
    this.validateObjectId(mentorId, "Mentor");
    return await this.model.countDocuments({ mentorId });
  }

  async update(id: string, data: Partial<ETestimonial>): Promise<ETestimonial> {
    const testimonial = await this.model
      .findByIdAndUpdate(id, data, { new: true })
      .populate("menteeId", "firstName lastName", "Users")
      .populate("serviceId", "title type", "Service");
    if (!testimonial) throw new Error("Testimonial not found");
    return testimonial;
  }

  async findByMentorAndService(
    mentorId: string,
    serviceId: string,
    skip: number,
    limit: number
  ): Promise<ETestimonial[]> {
    this.validateObjectId(mentorId, "Mentor");
    this.validateObjectId(serviceId, "Service");
    return await this.model
      .find({ mentorId, serviceId })
      .populate("menteeId", "firstName lastName", "Users")
      .populate("serviceId", "title type", "Service")
      .skip(skip)
      .limit(limit)
      .lean();
  }

  async countByMentorAndService(
    mentorId: string,
    serviceId: string
  ): Promise<number> {
    this.validateObjectId(mentorId, "Mentor");
    this.validateObjectId(serviceId, "Service");
    return await this.model.countDocuments({ mentorId, serviceId });
  }

  async getTopTestimonials(limit: number): Promise<ETestimonial[]> {
    return await this.model
      .find()
      .populate("menteeId", "firstName lastName profilePicture")
      .populate("mentorId", "firstName lastName")
      .populate("serviceId", "title")
      .sort({ rating: -1, createdAt: -1 })
      .limit(limit)
      .lean();
  }

  async getAverageRatingByService(serviceId: string): Promise<number> {
    this.validateObjectId(serviceId, "Service");
    const ratingStats = await this.model.aggregate([
      { $match: { serviceId: new Types.ObjectId(serviceId) } },
      { $group: { _id: null, averageRating: { $avg: "$rating" } } },
    ]);
    const averageRating = ratingStats[0]?.averageRating || 0;
    return parseFloat(averageRating.toFixed(1));
  }
}
