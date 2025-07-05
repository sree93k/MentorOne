import { IServiceServices } from "../interface/IServiceServices";
import { ServiceRepository } from "../../repositories/implementations/ServiceRepository";
import { EService } from "../../entities/serviceEntity";
import { logger } from "../../utils/logger";
import { AppError } from "../../errors/appError";
import { HttpStatus } from "../../constants/HttpStatus";

export class ServiceServices implements IServiceServices {
  constructor(private readonly serviceRepository: ServiceRepository) {}

  async findAllServices(): Promise<EService[]> {
    try {
      return await this.serviceRepository.findAllServices();
    } catch (error) {
      logger.error("Error finding all services in ServiceServices", {
        error: error instanceof Error ? error.message : String(error),
      });
      throw new AppError(
        "Failed to fetch services",
        HttpStatus.INTERNAL_SERVER,
        "error",
        "FETCH_SERVICES_ERROR"
      );
    }
  }
}
