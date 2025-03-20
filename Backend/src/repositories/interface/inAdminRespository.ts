import { IAdmin } from "../../entities/adminEntity";

export interface IAdminRepository {
    findByEmail(adminEmail: string): Promise<IAdmin | null>;
}