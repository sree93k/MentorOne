import bcrypt from "bcryptjs";
import { EAdmin } from "../../entities/adminEntity";
import { IAdminAuthService } from "../interface/inAdminAuthservice";
import { inAdminRepository } from "../../repositories/interface/inAdminRespository";
import AdminRepository from "../../repositories/implementations/imAdminRepository";

export default class AdminAuthService implements IAdminAuthService {
  private AdminRepository: inAdminRepository;

  constructor() {
    this.AdminRepository = new AdminRepository();
  }

  async login(user: { adminEmail: string; adminPassword: string }): Promise<{
    adminFound: Omit<EAdmin, "adminPassword">;
    role: string;
  } | null> {
    console.log("Service - Login attempt for email:", user.adminEmail);

    if (!user.adminEmail) {
      console.log("Service - Error: adminEmail is required");
      throw new Error("adminEmail is required");
    }

    const adminFound = await this.AdminRepository.findByEmail(user.adminEmail);
    console.log("Service - Admin found:", adminFound ? "Yes" : "No");

    if (adminFound && user.adminPassword && adminFound.adminPassword) {
      console.log("Service - Comparing passwords");
      console.log("Service - Input password:", user.adminPassword);
      console.log("Service - Stored password hash:", adminFound.adminPassword);

      const isPasswordValid = await bcrypt.compare(
        user.adminPassword,
        adminFound.adminPassword
      );
      console.log("Service - Password valid:", isPasswordValid);

      if (isPasswordValid) {
        console.log("Service - Login successful");
        const adminObject = adminFound.toObject();
        const { adminPassword, ...adminWithoutPassword } = adminObject;
        return {
          adminFound: adminWithoutPassword,
          role: adminFound.role || "admin",
        };
      }
    }

    console.log("Service - Login failed");
    return null;
  }
}
