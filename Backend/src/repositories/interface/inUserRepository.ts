import { EUsers } from "../../entities/userEntity";

export interface inUserRepository {
  createUser(user: EUsers): Promise<EUsers | null>;
  saveRefreshToken(
    userID: string,
    refreshToken: string
  ): Promise<EUsers | null>;
  removeRefreshToken(
    userId: string,
    refreshToken: string
  ): Promise<EUsers | null>;
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
    imageUrl: string;
    role: string[];
  }): Promise<EUsers | null>;
  getAllMentors(serviceType?: string): Promise<EUsers[]>;
  getMentorById(mentorId: string): Promise<EUsers>;
}
