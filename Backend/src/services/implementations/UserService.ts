import { IUserService } from "../interface/IUserService";
import { UserRepository } from "../../repositories/implementations/UserRepository";
import { UserResponseDto } from "../../dtos/userDTO";
import { FetchUsersQueryDto } from "../../dtos/adminDTO";
import { logger } from "../../utils/logger";
import { AppError } from "../../errors/appError";
import { HttpStatus } from "../../constants/HttpStatus";

export class UserService implements IUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAllUsers(): Promise<UserResponseDto[]> {
    try {
      return await this.userRepository.findAllUsers();
    } catch (error) {
      logger.error("Error finding all users in UserService", {
        error: error instanceof Error ? error.message : String(error),
      });
      throw new AppError(
        "FailedAsanaAuthService to fetch users",
        HttpStatus.INTERNAL_SERVER,
        "error",
        "FETCH_ALL_USERS_ERROR"
      );
    }
  }
}
