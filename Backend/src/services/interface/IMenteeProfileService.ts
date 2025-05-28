// import { EUsers } from "../../entities/userEntity";

// export interface IMenteeProfileService {
//   welcomeData(formData: object, id: string): Promise<EUsers | null>;
//   // editUserProfile(id: string, payload: any): Promise<EUsers | null>;
//   deleteAccount(id: string): Promise<boolean>;
//   userProfielData(
//     id: string
//   ): Promise<{ user: Omit<EUsers, "password">[] } | null>;
//   getAllMentors(): Promise<EUsers[]>;
//   getMentorById(mentorId: string): Promise<EUsers>;
// }

import { EUsers } from "../../entities/userEntity";

export interface IMenteeProfileService {
  welcomeData(formData: object, id: string): Promise<EUsers | null>;
  deleteAccount(id: string): Promise<boolean>;
  userProfielData(
    id: string
  ): Promise<{ user: Omit<EUsers, "password">[] } | null>;
  getAllMentors(
    page?: number,
    limit?: number,
    role?: string,
    searchQuery?: string
  ): Promise<{ mentors: EUsers[]; total: number }>;
  getMentorById(mentorId: string): Promise<EUsers>;
}
