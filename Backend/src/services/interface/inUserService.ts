import { EUsers } from "../../entities/userEntity";
import { EOTP } from "../../entities/OTPEntity";

export interface inUserService {
  findUserWithEmail(user: Partial<EUsers>): Promise<EUsers | null>;
  updatePassword(
    id: string,
    password: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }>;
  editUserProfile(id: string, paylaod: any): Promise<EUsers | null>;
}
