import bcrypt from "bcryptjs";
import { EAdmin } from "../../entities/adminEntity";
import { inAdminAuthService } from "../interface/inAdminAuthservice";
import { inAdminRepository } from "../../repositories/interface/IAdminRespository";
import AdminRepository from "../../repositories/implementations/AdminRepository";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt";

export default class AdminAuthService implements inAdminAuthService {
  private AdminRepository: inAdminRepository;

  constructor() {
    this.AdminRepository = new AdminRepository();
  }

  //login
  async login(user: { adminEmail: string; adminPassword: string }): Promise<{
    accessToken: string;
    refreshToken: string;
    adminFound: Omit<EAdmin, "adminPassword">;
  } | null> {
    console.log("Service - Login attempt for email:", user.adminEmail);
    if (!user.adminEmail) {
      console.log("Service - Error: adminEmail is required");
      throw new Error("adminEmail is required");
    }
    const adminFound = await this.AdminRepository.findByEmail(user.adminEmail);
    console.log("Service - Admin found:", adminFound ? "Yes" : "No");

    if (
      adminFound &&
      user.adminPassword &&
      adminFound.adminPassword &&
      (await bcrypt.compare(
        user.adminPassword.toString(),
        adminFound.adminPassword.toString()
      ))
    ) {
      const id = adminFound._id?.toString();

      const accessToken = generateAccessToken({
        id,
        role: adminFound.role,
      });

      const refreshToken = generateRefreshToken({
        id,
        role: adminFound.role,
      });

      await this.AdminRepository.saveRefreshToken(id, refreshToken);

      const adminObject = adminFound.toObject();

      const { adminPassword, ...adminWithoutPassword } = adminObject;

      return { accessToken, refreshToken, adminFound: adminWithoutPassword };
    }

    console.log("Service - Login failed");
    return null;
  }

  async logout(token: string, id: string): Promise<EAdmin | null> {
    console.log("service admin logout step 1 ", token, id);
    const admin = await this.AdminRepository.removeRefreshToken(id, token);
    console.log("service admin logout step 2 ", admin);
    return admin ? admin : null;
  }

  async refreshAccessToken(userId: string): Promise<string | null> {
    const adminFound = await this.AdminRepository.findByEmail(userId);

    if (adminFound) {
      const id = adminFound._id?.toString();

      const accessToken = generateAccessToken({
        id,
        role: adminFound.role,
      });

      return accessToken;
    }

    return null;
  }
}
