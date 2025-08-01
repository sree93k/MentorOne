import { EUsers } from "../../entities/userEntity";

export interface IUserRepository {
  // User Creation and Authentication
  createUser(user: Partial<EUsers>): Promise<EUsers | null>;
  googleSignUp(user: Partial<EUsers>): Promise<EUsers | null>;

  // User Lookup Methods
  findByEmail(email: string): Promise<EUsers | null>;
  findById(id: string): Promise<EUsers | null>;
  findByField<K extends keyof EUsers>(
    field: K,
    value: string
  ): Promise<EUsers[] | null>;
  findUsersByNameOrEmail(searchQuery: string): Promise<any[]>;

  // User Update Methods
  changePassword(email: string, password: string): Promise<EUsers | null>;
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

  update(id: string, data: Partial<EUsers>): Promise<EUsers | null>;
  updateField(
    id: string,
    field: keyof EUsers,
    value: any
  ): Promise<EUsers | null>;

  // Mentor-specific Methods
  getAllMentors(
    role?: string,
    page?: number,
    limit?: number,
    searchQuery?: string
  ): Promise<EUsers[]>;

  countMentors(role?: string, searchQuery?: string): Promise<number>;
  getMentorById(mentorId: string): Promise<EUsers>;
  getTopMentors(limit: number): Promise<EUsers[]>;

  // Status Management
  updateOnlineStatus(
    userId: string,
    role: "mentor" | "mentee",
    isOnline: boolean
  ): Promise<void>;

  // User Statistics and Pagination
  countAllUsers(query?: any): Promise<number>;
  countUsersByRole(role: string): Promise<number>;
  getAllUsersWithPagination(
    query?: any,
    page?: number,
    limit?: number
  ): Promise<EUsers[]>;
}
