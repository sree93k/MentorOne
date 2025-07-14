// // src/services/interface/inAdminService.ts
// import { EMentee } from "../../entities/menteeEntiry";
// import { EUsers } from "../../entities/userEntity";
// import { EMentor } from "../../entities/mentorEntity";

// export interface IAdminService {
//   fetchAllUsers(
//     page: number,
//     limit: number,
//     role?: string,
//     status?: string
//   ): Promise<{
//     users: Omit<EUsers, "password">[];
//     total: number;
//   } | null>;

//   getUserDatas(id: string): Promise<{
//     user: EUsers;
//     menteeData: EMentee | null;
//     mentorData: EMentor | null;
//   } | null>;

//   mentorStatusChange(
//     id: string,
//     status: string,
//     reason: string
//   ): Promise<{
//     mentorData: EMentor | null;
//   } | null>;

//   userStatusChange(
//     id: string,
//     status: string
//   ): Promise<{ userData: EUsers | null } | null>;
// }
import { EUsers } from "../../entities/userEntity";
import { EMentee } from "../../entities/menteeEntiry";
import { EMentor } from "../../entities/mentorEntity";
import { EService } from "../../entities/serviceEntity";
import { EBooking } from "../../entities/bookingEntity";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface IAdminService {
  fetchAllUsers(
    page: number,
    limit: number,
    role?: string,
    status?: string
  ): Promise<{
    users: Omit<EUsers, "password">[];
    total: number;
    totalMentors: number;
    totalMentees: number;
    totalBoth: number;
    approvalPending: number;
  } | null>;

  getUserDatas(id: string): Promise<{
    user: EUsers;
    menteeData: EMentee | null;
    mentorData: EMentor | null;
    serviceData: EService[] | null;
    bookingData: EBooking[] | null;
  } | null>;

  mentorStatusChange(
    id: string,
    status: string,
    reason?: string
  ): Promise<{ mentorData: EMentor | null } | null>;

  userStatusChange(
    id: string,
    status: string
  ): Promise<{ userData: EUsers | null } | null>;
}
