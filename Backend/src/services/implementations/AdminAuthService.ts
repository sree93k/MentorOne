import bcrypt from "bcryptjs";
import { EAdmin } from "../../entities/adminEntity";
import { IAdminAuthService } from "../interface/IAdminAuthservice";
import { IAdminRepository } from "../../repositories/interface/IAdminRespository";
import AdminRepository from "../../repositories/implementations/AdminRepository";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt";

import { HttpStatus } from "../../constants/HttpStatus";

export default class AdminAuthService implements IAdminAuthService {
  private AdminRepository: IAdminRepository;

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
    try {
      if (!user.adminEmail) {
        console.log("Service - Error: adminEmail is required");
        throw new Error(`${HttpStatus.BAD_REQUEST}: adminEmail is required`);
      }
      const adminFound = await this.AdminRepository.findByEmail(
        user.adminEmail
      );
      console.log("Service - Admin found:", adminFound ? "Yes" : "No");
      console.log("Service - Admin found:", adminFound);
      if (
        adminFound &&
        user.adminPassword &&
        adminFound.adminPassword &&
        (await bcrypt.compare(
          user.adminPassword.toString(),
          adminFound.adminPassword.toString()
        ))
      ) {
        // const id = adminFound._id?.toString();
        // if (!id) {
        //   throw new Error(
        //     `${HttpStatus.INTERNAL_SERVER_ERROR}: Admin ID not found`
        //   );
        // }
        // const accessToken = generateAccessToken({
        //   id,
        //   role: adminFound.role,
        // });

        // const refreshToken = generateRefreshToken({
        //   id,
        //   role: adminFound.role,
        // });

        const id = adminFound._id.toString();
        const role = Array.isArray(adminFound.role)
          ? adminFound.role[0]
          : adminFound.role || "admin";
        const accessToken = generateAccessToken({ id, role });
        const refreshToken = generateRefreshToken({ id, role });

        await this.AdminRepository.saveRefreshToken(id, refreshToken);

        const adminObject = adminFound.toObject();

        const { adminPassword, ...adminWithoutPassword } = adminObject;

        return { accessToken, refreshToken, adminFound: adminWithoutPassword };
      }

      console.log("Service - Login failed");
      return null;
    } catch (error) {
      throw new Error(
        `${HttpStatus.UNAUTHORIZED}: Invalid credentials - ${error}`
      );
    }
  }

  async logout(token: string, id: string): Promise<EAdmin | null> {
    try {
      console.log("service admin logout step 1 ", token, id);
      const admin = await this.AdminRepository.removeRefreshToken(id, token);
      console.log("service admin logout step 2 ", admin);
      return admin ? admin : null;
    } catch (error) {
      throw new Error(
        `${HttpStatus.INTERNAL_SERVER_ERROR}: Failed to logout - ${error}`
      );
    }
  }

  async refreshAccessToken(userId: string): Promise<string | null> {
    try {
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
    } catch (error) {
      throw new Error(
        `${HttpStatus.UNAUTHORIZED}: Failed to refresh token - ${error}`
      );
    }
  }
}
