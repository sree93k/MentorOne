import { injectable, inject } from "inversify";
import { Types } from "mongoose";
import { IMentorService } from "../interface/IMentorService";
import { TYPES } from "../../inversify/types";
import { IUserRepository } from "../../repositories/interface/IUserRepository";

import { IMentorRepository } from "../../repositories/interface/IMentorRepository";

import { IBookingRepository } from "../../repositories/interface/IBookingRepository";
import { EUsers } from "../../entities/userEntity";
import { EService } from "../../entities/serviceEntity";
import { ESchedule } from "../../entities/scheduleEntity";
import { EBlockedDate } from "../../entities/blockedEntity";
import { EPriorityDM } from "../../entities/priorityDMEntity";
import { EMentor } from "../../entities/mentorEntity";
import { logger } from "../../utils/logger";
import AppError from "../../errors/appError";
import { HttpStatus } from "../../constants/HttpStatus";
import {
  WelcomeFormData,
  GetAllServicesParams,
  GetAllServicesResponse,
} from "../../types/mentor";

@injectable()
export default class MentorService implements IMentorService {
  constructor(
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository,

    @inject(TYPES.IMentorRepository) private mentorRepository: IMentorRepository
  ) {}

  async countDocuments(isApproved: string): Promise<number | null> {
    const counts = await this.mentorRepository.countDocuments(isApproved);
    return counts;
  }

  async getMentor(mentorId: string): Promise<EMentor | null> {
    return await this.mentorRepository.findById(mentorId);
  }
  async updateTopTestimonials(
    mentorId: string,
    testimonialIds: string[]
  ): Promise<EMentor> {
    logger.debug("Updating top testimonials", { mentorId, testimonialIds });

    try {
      if (!Types.ObjectId.isValid(mentorId)) {
        logger.error("Invalid mentor ID", { mentorId });
        throw new AppError("Invalid mentor ID", HttpStatus.BAD_REQUEST);
      }

      if (testimonialIds.length > 5) {
        logger.error("Cannot select more than 5 testimonials", {
          testimonialIds,
        });
        throw new AppError(
          "Cannot select more than 5 testimonials",
          HttpStatus.BAD_REQUEST
        );
      }

      const mentor = await this.userRepository.findById(mentorId);
      if (!mentor?.mentorId) {
        logger.error("Mentor not found", { mentorId });
        throw new AppError("Mentor not found", HttpStatus.NOT_FOUND);
      }

      const updatedMentor = await this.mentorRepository.update(
        mentor.mentorId._id.toString(),
        {
          topTestimonials: testimonialIds,
        }
      );

      logger.info("Updated top testimonials", { mentorId });
      return updatedMentor;
    } catch (error) {
      logger.error("Error updating top testimonials", { error });
      throw error instanceof AppError
        ? error
        : new AppError(
            error.message || "Failed to update top testimonials",
            HttpStatus.INTERNAL_SERVER_ERROR
          );
    }
  }

  async updateField(id, key, status, reason): Promise<> {
    const mentorUpdated = await this.mentorRepository(id, key, status, reason);

    return mentorUpdated;
  }
}
