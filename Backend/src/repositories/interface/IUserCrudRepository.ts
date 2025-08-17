import { EUsers } from "../../entities/userEntity";

/**
 * 🔹 ISP COMPLIANCE: User CRUD Operations Interface
 * Responsible only for basic user creation, reading, updating operations
 */
export interface IUserCrudRepository {
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
}