import { injectable, inject } from "inversify";
import { Types } from "mongoose";
import { IMentorRepository } from "../interface/IMentorRepository";
import BaseRepository from "./BaseRepository";
import MentorModel from "../../models/mentorModel";
import { EMentor } from "../../entities/mentorEntity";
import { TYPES } from "../../inversify/types";
import { logger } from "../../utils/logger";
import AppError from "../../errors/appError";
import { HttpStatus } from "../../constants/HttpStatus";

@injectable()
export default class MentorRepository
  extends BaseRepository<EMentor>
  implements IMentorRepository
{
  constructor(@inject(TYPES.MentorModel) model: typeof MentorModel) {
    super(model);
  }

  async getMentor(id: string): Promise<EMentor | null> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new AppError("Invalid mentor ID", HttpStatus.BAD_REQUEST);
      }
      logger.info("Fetching mentor by ID", { id });
      return await this.model.findById(id).lean().exec();
    } catch (error) {
      logger.error("Error fetching mentor", {
        id,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new AppError(
        "Failed to fetch mentor",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateField(
    id: string,
    field: string,
    value: string,
    reason?: string
  ): Promise<EMentor | null> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new AppError("Invalid mentor ID", HttpStatus.BAD_REQUEST);
      }
      const update: any = { [field]: value, updatedAt: new Date() };
      if (reason) update.reason = reason;
      logger.info("Updating mentor field", { id, field, value });
      const mentor = await this.model
        .findByIdAndUpdate(id, update, { new: true })
        .exec();
      if (!mentor) {
        logger.warn("Mentor not found", { id });
        return null;
      }
      return mentor;
    } catch (error) {
      logger.error("Error updating mentor field", {
        id,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new AppError(
        "Failed to update mentor",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async countDocuments(query: any): Promise<number> {
    try {
      logger.info("Counting mentors", { query });
      return await this.model.countDocuments(query).exec();
    } catch (error) {
      logger.error("Error counting mentors", {
        error: error instanceof Error ? error.message : String(error),
      });
      throw new AppError(
        "Failed to count mentors",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
