import { EUsers } from "../../entities/userEntity";

export interface IUserRepository {
  createUser(user: EUsers): Promise<EUsers | null>;
  // REMOVED: saveRefreshToken and removeRefreshToken methods - now handled by Redis
  findByEmail(email: string): Promise<EUsers | null>;
  googleSignUp(user: Partial<EUsers>): Promise<EUsers | null>;
  changePassword(email: string, password: string): Promise<EUsers | null>;
  findById(id: string): Promise<EUsers | null>;
  updateUser(data: {
    id: string;
    userType: string;
    experienceId: string;
    menteeId: string;
    role: string[];
  }): Promise<EUsers | null>;
  mentorUpdate(data: {
    id: string;
    userType: string;
    experienceId: string;
    mentorId: string;
    profilePicture: string;
    role: string[];
  }): Promise<EUsers | null>;
  getAllMentors(
    role?: string,
    page?: number,
    limit?: number,
    searchQuery?: string
  ): Promise<EUsers[]>;
  countMentors(role?: string, searchQuery?: string): Promise<number>;
  getMentorById(mentorId: string): Promise<EUsers>;
  updateOnlineStatus(
    userId: string,
    role: "mentor" | "mentee",
    isOnline: boolean
  ): Promise<void>;
  findUsersByNameOrEmail(searchQuery: string): Promise<any[]>;
  getTopMentors(limit: number): Promise<EUsers[]>;
}
