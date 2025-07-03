import { injectable, inject } from "inversify";
import { Types } from "mongoose";
import { IMenteeRepository } from "../interface/IMenteeRepository";
import BaseRepository from "./BaseRepository";
import MenteeModel from "../../models/menteeModel";
import { EMentee } from "../../entities/menteeEntity";
import { TYPES } from "../../inversify/types";
import { logger } from "../../utils/logger";
import AppError from "../../errors/appError";
import { HttpStatus } from "../../constants/HttpStatus";

@injectable()
export default class MenteeRepository
  extends BaseRepository<EMentee>
  implements IMenteeRepository
{
  constructor(@inject(TYPES.MenteeModel) model: typeof MenteeModel) {
    super(model);
  }

  async getMentee(id: string): Promise<EMentee | null> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new AppError("Invalid mentee ID", HttpStatus.BAD_REQUEST);
      }
      logger.info("Fetching mentee by ID", { id });
      return await this.model.findById(id).lean().exec();
    } catch (error) {
      logger.error("Error fetching mentee", {
        id,
        error: error instanceof Error ? error.message : String(error),
      });
      throw new AppError(
        "Failed to fetch mentee",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
