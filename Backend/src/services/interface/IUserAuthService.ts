// // import { EUsers } from "../../entities/userEntity";

import { EUsers } from "../../entities/userEntity";

export interface IUserAuthService {
  createUser(email: string): Promise<{
    user: EUsers;
    accessToken: string;
    refreshToken: string | null;
  }>;

  login(user: { email: string; password: string }): Promise<{
    accessToken: string;
    refreshToken: string;
    userFound: Omit<EUsers, "password">;
  } | null>;

  // ✅ CHANGED: Remove refreshToken parameter
  logout(userId: string): Promise<boolean>;

  // ✅ CHANGED: Remove refreshToken parameter
  refreshAccessToken(userId: string): Promise<{
    newAccessToken: string;
    newRefreshToken: string;
  } | null>;

  googleSignIn(user: { email: string }): Promise<{
    user: EUsers;
    accessToken: string;
    refreshToken: string;
  } | null>;

  googleSignUp(user: Partial<EUsers>): Promise<{
    user: EUsers;
    accessToken: string;
    refreshToken: string;
  } | null>;

  resetPassword(email: string, password: string): Promise<EUsers | null>;
}
