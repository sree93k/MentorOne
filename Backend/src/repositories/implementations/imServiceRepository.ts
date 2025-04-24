import mongoose from "mongoose";
import { inServiceRepository } from "../interface/inServiceRepository";
import { ApiError } from "../../middlewares/errorHandler";
import Service from "../../models/serviceModel";
import { EService } from "../../entities/serviceEntity";

export default class ServiceRepository implements inServiceRepository {
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
}
