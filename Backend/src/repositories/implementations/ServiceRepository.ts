import mongoose from "mongoose";
import { IServiceRepository } from "../interface/IServiceRepository";
import Service from "../../models/serviceModel";
import { EService } from "../../entities/serviceEntity";
import BaseRepository from "./BaseRepository";

interface GetAllServicesParams {
  page: number;
  limit: number;
  search: string;
  type?: string;
}

interface GetAllServicesResponse {
  services: EService[];
  totalCount: number;
}

export default class ServiceRepository
  extends BaseRepository<EService>
  implements IServiceRepository
{
  constructor() {
    super(Service);
  }
  async getAllServices(
    mentorId: string,
    params: GetAllServicesParams
  ): Promise<GetAllServicesResponse> {
    try {
      if (!mongoose.Types.ObjectId.isValid(mentorId)) {
        throw new Error(`Invalid mentorId format: ${mentorId}`);
      }

      const { page, limit, search, type } = params;
      const query: any = {
        mentorId: new mongoose.Types.ObjectId(mentorId),
      };

      if (search) {
        query.title = { $regex: search, $options: "i" }; // Case-insensitive search on title
      }

      if (type && type !== "all") {
        query.type = type;
      }

      const skip = (page - 1) * limit;

      const [services, totalCount] = await Promise.all([
        Service.find(query)
          .populate({ path: "slot" })
          .skip(skip)
          .limit(limit)
          .lean(),
        Service.countDocuments(query),
      ]);

      return { services: services as EService[], totalCount };
    } catch (error: any) {
      console.error("Error in ServiceRepository.getAllServices:", error);
      throw new Error(`Failed to fetch services: ${error.message}`);
    }
  }

  async getServiceById(serviceId: string): Promise<EService | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(serviceId)) {
        throw new Error(`Invalid serviceId format: ${serviceId}`);
      }

      const service = await Service.findById(serviceId).populate({
        path: "slot",
      });
      return service as EService | null;
    } catch (error: any) {
      console.error("Error in ServiceRepository.getServiceById:", error);
      throw new Error(`Failed to fetch service: ${error.message}`);
    }
  }

  async updateService(
    serviceId: string,
    serviceData: Partial<EService>
  ): Promise<EService | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(serviceId)) {
        throw new Error(`Invalid serviceId format: ${serviceId}`);
      }

      const updatedService = await Service.findByIdAndUpdate(
        serviceId,
        { $set: serviceData },
        { new: true, runValidators: true }
      ).populate({ path: "slot" });
      return updatedService as EService | null;
    } catch (error: any) {
      console.error("Error in ServiceRepository.updateService:", error);
      throw new Error(`Failed to update service: ${error.message}`);
    }
  }

  async getAllVideoTutorials(
    type?: string,
    searchQuery?: string,
    page: number = 1,
    limit: number = 12
  ): Promise<{ tutorials: any[]; total: number }> {
    try {
      console.log("service repo getAllVideoTutorials step 1", {
        type,
        searchQuery,
        page,
        limit,
      });
      const query: any = {
        type: "DigitalProducts",
        digitalProductType: "videoTutorials",
      };

      // Filter by type (Paid or Free)
      if (type && type.toLowerCase() !== "all") {
        if (type === "Free") {
          query.amount = 0;
        } else if (type === "Paid") {
          query.amount = { $gt: 0 };
        }
      }

      // Add search query if provided
      if (searchQuery) {
        query.$or = [
          { title: { $regex: searchQuery, $options: "i" } },
          { shortDescription: { $regex: searchQuery, $options: "i" } },
          // Search mentor's firstName or lastName
          {
            $or: [
              { "mentorId.firstName": { $regex: searchQuery, $options: "i" } },
              { "mentorId.lastName": { $regex: searchQuery, $options: "i" } },
            ],
          },
        ];
      }

      const tutorials = await Service.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate({
          path: "mentorId",
          select: "firstName lastName profilePicture bio professionalDetails",
          populate: {
            path: "professionalDetails",
            select: "company",
          },
        })
        .lean();

      console.log(
        "service repo getAllVideoTutorials step 2: Found tutorials",
        tutorials.length
      );

      const total = await Service.countDocuments(query);

      return { tutorials, total };
    } catch (error: any) {
      console.error("Error in ServiceRepository.getAllVideoTutorials:", error);
      throw new Error(`Failed to fetch tutorials: ${error.message}`);
    }
  }

  async getTutorialById(tutorialId: string): Promise<any> {
    try {
      console.log("service repo getTutorialById step 1", tutorialId);
      if (!mongoose.Types.ObjectId.isValid(tutorialId)) {
        throw new Error(`Invalid tutorialId format: ${tutorialId}`);
      }
      const tutorial = await Service.findById(tutorialId).populate({
        path: "mentorId",
        select: "firstName lastName profilePicture bio professionalDetails",
        populate: {
          path: "professionalDetails",
          select: "company",
        },
      });
      console.log("service repo getTutorialById step 2", tutorial);
      return tutorial;
    } catch (error: any) {
      console.error("Error in ServiceRepository.getTutorialById:", error);
      throw new Error(`Failed to fetch tutorial details: ${error.message}`);
    }
  }
  async findServicesByTitle(searchQuery: string): Promise<any[]> {
    return await Service.find({
      title: { $regex: searchQuery, $options: "i" },
    })
      .select("_id")
      .exec();
  }

  async findServicesById(id: string): Promise<any> {
    return await Service.findOne({ _id: id }).exec();
  }

  async getTopServices(limit: number): Promise<EService[]> {
    try {
      console.log("ServiceRepository getTopServices step 1", { limit });
      const services = await Service.aggregate([
        {
          $lookup: {
            from: "bookings", // Verify this matches the exact collection name in the database
            localField: "_id",
            foreignField: "serviceId",
            as: "bookings",
          },
        },
        {
          $lookup: {
            from: "testimonials",
            localField: "_id",
            foreignField: "serviceId",
            as: "testimonials",
          },
        },
        {
          $addFields: {
            bookingCount: { $size: "$bookings" },
            averageRating: { $avg: "$testimonials.rating" },
          },
        },
        // Removed $match to include services with zero bookings
        {
          $sort: {
            bookingCount: -1,
            averageRating: -1,
          },
        },
        {
          $limit: limit,
        },
        {
          $lookup: {
            from: "users",
            localField: "mentorId",
            foreignField: "_id",
            as: "mentor",
          },
        },
        {
          $unwind: {
            path: "$mentor",
            preserveNullAndEmptyArrays: true, // Handle cases where mentor is not found
          },
        },
        {
          $project: {
            _id: 1,
            title: 1,
            shortDescription: 1,
            amount: 1,
            duration: 1,
            type: 1,
            technology: 1,
            digitalProductType: 1,
            oneToOneType: 1,
            fileUrl: 1,
            exclusiveContent: 1,
            stats: 1,
            mentorId: 1,
            mentorName: {
              $concat: [
                { $ifNull: ["$mentor.firstName", ""] },
                " ",
                { $ifNull: ["$mentor.lastName", ""] },
              ],
            },
            mentorProfileImage: "$mentor.profilePicture",
            bookingCount: 1,
            averageRating: 1,
            bookings: 1, // Include bookings array for debugging
          },
        },
      ]).exec();
      console.log("ServiceRepository getTopServices step 2", {
        count: services.length,
        services: services.map((s) => ({
          _id: s._id,
          title: s.title,
          bookingCount: s.bookingCount,
          bookings: s.bookings,
        })),
      });
      return services;
    } catch (error: any) {
      console.error("ServiceRepository getTopServices error", error);
      throw new Error(`Failed to fetch top services: ${error.message}`);
    }
  }
  async getAllServicesForMentee(params: {
    page: number;
    limit: number;
    search: string;
    type?: string;
    oneToOneType?: string;
    digitalProductType?: string;
  }): Promise<{ services: EService[]; total: number }> {
    try {
      const { page, limit, search, type, oneToOneType, digitalProductType } =
        params;
      const query: any = {};

      // Build type-related conditions
      const typeConditions: any[] = [];
      if (type && type !== "All") {
        query.type = type;
      } else {
        // When type is undefined or "All", include priorityDM, DigitalProducts, and 1-1Call with valid slots
        typeConditions.push(
          { type: { $in: ["priorityDM", "DigitalProducts"] } },
          { type: "1-1Call", slot: { $exists: true, $ne: null } }
        );
      }

      if (oneToOneType) {
        query.oneToOneType = oneToOneType;
        typeConditions.push(
          { type: { $in: ["priorityDM", "DigitalProducts"] } },
          { type: "1-1Call", slot: { $exists: true, $ne: null } }
        );
      }

      if (digitalProductType) {
        query.digitalProductType = digitalProductType;
      }

      // Build search conditions
      const searchConditions: any[] = [];
      if (search) {
        searchConditions.push(
          { title: { $regex: search, $options: "i" } },
          { shortDescription: { $regex: search, $options: "i" } }
        );
        // Optionally include digitalProductType in search for "video"
        if (search.toLowerCase().includes("video")) {
          searchConditions.push({ digitalProductType: "videoTutorials" });
        }
      }

      // Combine conditions with $and if both type and search conditions exist
      if (typeConditions.length > 0 && searchConditions.length > 0) {
        query.$and = [{ $or: typeConditions }, { $or: searchConditions }];
      } else if (typeConditions.length > 0) {
        query.$or = typeConditions;
      } else if (searchConditions.length > 0) {
        query.$or = searchConditions;
      }

      const skip = (page - 1) * limit;

      // Fetch services with mentor details and populate slot for 1-1Call
      const services = await Service.find(query)
        .populate({
          path: "mentorId",
          select: "firstName lastName profilePicture",
        })
        .skip(skip)
        .limit(limit)
        .lean();
      console.log("SERVICE REPOSIOTRY>.......services resposne");

      // Calculate booking count and average rating using aggregation
      const servicesWithStats = await Promise.all(
        services.map(async (service: any) => {
          const bookingCount = await mongoose
            .model("Booking")
            .countDocuments({ serviceId: service._id });

          const ratingStats = await mongoose.model("Testimonial").aggregate([
            { $match: { serviceId: new mongoose.Types.ObjectId(service._id) } },
            {
              $group: {
                _id: null,
                averageRating: { $avg: "$rating" },
                count: { $sum: 1 },
              },
            },
          ]);

          const averageRating =
            ratingStats.length > 0 ? ratingStats[0].averageRating || 0 : 0;

          return {
            ...service,
            bookingCount,
            averageRating: parseFloat(averageRating.toFixed(1)),
          };
        })
      );

      // Count total services for pagination
      const total = await Service.countDocuments(query);
      console.log(
        "ServiceRepository.getAllServicesForMentee LAAAASTTTT",
        total
      );

      return { services: servicesWithStats as EService[], total };
    } catch (error: any) {
      console.error(
        "Error in ServiceRepository.getAllServicesForMentee:",
        error
      );
      throw new Error(`Failed to fetch services: ${error.message}`);
    }
  }
}
