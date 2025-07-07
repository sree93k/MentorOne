import { EAdmin } from "../../entities/adminEntity";

export interface IAdminRepository {
  findUserById(userId: string): Promise<EAdmin | null>;
  findByEmail(adminEmail: string): Promise<EAdmin | null>;
  findById(id: string): Promise<EAdmin | null>;
}
