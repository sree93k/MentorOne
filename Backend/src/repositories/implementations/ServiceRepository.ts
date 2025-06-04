import mongoose from "mongoose";
import { IServiceRepository } from "../interface/IServiceRepository";
import { ApiError } from "../../middlewares/errorHandler";
import Service from "../../models/serviceModel";
import { EService } from "../../entities/serviceEntity";
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

export default class ServiceRepository implements IServiceRepository {
  // async getAllServices(mentorId: string): Promise<EService[]> {
  //   try {
  //     if (!mongoose.Types.ObjectId.isValid(mentorId)) {
  //       throw new ApiError(400, `Invalid mentorId format: ${mentorId}`);
  //     }

  //     const allServices = await Service.find({
  //       mentorId: new mongoose.Types.ObjectId(mentorId),
  //     }).populate({ path: "slot" });
  //     return allServices as EService[];
  //   } catch (error: any) {
  //     console.error("Error in ServiceRepository.getAllServices:", error);
  //     throw new ApiError(500, `Failed to fetch services: ${error.message}`);
  //   }
  // }

  async getAllServices(
    mentorId: string,
    params: GetAllServicesParams
  ): Promise<GetAllServicesResponse> {
    try {
      if (!mongoose.Types.ObjectId.isValid(mentorId)) {
        throw new ApiError(400, `Invalid mentorId format: ${mentorId}`);
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
      throw new ApiError(500, `Failed to fetch services: ${error.message}`);
    }
  }

  async getServiceById(serviceId: string): Promise<EService | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(serviceId)) {
        throw new ApiError(400, `Invalid serviceId format: ${serviceId}`);
      }

      const service = await Service.findById(serviceId).populate({
        path: "slot",
      });
      return service as EService | null;
    } catch (error: any) {
      console.error("Error in ServiceRepository.getServiceById:", error);
      throw new ApiError(500, `Failed to fetch service: ${error.message}`);
    }
  }

  async updateService(
    serviceId: string,
    serviceData: Partial<EService>
  ): Promise<EService | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(serviceId)) {
        throw new ApiError(400, `Invalid serviceId format: ${serviceId}`);
      }

      const updatedService = await Service.findByIdAndUpdate(
        serviceId,
        { $set: serviceData },
        { new: true, runValidators: true }
      ).populate({ path: "slot" });
      return updatedService as EService | null;
    } catch (error: any) {
      console.error("Error in ServiceRepository.updateService:", error);
      throw new ApiError(500, `Failed to update service: ${error.message}`);
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
      throw new ApiError(500, `Failed to fetch tutorials: ${error.message}`);
    }
  }

  async getTutorialById(tutorialId: string): Promise<any> {
    try {
      console.log("service repo getTutorialById step 1", tutorialId);
      if (!mongoose.Types.ObjectId.isValid(tutorialId)) {
        throw new ApiError(400, `Invalid tutorialId format: ${tutorialId}`);
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
      throw new ApiError(
        500,
        `Failed to fetch tutorial details: ${error.message}`
      );
    }
  }
  async findServicesByTitle(searchQuery: string): Promise<any[]> {
    return await Service.find({
      title: { $regex: searchQuery, $options: "i" },
    })
      .select("_id")
      .exec();
  }
}
