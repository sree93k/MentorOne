import { EAdmin } from "../../entities/adminEntity";

export interface IAdminRepository {
  findByEmail(adminEmail: string): Promise<EAdmin | null>;
  removeRefreshToken(
    userId: string,
    refreshToken: string
  ): Promise<EAdmin | null>;
  saveRefreshToken(
    userId: string,
    refreshToken: string
  ): Promise<EAdmin | null>;
  findUserById(userId: string): Promise<EAdmin | null>;
}
