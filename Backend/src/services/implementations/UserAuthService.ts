import bcrypt from "bcryptjs";
import { EUsers } from "../../entities/userEntity";
import { IUserAuthService } from "../interface/IUserAuthService";
import { IUserRepository } from "../../repositories/interface/IUserRepository";
import UserRepository from "../../repositories/implementations/UserRepository";
import OTPRepository from "../../repositories/implementations/OTPRepository";
import { IOTPRepository } from "../../repositories/interface/IOTPRepository";
import UserModel from "../../models/userModel";
import {
  accessTokenForReset,
  decodeAndVerifyToken,
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../../utils/jwt";
import ApiResponse from "../../utils/apiResponse";

export default class UserAuthService implements IUserAuthService {
  private UserRepository: IUserRepository;
  private OTPRepository: IOTPRepository;

  constructor() {
    this.UserRepository = new UserRepository();
    this.OTPRepository = new OTPRepository();
  }

  async createUser(email: Partial<EUsers>): Promise<{
    user: EUsers;
    accessToken: string;
    refreshToken: string | null;
  }> {
    try {
      console.log("im user auth servioce", email);

      const userData = await this.OTPRepository.userData(email);
      console.log("user data at cerate user service", userData);

      const newUser = new UserModel({ ...userData });
      console.log("new usermodel at cerate user service", newUser);
      const createdUser = await this.UserRepository.createUser(newUser);
      console.log("ctreated successfully service thaa");

      if (createdUser) {
        const accessToken = generateAccessToken({
          id: createdUser.id,
          role: createdUser.role,
        });
        const refreshToken = generateRefreshToken({
          id: createdUser.id,
          role: createdUser.role,
        });
        const userAfterSavedToken = await this.UserRepository.saveRefreshToken(
          createdUser.id,
          refreshToken
        );
        if (userAfterSavedToken) {
          return {
            user: userAfterSavedToken,
            accessToken,
            refreshToken,
          };
        }
      }

      throw new Error("Failed to create user");
    } catch (error) {
      console.log("error at UserAuthService", error);
      throw error;
    }
  }

  async login(user: { email: string; password: string }): Promise<{
    accessToken: string;
    refreshToken: string;
    userFound: Omit<EUsers, "password">;
  } | null> {
    try {
      console.log("Service - Login attempt for email:", user.email);

      // Check if email is provided
      if (!user.email) {
        console.log("Service - Error: email is required");
        throw new ApiResponse(400, "Email is required");
      }

      // Find user by email
      const userFound = await this.UserRepository.findByEmail(user.email);
      console.log("Service - User found:", userFound ? "Yes" : "No");

      // Check if user is blocked
      if (userFound?.isBlocked) {
        console.log("is blocked user", userFound.isBlocked);
        throw new ApiResponse(403, "Account is Blocked");
      }
      if (userFound && !userFound?.password) {
        console.log(
          "is have no passoword..please signin withh google",
          userFound?.password
        );
        throw new ApiResponse(403, "Signin With Google Account");
      }

      // Validate credentials
      if (
        userFound &&
        user.password &&
        userFound.password &&
        (await bcrypt.compare(user.password, userFound.password))
      ) {
        const id = userFound._id?.toString();
        if (!id) {
          throw new ApiResponse(500, "User ID is undefined");
        }
        const accessToken = generateAccessToken({
          id,
          role: userFound.role,
        });

        const refreshToken = generateRefreshToken({
          id,
          role: userFound.role,
        });

        await this.UserRepository.saveRefreshToken(id, refreshToken);

        const userObject = userFound.toObject();
        const { password, ...userWithoutPassword } = userObject;

        return { accessToken, refreshToken, userFound: userWithoutPassword };
      }

      console.log("Service - Login failed");
      return null;
    } catch (error) {
      console.log("login Service - Login attempt error", error);
      // Re-throw the error instead of returning it
      if (error instanceof ApiResponse) {
        throw error;
      }
      throw new ApiResponse(500, "Internal Server Error");
    }
  }

  //google auth
  async googleSignIn(user: { email: string }): Promise<{
    user: EUsers;
    accessToken: string;
    refreshToken: string;
  } | null> {
    try {
      console.log("googlesign in service 1", user.email);

      if (!user.email || typeof user.email !== "string") {
        console.error("Email is missing or invalid");
        throw new Error("Email is required for Google sign-in");
      }
      const userData = await this.UserRepository.findByEmail(user.email);
      console.log("googlesign in service 2", userData);
      if (!userData) {
        return null;
      }
      if (userData?.isBlocked) {
        throw new Error("Account is Blocked");
      }
      console.log("googlesign in service 3");
      const userId =
        userData.id || (userData.toObject && userData.toObject().id);
      console.log("googlesign in service 4");
      if (!userId) {
        throw new Error("User ID is not available");
      }
      console.log("googlesign in service 5");
      const accessToken = generateAccessToken({
        id: userId,
        role: userData.role,
      });
      console.log("access token", accessToken);

      const refreshToken = generateRefreshToken({
        id: userId,
        role: userData.role,
      });
      console.log("refresh token ", refreshToken);

      console.log("googlesign in service 6");

      console.log(userData);

      console.log("googlesign in service 7");
      const userAfterSavedToken = await this.UserRepository.saveRefreshToken(
        userId,
        refreshToken
      );
      console.log("googlesign in service 8");
      if (!userAfterSavedToken) {
        console.error("Failed to save refresh token");
        return null; // Return null if saving the token fails
      }
      console.log("googlesign in service 9");
      return {
        user: userAfterSavedToken,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      return null;
    }
  }

  async googleSignUp(user: Partial<EUsers>): Promise<{
    user: EUsers;
    accessToken: string;
    refreshToken: string;
  } | null> {
    try {
      console.log("googlesign in service 1", user);

      const userAfterSuccess = await this.UserRepository.googleSignUp(user);
      console.log("googlesign in service 2", userAfterSuccess);
      if (!userAfterSuccess) {
        return null;
      }
      console.log("googlesign in service 3");
      const userId =
        userAfterSuccess.id ||
        (userAfterSuccess.toObject && userAfterSuccess.toObject().id);
      console.log("googlesign in service 4");
      if (!userId) {
        throw new Error("User ID is not available");
      }
      console.log("googlesign in service 5");
      const accessToken = generateAccessToken({
        id: userId,
        role: userAfterSuccess.role,
      });
      console.log("access token", accessToken);

      const refreshToken = generateRefreshToken({
        id: userId,
        role: userAfterSuccess.role,
      });
      console.log("refresh token ", refreshToken);

      console.log("googlesign in service 6");
      console.log("====================================");
      console.log(userAfterSuccess);
      console.log("====================================");
      console.log("googlesign in service 7");
      const userAfterSavedToken = await this.UserRepository.saveRefreshToken(
        userId,
        refreshToken
      );
      console.log("googlesign in service 8");
      if (!userAfterSavedToken) {
        console.error("Failed to save refresh token");
        return null; // Return null if saving the token fails
      }
      console.log("googlesign in service 9");
      return {
        user: userAfterSavedToken,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      return null;
    }
  }

  async refreshAccessToken(refreshToken: string): Promise<string | null> {
    try {
      const payload = verifyRefreshToken(refreshToken);
      const newAccessToken = generateAccessToken({
        id: payload.id,
        role: payload.role,
      });

      return newAccessToken;
    } catch (error) {
      return null;
    }
  }

  async decodeAndVerifyToken(token: string): Promise<Partial<EUsers | null>> {
    try {
      console.log("decode service 1");

      const decode = decodeAndVerifyToken(token);
      console.log("decode service 2 sucesss");
      return decode;
    } catch (error) {
      return null;
    }
  }

  generateTokenForForgotPassword(user: Partial<EUsers>): string {
    return accessTokenForReset(user);
  }

  //logout
  async logout(token: string, id: string): Promise<EUsers | null> {
    console.log("service user logout step 1 ", token, id);

    const user = await this.UserRepository.removeRefreshToken(id, token);
    console.log("service user logout step 2 ", user);
    return user ? user : null;
  }

  async resetPassword(email: string, password: string): Promise<EUsers | null> {
    try {
      console.log("reset passowrd service 1 email", email);
      console.log("reset passowrd service 1 passowrd", password);
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("reset passowrd service 2", hashedPassword);
      const userData = await this.UserRepository.findByEmail(email);
      if (userData?.isBlocked) {
        throw new Error("Account is Blocked");
      }
      const user = await this.UserRepository.changePassword(
        email,
        hashedPassword
      );
      console.log("reset passowrd service 3");
      console.log(user);
      console.log("reset passowrd service 4, success");
      return user;
    } catch (error) {
      return null;
    }
  }
}
