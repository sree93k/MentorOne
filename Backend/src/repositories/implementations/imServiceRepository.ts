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
}
