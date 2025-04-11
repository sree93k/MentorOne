import { EAdmin } from "../../entities/adminEntity";
import jwt from "jsonwebtoken";

export interface inAdminAuthService {
  login(user: Partial<EAdmin>): Promise<{
    accessToken: string;
    refreshToken: string;
    adminFound: Omit<EAdmin, "adminPassword">;
  } | null>;

  logout(token: string, id: string): Promise<EAdmin | null>;

  refreshAccessToken(user: string | jwt.JwtPayload): Promise<string | null>;
}
