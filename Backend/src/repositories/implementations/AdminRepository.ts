// src/repositories/implementations/AdminRepository.ts
import { injectable, inject } from "inversify";
import { EAdmin } from "../../entities/adminEntity";
import { IAdminRepository } from "../interface/IAdminRepository";
import { logger } from "../../utils/logger";
import AppError from "../../errors/appError";
import { HttpStatus } from "../../constants/HttpStatus";
import { Model } from "mongoose";
import { TYPES } from "../../inversify/types";

@injectable()
export default class AdminRepository implements IAdminRepository {
  constructor(@inject(TYPES.AdminModel) private model: Model<EAdmin>) {}

  async findByEmail(adminEmail: string): Promise<EAdmin | null> {
    logger.info("Searching for admin by email", { email: adminEmail });
    try {
      const admin = await this.model
        .findOne({ adminEmail })
        .select("+adminPassword")
        .exec();
      logger.info("Admin found by email", {
        email: adminEmail,
        found: !!admin,
      });
      return admin;
    } catch (error) {
      logger.error("Error finding admin by email", {
        email: adminEmail,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new AppError(
        "Failed to find admin by email",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findById(id: string): Promise<EAdmin | null> {
    logger.info("Searching for admin by ID", { id });
    try {
      const admin = await this.model
        .findById(id)
        .select("-adminPassword")
        .exec();
      logger.info("Admin found by ID", { id, found: !!admin });
      return admin;
    } catch (error) {
      logger.error("Error finding admin by ID", {
        id,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new AppError(
        "Failed to find admin by ID",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
