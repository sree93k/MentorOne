// import { AdminLoginDTO } from "../../dtos/adminDTO";

// export interface IAdminAuthService {
//   login(dto: AdminLoginDTO): Promise<{
//     accessToken: string;
//     refreshToken: string;
//     adminFound: any;
//   } | null>;
//   logout(userId: string, refreshToken: string): Promise<boolean>;
//   refreshAccessToken(
//     userId: string,
//     refreshToken: string
//   ): Promise<string | null>;
// }
import { AdminLoginDTO } from "../../dtos/adminDTO";
import { EAdmin } from "../../entities/adminEntity";

export interface IAdminAuthService {
  login(dto: AdminLoginDTO): Promise<{
    accessToken: string;
    refreshToken: string;
    adminFound: Omit<EAdmin, "adminPassword">;
  } | null>;
  logout(userId: string, refreshToken: string): Promise<boolean>;
  refreshAccessToken(
    userId: string,
    refreshToken: string
  ): Promise<string | null>;
  logoutFromAllDevices(userId: string): Promise<boolean>;
}
