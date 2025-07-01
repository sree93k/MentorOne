import { EAdmin } from "../../entities/adminEntity";
import jwt from "jsonwebtoken";

export interface IAdminAuthService {
  login(user: Partial<EAdmin>): Promise<{
    accessToken: string;
    refreshToken: string;
    adminFound: Omit<EAdmin, "adminPassword">;
  } | null>;

  logout(token: string, id: string): Promise<boolean | null>;
  refreshAccessToken(
    userId: string,
    refreshToken: string
  ): Promise<string | null>;
  logoutFromAllDevices(userId: string): Promise<boolean>;
  // findById(id: string): Promise<EAdmin | null>;
}
