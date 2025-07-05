import { Model } from "mongoose";
import BaseRepository from "./BaseRepository";
import { EUsers } from "../../entities/userEntity";
import { UserResponseDto } from "../../dtos/userDTO";
import { FetchUsersQueryDto } from "../../dtos/adminDTO";
import { logger } from "../../utils/logger";
import { AppError } from "../../errors/appError";
import { HttpStatus } from "../../constants/HttpStatus";

export class UserRepository extends BaseRepository<EUsers> {
  constructor(model: Model<EUsers>) {
    super(model);
  }

  async findAllUsers(): Promise<UserResponseDto[]> {
    try {
      const users = await this.model.find({}).exec();
      return users.map((user) => ({
        _id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isBlocked: user.isBlocked,
        // Add other fields as needed
      }));
    } catch (error) {
      logger.error("Error finding all users", {
        error: error instanceof Error ? error.message : String(error),
      });
      throw new AppError(
        "Failed to find users",
        HttpStatus.INTERNAL_SERVER,
        "error",
        "FIND_ALL_USERS_ERROR"
      );
    }
  }
}
