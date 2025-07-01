import { EAdmin } from "../entities/adminEntity";
// src/types/admin.ts
export interface TAdminLogin {
  adminEmail: string;
  adminPassword: string;
}

export interface TAdminLoginResponse {
  success: boolean;
  data?: {
    adminFound: Omit<EAdmin, "adminPassword">;
  };
  error?: string;
}
