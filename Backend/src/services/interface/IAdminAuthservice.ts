// import { EAdmin } from "../../entities/adminEntity";
// import jwt from "jsonwebtoken";

import { EAdmin } from "../../entities/adminEntity";

export interface IAdminAuthService {
  login(user: { adminEmail: string; adminPassword: string }): Promise<{
    accessToken: string;
    refreshToken: string;
    adminFound: Omit<EAdmin, "adminPassword">;
  } | null>;

  // ✅ CHANGED: Remove refreshToken parameter
  logout(userId: string): Promise<boolean>;

  // ✅ CHANGED: Remove refreshToken parameter
  refreshAccessToken(userId: string): Promise<{
    newAccessToken: string;
    newRefreshToken: string;
  } | null>;

  logoutFromAllDevices(userId: string): Promise<boolean>;
}
