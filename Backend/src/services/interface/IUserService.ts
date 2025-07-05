import { UserResponseDto } from "../../dtos/userDTO";
import { FetchUsersQueryDto } from "../../dtos/adminDTO";

export interface IUserService {
  findAllUsers(): Promise<UserResponseDto[]>;
}
