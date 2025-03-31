import { EUsers } from "../../entities/userEntity";

export interface inUserAuthService {
  login(user: { email: string; password: string }): Promise<{
    userFound: Omit<EUsers, "password">;
    role: string;
  } | null>;

  createUser(email: Partial<EUsers>): Promise<{
    user: EUsers;
    accessToken: string;
    refreshToken: string | null;
  }>;

  refreshAccessToken(refreshToken: string): Promise<string | null>;
  generateTokenForForgotPassword(user: Partial<EUsers>): string;
  logout(token: string, id: string): Promise<EUsers | null>;
  googleSignUp(user: Partial<EUsers>): Promise<{
    user: EUsers;
    accessToken: string;
    refreshToken: string;
  } | null>;
  googleSignIn(user: { email: string }): Promise<{
    user: EUsers;
    accessToken: string;
    refreshToken: string;
  } | null>;
  decodeAndVerifyToken(token: string): Promise<Partial<EUsers | null>>;
  resetPassword(email: string, password: string): Promise<EUsers | null>;
}
