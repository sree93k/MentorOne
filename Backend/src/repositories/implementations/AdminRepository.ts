import { EAdmin } from "../../entities/adminEntity";
import Admin from "../../models/adminModel";
import { IAdminRepository } from "../interface/IAdminRespository";
import BaseRepository from "./BaseRepository";
import mongoose from "mongoose";

export default class AdminRepository
  extends BaseRepository<EAdmin>
  implements IAdminRepository
{
  constructor() {
    super(Admin);
  }
  async findUserById(userId: string): Promise<EAdmin | null> {
    try {
      console.log("Repository - Searching for admin with user ID:", userId);

      // Check database connection
      console.log(
        "Repository - Database connection state:",
        mongoose.connection.readyState
      );
      console.log(
        "Repository - Database name:",
        mongoose.connection.db?.databaseName
      );

      // Try to find the specific admin by user ID
      const admin = await Admin.findById(userId);
      console.log("Repository - Specific admin found:", admin);

      if (admin) {
        console.log("Repository - Admin details:", {
          email: admin.adminEmail,
          role: admin.role,
          hasPassword: !!admin.adminPassword,
        });
      }

      return admin;
    } catch (error) {
      console.error("Repository - Error finding admin by user ID:", error);
      throw error;
    }
  }

  async findByEmail(adminEmail: string): Promise<EAdmin | null> {
    console.log("Repository - Searching for admin with email:", adminEmail);

    // Try to find the specific admin
    const admin = await Admin.findOne({ adminEmail });
    console.log("Repository - Specific admin found:", admin);

    return admin;
  }

  async saveRefreshToken(
    userId: string,
    refreshToken: string
  ): Promise<EAdmin | null> {
    const adminWithSavedToken = await Admin.findOneAndUpdate(
      { _id: userId },
      { $push: { refreshToken: refreshToken } }
    ).select("-password -refreshToken");

    return adminWithSavedToken;
  }

  async removeRefreshToken(
    userId: string,
    refreshToken: string
  ): Promise<EAdmin | null> {
    const adminWithRemovedToken = await Admin.findOneAndUpdate(
      { _id: userId },
      { $pull: { refreshToken: refreshToken } },
      { new: true }
    ).select("-password -refreshToken");

    return adminWithRemovedToken;
  }
}
