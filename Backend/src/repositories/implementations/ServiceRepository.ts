import mongoose from "mongoose";
import { IServiceRepository } from "../interface/IServiceRepository";
import { ApiError } from "../../middlewares/errorHandler";
import Service from "../../models/serviceModel";
import { EService } from "../../entities/serviceEntity";

export default class ServiceRepository implements IServiceRepository {
  async getAllServices(mentorId: string): Promise<EService[]> {
    try {
      if (!mongoose.Types.ObjectId.isValid(mentorId)) {
        throw new ApiError(400, `Invalid mentorId format: ${mentorId}`);
      }

      const allServices = await Service.find({
        mentorId: new mongoose.Types.ObjectId(mentorId),
      });
      return allServices as EService[];
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

      const service = await Service.findById(serviceId);
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
      );
      return updatedService as EService | null;
    } catch (error: any) {
      console.error("Error in ServiceRepository.updateService:", error);
      throw new ApiError(500, `Failed to update service: ${error.message}`);
    }
  }

  async getAllVideoTutorials(): Promise<any[]> {
    try {
      console.log("servcie repoo getAllVideoTutorials step 1");

      const tutorials = await Service.find({
        type: "DigitalProducts",
        digitalProductType: "videoTutorials",
      })
        .populate("mentorId", "username") // Populate mentor's username
        .select("title amount exclusiveContent mentorId");
      // Select only required fields
      console.log("servcie repoo getAllVideoTutorials step 2", tutorials);
      const response = tutorials.map((tutorial) => ({
        _id: tutorial._id,
        userId: tutorial.mentorId,
        mentorId: tutorial.mentorId?.mentorId,
        title: tutorial.title,
        amount: tutorial.amount,
        seasonCount: tutorial?.exclusiveContent?.length,
        mentorUsername: tutorial.mentorId?.username,
      }));
      console.log("servcie repoo getAllVideoTutorials step 3", response);
      return response;
    } catch (error: any) {
      console.error("Error in ServiceRepository.getAllVideoTutorials:", error);
      throw new ApiError(
        500,
        `Failed to fetch video tutorials: ${error.message}`
      );
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
