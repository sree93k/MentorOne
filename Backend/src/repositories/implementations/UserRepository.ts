import { injectable, inject } from "inversify";
import { Types } from "mongoose";
import { IUserRepository } from "../interface/IUserRepository";
import BaseRepository from "./BaseRepository";
import UserModel from "../../models/userModel";
import { EUsers } from "../../entities/userEntity";
import { TYPES } from "../../inversify/types";
import { logger } from "../../utils/logger";
import AppError from "../../errors/appError";
import { HttpStatus } from "../../constants/HttpStatus";

@injectable()
export default class UserRepository
  extends BaseRepository<EUsers>
  implements IUserRepository
{
  constructor(@inject(TYPES.UserModel) model: typeof UserModel) {
    super(model);
  }

  // async findMany(query: any, page: number, limit: number): Promise<EUsers[]> {
  //   try {
  //     logger.info("Fetching users", { query, page, limit });
  //     return await this.model
  //       .find(query)
  //       .skip((page - 1) * limit)
  //       .limit(limit)
  //       .lean()
  //       .exec();
  //   } catch (error) {
  //     logger.error("Error fetching users", {
  //       error: error instanceof Error ? error.message : String(error),
  //     });
  //     throw new AppError(
  //       "Failed to fetch users",
  //       HttpStatus.INTERNAL_SERVER_ERROR
  //     );
  //   }
  // }

  // async countDocuments(query: any): Promise<number> {
  //   try {
  //     logger.info("Counting users", { query });
  //     return await this.model.countDocuments(query).exec();
  //   } catch (error) {
  //     logger.error("Error counting users", {
  //       error: error instanceof Error ? error.message : String(error),
  //     });
  //     throw new AppError(
  //       "Failed to count users",
  //       HttpStatus.INTERNAL_SERVER_ERROR
  //     );
  //   }
  // }

  async countMentors(role?: string, searchQuery?: string): Promise<number> {
    try {
      const query: any = { role: "mentor" };
      if (role) query.role = role;
      if (searchQuery) {
        query.$or = [
          { firstName: { $regex: searchQuery, $options: "i" } },
          { lastName: { $regex: searchQuery, $options: "i" } },
          { email: { $regex: searchQuery, $options: "i" } },
        ];
      }
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

  // async findById(id: string): Promise<EUsers | null> {
  //   try {
  //     if (!Types.ObjectId.isValid(id)) {
  //       throw new AppError("Invalid user ID", HttpStatus.BAD_REQUEST);
  //     }
  //     logger.info("Fetching user by ID", { id });
  //     return await this.model.findById(id).lean().exec();
  //   } catch (error) {
  //     logger.error("Error fetching user by ID", {
  //       id,
  //       error: error instanceof Error ? error.message : String(error),
  //     });
  //     throw new AppError(
  //       "Failed to fetch user",
  //       HttpStatus.INTERNAL_SERVER_ERROR
  //     );
  //   }
  // }

  // async update(id: string, updates: Partial<EUsers>): Promise<EUsers | null> {
  //   try {
  //     if (!Types.ObjectId.isValid(id)) {
  //       throw new AppError("Invalid user ID", HttpStatus.BAD_REQUEST);
  //     }
  //     logger.info("Updating user", { id, updates });
  //     const user = await this.model
  //       .findByIdAndUpdate(
  //         id,
  //         { ...updates, updatedAt: new Date() },
  //         { new: true }
  //       )
  //       .exec();
  //     if (!user) {
  //       logger.warn("User not found", { id });
  //       return null;
  //     }
  //     return user;
  //   } catch (error) {
  //     logger.error("Error updating user", {
  //       id,
  //       error: error instanceof Error ? error.message : String(error),
  //     });
  //     throw new AppError(
  //       "Failed to update user",
  //       HttpStatus.INTERNAL_SERVER_ERROR
  //     );
  //   }
  // }
}
