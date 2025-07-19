import bcrypt from "bcryptjs";
import { EUsers } from "../../entities/userEntity";
import { IUserAuthService } from "../interface/IUserAuthService";
import { IUserRepository } from "../../repositories/interface/IUserRepository";
import UserRepository from "../../repositories/implementations/UserRepository";
import OTPServices from "./OTPService";
import { IOTPService } from "../interface/IOTPService";
import UserModel from "../../models/userModel";
import {
  accessTokenForReset,
  decodeAndVerifyToken,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt";
import ApiResponse from "../../utils/apiResponse";
import { RedisTokenService } from "./RedisTokenService";

export default class UserAuthService implements IUserAuthService {
  private UserRepository: IUserRepository;
  private OTPService: IOTPService;
  private redisTokenService: RedisTokenService;

  constructor() {
    this.UserRepository = new UserRepository();
    this.OTPService = new OTPServices();
    this.redisTokenService = new RedisTokenService();
  }

  async createUser(email: string): Promise<{
    user: EUsers;
    accessToken: string;
    refreshToken: string | null;
  }> {
    try {
      console.log("🔐 Service - User creation attempt for email:", email);

      if (!email) {
        throw new Error("Email is required");
      }

      const userData = await this.OTPService.getUserData(email);
      console.log("user data at create user service", userData);

      const newUser = new UserModel({ ...userData });
      console.log("new usermodel at create user service", newUser);
      const createdUser = await this.UserRepository.createUser(newUser);
      console.log("created successfully service");

      if (createdUser) {
        const id = createdUser._id.toString();
        const role = createdUser.role;

        const accessToken = generateAccessToken({ id, role });
        const refreshToken = generateRefreshToken({ id, role });

        // ✅ CHANGED: Store refresh token in Redis instead of MongoDB
        await this.redisTokenService.saveRefreshToken(id, refreshToken, 2); // 2 minutes for testing
        console.log("🔑 Tokens generated and refresh token stored in Redis");

        return {
          user: createdUser,
          accessToken,
          refreshToken,
        };
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
      console.log("🔐 Service - User login attempt for email:", user.email);

      if (!user.email) {
        console.log("Service - Error: email is required");
        throw new ApiResponse(400, "Email is required");
      }

      const userFound = await this.UserRepository.findByEmail(user.email);
      console.log("Service - User found:", userFound ? "Yes" : "No");

      if (userFound?.isBlocked) {
        console.log("is blocked user", userFound.isBlocked);
        throw new ApiResponse(403, "Account is Blocked");
      }

      if (userFound && !userFound?.password) {
        console.log(
          "no password - please signin with google",
          userFound?.password
        );
        throw new ApiResponse(403, "Signin With Google Account");
      }

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

        const accessToken = generateAccessToken({ id, role: userFound.role });
        const refreshToken = generateRefreshToken({ id, role: userFound.role });

        // ✅ CHANGED: Store refresh token in Redis instead of MongoDB
        await this.redisTokenService.saveRefreshToken(id, refreshToken, 2); // 2 minutes for testing
        console.log(
          "🔑 User tokens generated and refresh token stored in Redis"
        );

        const userObject = userFound.toObject();
        const { password, ...userWithoutPassword } = userObject;

        return { accessToken, refreshToken, userFound: userWithoutPassword };
      }

      console.log("Service - Login failed");
      return null;
    } catch (error) {
      console.log("login Service - Login attempt error", error);
      if (error instanceof ApiResponse) {
        throw error;
      }
      throw new ApiResponse(500, "Internal Server Error");
    }
  }

  async googleSignIn(user: { email: string }): Promise<{
    user: EUsers;
    accessToken: string;
    refreshToken: string;
  } | null> {
    try {
      console.log("🔐 Service - Google sign in attempt for:", user.email);

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

      const userId =
        userData.id || (userData.toObject && userData.toObject().id);

      if (!userId) {
        throw new Error("User ID is not available");
      }

      const accessToken = generateAccessToken({
        id: userId,
        role: userData.role,
      });
      const refreshToken = generateRefreshToken({
        id: userId,
        role: userData.role,
      });

      // ✅ CHANGED: Store refresh token in Redis instead of MongoDB
      await this.redisTokenService.saveRefreshToken(userId, refreshToken, 2); // 2 minutes for testing
      console.log(
        "🔑 Google signin tokens generated and refresh token stored in Redis"
      );

      return {
        user: userData,
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
      console.log("🔐 Service - Google sign up attempt:", user);

      const userAfterSuccess = await this.UserRepository.googleSignUp(user);
      console.log("googlesign up service 2", userAfterSuccess);

      if (!userAfterSuccess) {
        return null;
      }

      const userId =
        userAfterSuccess.id ||
        (userAfterSuccess.toObject && userAfterSuccess.toObject().id);

      if (!userId) {
        throw new Error("User ID is not available");
      }

      const accessToken = generateAccessToken({
        id: userId,
        role: userAfterSuccess.role,
      });
      const refreshToken = generateRefreshToken({
        id: userId,
        role: userAfterSuccess.role,
      });

      // ✅ CHANGED: Store refresh token in Redis instead of MongoDB
      await this.redisTokenService.saveRefreshToken(userId, refreshToken, 2); // 2 minutes for testing
      console.log(
        "🔑 Google signup tokens generated and refresh token stored in Redis"
      );

      return {
        user: userAfterSuccess,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      console.error("Error during Google sign-up:", error);
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

  // ✅ NEW: Refresh access token using only userId (like admin service)
  async refreshAccessToken(userId: string): Promise<{
    newAccessToken: string;
    newRefreshToken: string;
  } | null> {
    try {
      console.log("🔄 Service - User refresh token attempt for user:", userId);

      // ✅ RETRIEVE refresh token from Redis
      const refreshToken = await this.redisTokenService.getRefreshToken(userId);
      if (!refreshToken) {
        console.log(
          "❌ Service - No refresh token found in Redis for user:",
          userId
        );
        return null;
      }

      // ✅ VERIFY the retrieved refresh token
      const isValidToken =
        await this.redisTokenService.verifyRefreshTokenDirect(
          userId,
          refreshToken
        );
      if (!isValidToken) {
        console.log("❌ Service - Invalid refresh token for user:", userId);
        return null;
      }

      const userFound = await this.UserRepository.findById(userId);
      if (userFound) {
        const id = userFound._id.toString();
        const role = userFound.role;

        const newAccessToken = generateAccessToken({ id, role });

        // ✅ ALWAYS generate new refresh token for proper token rotation
        const newRefreshToken = generateRefreshToken({ id, role });

        // ✅ Remove old refresh token and save new one in Redis
        await this.redisTokenService.removeRefreshToken(id);
        await this.redisTokenService.saveRefreshToken(id, newRefreshToken, 2); // 2 minutes

        console.log(
          "✅ Service - New user tokens generated with token rotation (Redis only)"
        );
        return { newAccessToken, newRefreshToken };
      }

      console.log("❌ Service - User not found");
      return null;
    } catch (error) {
      console.error("🚨 Service - User refresh token error:", error);
      throw new Error(`Failed to refresh token - ${error}`);
    }
  }

  async decodeAndVerifyToken(token: string): Promise<Partial<EUsers | null>> {
    try {
      console.log("decode service 1");
      const decode = decodeAndVerifyToken(token);
      console.log("decode service 2 success");
      return decode;
    } catch (error) {
      return null;
    }
  }

  generateTokenForForgotPassword(user: Partial<EUsers>): string {
    return accessTokenForReset(user);
  }

  // ✅ CHANGED: Only need userId (no token parameter)
  async logout(userId: string): Promise<boolean> {
    try {
      console.log("🚪 Service - User logout attempt for user:", userId);

      // ✅ SIMPLIFIED: Just remove from Redis (no token verification needed)
      const removed = await this.redisTokenService.removeRefreshToken(userId);
      console.log(
        "🗑️ Service - User refresh token removed from Redis:",
        removed
      );

      return removed;
    } catch (error) {
      console.error("🚨 Service - User logout error:", error);
      throw new Error(`Failed to logout - ${error}`);
    }
  }

  async resetPassword(email: string, password: string): Promise<EUsers | null> {
    try {
      console.log("reset password service 1 email", email);
      console.log("reset password service 1 password", password);

      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("reset password service 2", hashedPassword);

      const userData = await this.UserRepository.findByEmail(email);
      if (userData?.isBlocked) {
        throw new Error("Account is Blocked");
      }

      const user = await this.UserRepository.changePassword(
        email,
        hashedPassword
      );
      console.log("reset password service 3");
      console.log(user);
      console.log("reset password service 4, success");
      return user;
    } catch (error) {
      return null;
    }
  }
}
