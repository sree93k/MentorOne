import { EUsers } from "../../entities/userEntity";

interface BlockStatusResponse {
  isBlocked: boolean;
  blockData?: {
    reason: string;
    category: string;
    adminEmail: string;
    timestamp: string;
    canAppeal: boolean;
    severity: "high" | "medium" | "low";
  };
  userInfo: {
    userId: string;
    email: string;
    isActive: boolean;
    lastLogin?: Date;
  };
  cacheHit?: boolean;
}

export interface IUserService {
  findUserWithEmail(user: Partial<EUsers>): Promise<EUsers | null>;
  updatePassword(
    id: string,
    password: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }>;
  editUserProfile(id: string, paylaod: any): Promise<EUsers | null>;
  updateOnlineStatus(
    userId: string,
    isOnline: boolean,
    role: "mentor" | "mentee" | null
  ): Promise<EUsers | null>;
  checkUserBlockStatus(
    userId: string,
    requestingUserId: string
  ): Promise<BlockStatusResponse>;
  checkUserRegistrationByEmail(email: string): Promise<boolean>;
}
