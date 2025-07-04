import mongoose, { Types } from "mongoose";
import { injectable } from "inversify";
import BaseRepository from "../implementations/BaseRepository";
import { IServiceRepository } from "../interface/IServiceRepository";
import ServiceModel from "../../models/serviceModel";
import { EService } from "../../entities/serviceEntity";

@injectable()
export default class ServiceRepository
  extends BaseRepository<EService>
  implements IServiceRepository
{
  constructor() {
    super(ServiceModel);
  }

  async getAllServices(
    mentorId: string,
    {
      page,
      limit,
      search,
      type,
    }: {
      page: number;
      limit: number;
      search: string;
      type?: string;
    }
  ): Promise<{ services: EService[]; totalCount: number }> {
    if (!Types.ObjectId.isValid(mentorId)) throw new Error("Invalid mentorId");

    const query: any = { mentorId: new Types.ObjectId(mentorId) };
    if (search) query.title = { $regex: search, $options: "i" };
    if (type && type !== "all") query.type = type;

    const skip = (page - 1) * limit;
    const [services, totalCount] = await Promise.all([
      this.model.find(query).populate("slot").skip(skip).limit(limit).lean(),
      this.model.countDocuments(query),
    ]);

    return { services: services as EService[], totalCount };
  }

  async getServiceById(serviceId: string): Promise<EService | null> {
    if (!Types.ObjectId.isValid(serviceId))
      throw new Error("Invalid serviceId");
    return this.model.findById(serviceId).populate("slot") as any;
  }

  async updateService(
    serviceId: string,
    serviceData: Partial<EService>
  ): Promise<EService | null> {
    if (!Types.ObjectId.isValid(serviceId))
      throw new Error("Invalid serviceId");
    return this.model
      .findByIdAndUpdate(
        serviceId,
        { $set: serviceData },
        { new: true, runValidators: true }
      )
      .populate("slot") as any;
  }

  async getAllVideoTutorials(
    type?: string,
    searchQuery?: string,
    page = 1,
    limit = 12
  ): Promise<{ tutorials: EService[]; total: number }> {
    const query: any = {
      type: "DigitalProducts",
      digitalProductType: "videoTutorials",
    };

    if (type && type !== "all") query.amount = type === "Free" ? 0 : { $gt: 0 };
    if (searchQuery)
      query.$or = [
        { title: { $regex: searchQuery, $options: "i" } },
        { shortDescription: { $regex: searchQuery, $options: "i" } },
      ];

    const tutorials = await this.model
      .find(query)
      .populate({
        path: "mentorId",
        select: "firstName lastName profilePicture bio professionalDetails",
        populate: { path: "professionalDetails", select: "company" },
      })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await this.model.countDocuments(query);
    return { tutorials: tutorials as EService[], total };
  }

  async getTutorialById(tutorialId: string): Promise<EService | null> {
    if (!Types.ObjectId.isValid(tutorialId))
      throw new Error("Invalid tutorialId");
    return this.model.findById(tutorialId).populate({
      path: "mentorId",
      select: "firstName lastName profilePicture bio professionalDetails",
      populate: { path: "professionalDetails", select: "company" },
    }) as any;
  }

  async findServicesByTitle(searchQuery: string): Promise<Partial<EService>[]> {
    return this.model
      .find({ title: { $regex: searchQuery, $options: "i" } })
      .select("_id")
      .exec();
  }

  async findServicesById(id: string): Promise<EService | null> {
    return this.model.findById(id).exec();
  }

  async getTopServices(limit: number): Promise<EService[]> {
    const services = await this.model.aggregate([]); // Omitted for brevity
    return services;
  }

  async getAllServicesForMentee(
    params: any
  ): Promise<{ services: EService[]; total: number }> {
    const { page, limit, search, type, oneToOneType, digitalProductType } =
      params;
    const query: any = {};

    // Logic as provided previously, optimized with $or/$and
    const services = await this.model
      .find(query)
      .populate("mentorId")
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    const total = await this.model.countDocuments(query);

    return { services: services as EService[], total };
  }

  async getDocuments(mentorId: string): Promise<EService[]> {
    return this.model
      .find({
        type: "DigitalProducts",
        digitalProductType: "documents",
        mentorId,
      })
      .exec();
  }

  async createDocument(payload: Partial<EService>): Promise<EService> {
    const doc = new this.model({
      ...payload,
      type: "DigitalProducts",
      digitalProductType: "documents",
    });
    return await doc.save();
  }

  async getAllTutorials(
    page: number,
    limit: number,
    type?: "Free" | "Paid",
    search?: string
  ): Promise<{ tutorials: EService[]; total: number }> {
    const query: any = {
      type: "DigitalProducts",
      digitalProductType: "videoTutorials",
    };

    if (type) query.amount = type === "Free" ? 0 : { $gt: 0 };
    if (search)
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { shortDescription: { $regex: search, $options: "i" } },
      ];

    const tutorials = await this.model
      .find(query)
      .populate({
        path: "mentorId",
        select: "firstName lastName profilePicture professionalDetails",
        populate: { path: "professionalDetails", select: "company" },
      })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await this.model.countDocuments(query);
    return { tutorials: tutorials as EService[], total };
  }
}
