import { Model } from "mongoose";
import BaseRepository from "./BaseRepository";
import { EService } from "../../entities/serviceEntity";
import { logger } from "../../utils/logger";
import { AppError } from "../../errors/appError";
import { HttpStatus } from "../../constants/HttpStatus";

export class ServiceRepository extends BaseRepository<EService> {
  constructor(model: Model<EService>) {
    super(model);
  }

  async findAllServices(): Promise<EService[]> {
    try {
      return await this.model.find({}).exec();
    } catch (error) {
      logger.error("Error finding all services", {
        error: error instanceof Error ? error.message : String(error),
      });
      throw new AppError(
        "Failed to find services",
        HttpStatus.INTERNAL_SERVER,
        "error",
        "FIND_ALL_SERVICES_ERROR"
      );
    }
  }
}
