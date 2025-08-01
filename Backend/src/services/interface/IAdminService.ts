// src/services/interface/inAdminService.ts
import { EMentee } from "../../entities/menteeEntiry";
import { EUsers } from "../../entities/userEntity";
import { EMentor } from "../../entities/mentorEntity";

export interface IAdminService {
  fetchAllUsers(
    page: number,
    limit: number,
    role?: string,
    status?: string
  ): Promise<{
    users: Omit<EUsers, "password">[];
    total: number;
  } | null>;

  getUserDatas(id: string): Promise<{
    user: EUsers;
    menteeData: EMentee | null;
    mentorData: EMentor | null;
  } | null>;

  mentorStatusChange(
    id: string,
    status: string,
    reason: string
  ): Promise<{
    mentorData: EMentor | null;
  } | null>;

  // userStatusChange(
  //   id: string,
  //   status: string
  // ): Promise<{ userData: EUsers | null } | null>;
  // userStatusChange(
  //   id: string,
  //   status: boolean,
  //   reason?: string
  // ): Promise<{ userData: EUsers | null } | null>;
  userStatusChange(
    id: string,
    status: boolean,
    blockData?: {
      reason?: string;
      category?: string;
      adminNote?: string;
      adminId?: string;
      adminIP?: string;
      timestamp?: string;
    }
  ): Promise<{ userData: EUsers | null } | null>;
}
