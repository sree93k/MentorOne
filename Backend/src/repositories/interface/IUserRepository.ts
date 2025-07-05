import { EUsers } from "../../entities/userEntity";
import { UserResponseDto } from "../../dtos/userDTO";
export interface IUserRepository {
  findAllUsers(): Promise<UserResponseDto[]>;
}
