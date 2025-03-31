import { EAdmin } from "../../entities/adminEntity";

export interface IAdminAuthService {
  login(user: { adminEmail: string; adminPassword: string }): Promise<{
    adminFound: Omit<EAdmin, "adminPassword">;
    role: string;
  } | null>;
}
