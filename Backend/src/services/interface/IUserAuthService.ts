// import { EUsers } from "../../entities/userEntity";

// export interface IUserAuthService {
//   login(user: { email: string; password: string }): Promise<{
//     accessToken: string;
//     refreshToken: string;
//     userFound: Omit<EUsers, "password">;
//   } | null>;

//   createUser(email: Partial<EUsers>): Promise<{
//     user: EUsers;
//     accessToken: string;
//     refreshToken: string | null;
//   }>;

//   refreshAccessToken(refreshToken: string): Promise<string | null>;
//   generateTokenForForgotPassword(user: Partial<EUsers>): string;
//   logout(token: string, id: string): Promise<EUsers | null>;
//   googleSignUp(user: Partial<EUsers>): Promise<{
//     user: EUsers;
//     accessToken: string;
//     refreshToken: string;
//   } | null>;

//   googleSignIn(user: { email: string }): Promise<{
//     user: EUsers;
//     accessToken: string;
//     refreshToken: string;
//   } | null>;
//   decodeAndVerifyToken(token: string): Promise<Partial<EUsers | null>>;
//   resetPassword(email: string, password: string): Promise<EUsers | null>;
// }
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

  refreshAccessToken(refreshToken: string): Promise<string | null>;

  decodeAndVerifyToken(token: string): Promise<Partial<EUsers | null>>;

  generateTokenForForgotPassword(user: Partial<EUsers>): string;

  logout(token: string, id: string): Promise<EUsers | null>;

  resetPassword(email: string, password: string): Promise<EUsers | null>;
}
