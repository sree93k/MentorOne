import { Model } from "mongoose";
import { EMentor } from "../../entities/mentorEntity";
import { IMentorRepository } from "../interface/IMentorRepository";
import BaseRepository from "./BaseRepository";
import { logger } from "../../utils/logger";
import { AppError } from "../../errors/appError";
import { HttpStatus } from "../../constants/HttpStatus";

export class MentorRepository
  extends BaseRepository<EMentor>
  implements IMentorRepository
{
  constructor(model: Model<EMentor>) {
    super(model);
  }

  async createMentor(data: Partial<EMentor>): Promise<EMentor> {
    try {
      return await this.create(data);
    } catch (error) {
      logger.error("Error creating mentor", {
        error: error instanceof Error ? error.message : String(error),
      });
      throw new AppError(
        "Failed to create mentor",
        HttpStatus.INTERNAL_SERVER,
        "error",
        "CREATE_MENTOR_ERROR"
      );
    }
  }

  async getMentor(id: string): Promise<EMentor | null> {
    try {
      return await this.findById(id);
    } catch (error) {
      logger.error("Error fetching mentor", {
        id,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new AppError(
        "Failed to fetch mentor",
        HttpStatus.INTERNAL_SERVER,
        "error",
        "FETCH_MENTOR_ERROR"
      );
    }
  }

  async updateField(
    id: string,
    field: string,
    status: string,
    reason: string = ""
  ): Promise<EMentor | null> {
    try {
      const updateFields: { [key: string]: string } = { [field]: status };
      if (reason) {
        updateFields.approvalReason = reason;
      }

      return await this.model
        .findByIdAndUpdate(id, { $set: updateFields }, { new: true })
        .exec();
    } catch (error) {
      logger.error("Error updating mentor field", {
        id,
        field,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new AppError(
        "Failed to update mentor field",
        HttpStatus.INTERNAL_SERVER,
        "error",
        "UPDATE_MENTOR_FIELD_ERROR"
      );
    }
  }
}
