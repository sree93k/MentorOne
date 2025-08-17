// src/repositories/implementations/AdminRepository.ts
import { injectable } from "inversify";
import { EAdmin } from "../../entities/adminEntity";
import Admin from "../../models/adminModel";
import { IAdminRepository } from "../interface/IAdminRespository";
import BaseRepository from "./BaseRepository";

@injectable()
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
      const admin = await Admin.findById(userId).select("-adminPassword");
      console.log("Repository - Specific admin found:", admin);
      return admin;
    } catch (error) {
      console.error("Repository - Error finding admin by user ID:", error);
      throw error;
    }
  }

  async findByEmail(adminEmail: string): Promise<EAdmin | null> {
    console.log("Repository - Searching for admin with email:", adminEmail);
    const admin = await Admin.findOne({ adminEmail }).select("+adminPassword");
    console.log("Repository - Specific admin found:", admin);
    return admin;
  }

  async findById(id: string): Promise<EAdmin | null> {
    return await Admin.findById(id).select("-adminPassword");
  }
}
