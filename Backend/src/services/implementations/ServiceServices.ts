import mongoose from "mongoose";
import {
  IServiceService,
  GetAllServicesParams,
  GetAllServicesForMenteeParams,
  GetAllServicesResponse,
  GetAllServicesForMenteeResponse,
  GetAllVideoTutorialsParams,
  GetAllVideoTutorialsResponse,
  GetTopServicesResponse,
} from "../interface/IServiceServices";
import { IServiceRepository } from "../../repositories/interface/IServiceRepository";
import ServiceRepository from "../../repositories/implementations/ServiceRepository";
import { EService } from "../../entities/serviceEntity";
import {
  CreateServiceDTO,
  UpdateServiceDTO,
  ServiceValidationDTO,
  VideoTutorialFilterDTO,
} from "../../dtos/serviceDTO";

export default class ServiceService implements IServiceService {
  private serviceRepository: IServiceRepository;

  constructor() {
    this.serviceRepository = new ServiceRepository();
  }

  async createService(serviceData: Partial<EService>): Promise<EService> {
    try {
      console.log("ServiceService createService step 1", serviceData);

      // Validate service data
      await this.validateServiceData(serviceData);

      // Create service using repository
      const service = await this.serviceRepository.create(serviceData);

      if (!service) {
        throw new Error("Failed to create service");
      }

      console.log(
        "ServiceService createService step 2 - Service created",
        service._id
      );
      return service;
    } catch (error: any) {
      console.error("ServiceService createService error:", error);
      throw new Error(`Failed to create service: ${error.message}`);
    }
  }

  async getServiceById(serviceId: string): Promise<EService | null> {
    try {
      console.log("ServiceService getServiceById step 1", serviceId);

      if (!serviceId || !mongoose.Types.ObjectId.isValid(serviceId)) {
        throw new Error("Invalid service ID format");
      }

      const service = await this.serviceRepository.getServiceById(serviceId);
      console.log(
        "ServiceService getServiceById step 2",
        service ? "Service found" : "Service not found"
      );

      return service;
    } catch (error: any) {
      console.error("ServiceService getServiceById error:", error);
      throw new Error(`Failed to fetch service: ${error.message}`);
    }
  }

  async updateService(
    serviceId: string,
    serviceData: Partial<EService>
  ): Promise<EService | null> {
    try {
      console.log("ServiceService updateService step 1", {
        serviceId,
        hasData: !!serviceData,
      });

      if (!serviceId || !mongoose.Types.ObjectId.isValid(serviceId)) {
        throw new Error("Invalid service ID format");
      }

      // Validate service exists
      const existingService = await this.getServiceById(serviceId);
      if (!existingService) {
        throw new Error("Service not found");
      }

      // Validate update data if provided
      if (Object.keys(serviceData).length > 0) {
        await this.validateServiceData(serviceData, false); // false for update validation
      }

      const updatedService = await this.serviceRepository.updateService(
        serviceId,
        serviceData
      );
      console.log(
        "ServiceService updateService step 2",
        updatedService ? "Service updated" : "Update failed"
      );

      return updatedService;
    } catch (error: any) {
      console.error("ServiceService updateService error:", error);
      throw new Error(`Failed to update service: ${error.message}`);
    }
  }

  async deleteService(serviceId: string): Promise<boolean> {
    try {
      console.log("ServiceService deleteService step 1", serviceId);

      if (!serviceId || !mongoose.Types.ObjectId.isValid(serviceId)) {
        throw new Error("Invalid service ID format");
      }

      // Check if service exists
      const service = await this.getServiceById(serviceId);
      if (!service) {
        throw new Error("Service not found");
      }

      // Delete service using repository's deleteById method
      const deletedService = await this.serviceRepository.deleteById(serviceId);
      const isDeleted = !!deletedService;

      console.log(
        "ServiceService deleteService step 2",
        isDeleted ? "Service deleted" : "Delete failed"
      );
      return isDeleted;
    } catch (error: any) {
      console.error("ServiceService deleteService error:", error);
      throw new Error(`Failed to delete service: ${error.message}`);
    }
  }

  async getAllServicesByMentor(
    mentorId: string,
    params: GetAllServicesParams
  ): Promise<GetAllServicesResponse> {
    try {
      console.log("ServiceService getAllServicesByMentor step 1", {
        mentorId,
        params,
      });

      if (!mentorId || !mongoose.Types.ObjectId.isValid(mentorId)) {
        throw new Error("Invalid mentor ID format");
      }

      // Validate pagination parameters
      if (params.page < 1 || params.limit < 1 || params.limit > 100) {
        throw new Error("Invalid pagination parameters");
      }

      const response = await this.serviceRepository.getAllServices(
        mentorId,
        params
      );
      console.log("ServiceService getAllServicesByMentor step 2", {
        servicesCount: response.services.length,
        totalCount: response.totalCount,
      });

      return response;
    } catch (error: any) {
      console.error("ServiceService getAllServicesByMentor error:", error);
      throw new Error(`Failed to fetch mentor services: ${error.message}`);
    }
  }

  async getAllServicesForMentee(
    params: GetAllServicesForMenteeParams
  ): Promise<GetAllServicesForMenteeResponse> {
    try {
      console.log("ServiceService getAllServicesForMentee step 1", params);

      // Validate pagination parameters
      if (params.page < 1 || params.limit < 1 || params.limit > 100) {
        throw new Error("Invalid pagination parameters");
      }

      const response = await this.serviceRepository.getAllServicesForMentee(
        params
      );
      console.log("ServiceService getAllServicesForMentee step 2", {
        servicesCount: response.services.length,
        total: response.total,
      });

      return response;
    } catch (error: any) {
      console.error("ServiceService getAllServicesForMentee error:", error);
      throw new Error(`Failed to fetch services for mentee: ${error.message}`);
    }
  }

  async getAllVideoTutorials(
    params: GetAllVideoTutorialsParams
  ): Promise<GetAllVideoTutorialsResponse> {
    try {
      console.log("ServiceService getAllVideoTutorials step 1", params);

      const { type, searchQuery, page = 1, limit = 12 } = params;

      // Validate pagination parameters
      if (page < 1 || limit < 1 || limit > 100) {
        throw new Error("Invalid pagination parameters");
      }

      const response = await this.serviceRepository.getAllVideoTutorials(
        type,
        searchQuery,
        page,
        limit
      );
      console.log("ServiceService getAllVideoTutorials step 2", {
        tutorialsCount: response.tutorials.length,
        total: response.total,
      });

      return response;
    } catch (error: any) {
      console.error("ServiceService getAllVideoTutorials error:", error);
      throw new Error(`Failed to fetch video tutorials: ${error.message}`);
    }
  }

  async getTutorialById(tutorialId: string): Promise<any> {
    try {
      console.log("ServiceService getTutorialById step 1", tutorialId);

      if (!tutorialId || !mongoose.Types.ObjectId.isValid(tutorialId)) {
        throw new Error("Invalid tutorial ID format");
      }

      const tutorial = await this.serviceRepository.getTutorialById(tutorialId);
      console.log(
        "ServiceService getTutorialById step 2",
        tutorial ? "Tutorial found" : "Tutorial not found"
      );

      if (!tutorial) {
        throw new Error("Tutorial not found");
      }

      return tutorial;
    } catch (error: any) {
      console.error("ServiceService getTutorialById error:", error);
      throw new Error(`Failed to fetch tutorial: ${error.message}`);
    }
  }

  async findServicesByTitle(searchQuery: string): Promise<EService[]> {
    try {
      console.log("ServiceService findServicesByTitle step 1", searchQuery);

      if (!searchQuery || searchQuery.trim().length < 2) {
        throw new Error("Search query must be at least 2 characters long");
      }

      const services = await this.serviceRepository.findServicesByTitle(
        searchQuery.trim()
      );
      console.log("ServiceService findServicesByTitle step 2", {
        servicesCount: services.length,
      });

      return services;
    } catch (error: any) {
      console.error("ServiceService findServicesByTitle error:", error);
      throw new Error(`Failed to search services by title: ${error.message}`);
    }
  }

  async findServicesById(id: string): Promise<EService | null> {
    try {
      console.log("ServiceService findServicesById step 1", id);

      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid service ID format");
      }

      const service = await this.serviceRepository.findServicesById(id);
      console.log(
        "ServiceService findServicesById step 2",
        service ? "Service found" : "Service not found"
      );

      return service;
    } catch (error: any) {
      console.error("ServiceService findServicesById error:", error);
      throw new Error(`Failed to find service by ID: ${error.message}`);
    }
  }

  async getTopServices(limit: number): Promise<GetTopServicesResponse> {
    try {
      console.log("ServiceService getTopServices step 1", { limit });

      if (limit < 1 || limit > 50) {
        throw new Error("Limit must be between 1 and 50");
      }

      const services = await this.serviceRepository.getTopServices(limit);
      console.log("ServiceService getTopServices step 2", {
        servicesCount: services.length,
      });

      return { services };
    } catch (error: any) {
      console.error("ServiceService getTopServices error:", error);
      throw new Error(`Failed to fetch top services: ${error.message}`);
    }
  }

  async validateServiceData(
    serviceData: Partial<EService>,
    isCreate: boolean = true
  ): Promise<void> {
    try {
      console.log("ServiceService validateServiceData step 1", {
        isCreate,
        hasData: !!serviceData,
      });

      // Common validations for both create and update
      if (serviceData.title !== undefined) {
        if (
          !serviceData.title ||
          serviceData.title.trim().length < 3 ||
          serviceData.title.trim().length > 100
        ) {
          throw new Error("Title must be between 3 and 100 characters");
        }
      }

      if (serviceData.amount !== undefined) {
        if (serviceData.amount < 0) {
          throw new Error("Amount must be non-negative");
        }
      }

      if (serviceData.shortDescription !== undefined) {
        if (
          !serviceData.shortDescription ||
          serviceData.shortDescription.trim().length > 200
        ) {
          throw new Error("Short description must not exceed 200 characters");
        }
      }

      if (serviceData.duration !== undefined) {
        if (serviceData.duration < 5) {
          throw new Error("Duration must be at least 5 minutes");
        }
      }

      if (serviceData.longDescription !== undefined) {
        if (
          serviceData.longDescription &&
          serviceData.longDescription.trim().length < 20
        ) {
          throw new Error("Long description must be at least 20 characters");
        }
      }

      // Create-specific validations
      if (isCreate) {
        if (!serviceData.mentorId) {
          throw new Error("Mentor ID is required");
        }

        if (!serviceData.type) {
          throw new Error("Service type is required");
        }

        if (
          !["1-1Call", "priorityDM", "DigitalProducts"].includes(
            serviceData.type
          )
        ) {
          throw new Error("Invalid service type");
        }

        if (!serviceData.title) {
          throw new Error("Title is required");
        }

        if (serviceData.amount === undefined) {
          throw new Error("Amount is required");
        }

        if (!serviceData.shortDescription) {
          throw new Error("Short description is required");
        }
      }

      // Type-specific validations
      if (serviceData.type === "1-1Call") {
        if (
          serviceData.oneToOneType &&
          !["chat", "video"].includes(serviceData.oneToOneType)
        ) {
          throw new Error("Invalid one-to-one type for 1-1Call service");
        }
      }

      if (serviceData.type === "DigitalProducts") {
        if (
          serviceData.digitalProductType &&
          !["documents", "videoTutorials"].includes(
            serviceData.digitalProductType
          )
        ) {
          throw new Error("Invalid digital product type");
        }

        if (
          serviceData.digitalProductType === "videoTutorials" &&
          serviceData.exclusiveContent
        ) {
          if (
            !Array.isArray(serviceData.exclusiveContent) ||
            serviceData.exclusiveContent.length === 0
          ) {
            throw new Error(
              "Exclusive content is required for video tutorials"
            );
          }
        }
      }

      console.log(
        "ServiceService validateServiceData step 2 - Validation passed"
      );
    } catch (error: any) {
      console.error("ServiceService validateServiceData error:", error);
      throw error;
    }
  }

  async validateServiceOwnership(
    serviceId: string,
    mentorId: string
  ): Promise<boolean> {
    try {
      console.log("ServiceService validateServiceOwnership step 1", {
        serviceId,
        mentorId,
      });

      if (!serviceId || !mentorId) {
        throw new Error("Service ID and Mentor ID are required");
      }

      if (
        !mongoose.Types.ObjectId.isValid(serviceId) ||
        !mongoose.Types.ObjectId.isValid(mentorId)
      ) {
        throw new Error("Invalid ID format");
      }

      const service = await this.getServiceById(serviceId);
      if (!service) {
        throw new Error("Service not found");
      }

      const isOwner = service.mentorId.toString() === mentorId;
      console.log("ServiceService validateServiceOwnership step 2", {
        isOwner,
      });

      return isOwner;
    } catch (error: any) {
      console.error("ServiceService validateServiceOwnership error:", error);
      throw new Error(`Failed to validate service ownership: ${error.message}`);
    }
  }
}
