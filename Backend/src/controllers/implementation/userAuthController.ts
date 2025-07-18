import { NextFunction, Request, Response } from "express";
import { ApiError } from "../../middlewares/errorHandler";
import ApiResponse from "../../utils/apiResponse";
import UserAuthService from "../../services/implementations/UserAuthService";
import { IUserAuthService } from "../../services/interface/IUserAuthService";
import OTPServices from "../../services/implementations/OTPService";
import { IOTPService } from "../../services/interface/IOTPService";
import { IUserService } from "../../services/interface/IUserService";
import UserService from "../../services/implementations/UserService";
import { EOTP } from "../../entities/OTPEntity";
import { IUploadService } from "../../services/interface/IUploadService";
import UploadService from "../../services/implementations/UploadService";
import { HttpStatus } from "../../constants/HttpStatus";
import axios from "axios";
import sharp from "sharp";
import cookieConfig from "../../config/cookieConifg";

class UserAuthController {
  private userAuthService: IUserAuthService;
  private OTPServices: IOTPService;
  private userService: IUserService;
  private uploadService: IUploadService;

  public options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const, // Changed from "strict" to "lax" for better compatibility
    path: "/",
    maxAge: 5 * 60 * 1000, // 5 minutes (longer than JWT 30s expiry)
  };

  constructor() {
    this.userAuthService = new UserAuthService();
    this.OTPServices = new OTPServices();
    this.userService = new UserService();
    this.uploadService = new UploadService();
  }

  public sendOTP = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("sendOTP controller/......", req.body);
      console.log("Controller - OTP sent step 1:");
      const user = req.body;
      console.log("Controller - sendOTP request received:", user);
      if (!user) {
        throw new ApiError(HttpStatus.BAD_REQUEST, "User is required");
      }
      console.log("Controller - OTP sent step 2");
      const otpExists = await this.OTPServices.checkOTPExists(user);
      console.log("otp exists >>>", otpExists);
      console.log("Controller - OTP sent step 3");
      if (otpExists) {
        throw new ApiError(
          HttpStatus.BAD_REQUEST,
          "Please wait 60 seconds before requesting another OTP"
        );
      }
      console.log("Controller - OTP sent step 4");
      const isUserExists = await this.userService.findUserWithEmail(user);
      if (isUserExists) {
        throw new ApiError(
          HttpStatus.BAD_REQUEST,
          "A user with this email already exists"
        );
      }
      console.log("Controller - OTP sent step 5");
      const createOTP = await this.OTPServices.sendOTP(user);
      console.log("Controller - OTP sent successfully:", createOTP);
      console.log("Controller - OTP sent step 6");
      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            { email: user.email },
            "OTP sent successfully"
          )
        );
    } catch (error) {
      console.error("Controller - sendOTP error:", error);
      next(error);
    }
  };

  public createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email, otp } = req.body;
      console.log("OTP verification start at controller for email:", email);
      if (!email || !otp) {
        throw new ApiError(
          HttpStatus.BAD_REQUEST,
          "Email and OTP are required"
        );
      }
      const otpData: Partial<EOTP> = {
        email: email,
        otp: otp,
        expirationTime: new Date(),
        createdDate: new Date(),
        attempts: 1,
      };

      const OTPVerification = await this.OTPServices.verifyEmailOTP(
        otpData as EOTP,
        email
      );

      if (!OTPVerification) {
        throw new ApiError(
          HttpStatus.BAD_REQUEST,
          "The OTP you entered is invalid or has expired"
        );
      }

      console.log("Controller - signup request received:", req.body);
      const signUpData = await this.userAuthService.createUser(email);
      console.log("Controller - signup service response:", signUpData);

      if (!signUpData) {
        throw new ApiError(HttpStatus.BAD_REQUEST, "Failed to create user");
      }

      // ✅ CHANGED: Only set access token cookie (longer than JWT expiry)
      // res.cookie("accessToken", signUpData.accessToken, this.options);

      // console.log("Controller - Signup successful");
      // res.status(HttpStatus.CREATED).json(
      //   new ApiResponse(
      //     HttpStatus.CREATED,
      //     {
      //       user: signUpData.user,
      //       // ✅ REMOVED: Don't send tokens in response body
      //     },
      //     "User created successfully"
      //   )
      // );
      res.cookie("accessToken", signUpData.accessToken, {
        ...this.options,
        httpOnly: true,
      });

      res.cookie("isAuthenticated", "true", {
        ...this.options,
        httpOnly: false,
      });

      res.status(HttpStatus.CREATED).json(
        new ApiResponse(
          HttpStatus.CREATED,
          {
            user: signUpData.user,
            isAuthenticated: true,
          },
          "User created successfully"
        )
      );
    } catch (error) {
      console.error("Controller - Error during signup:", error);
      next(error);
    }
  };

  public login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("🔐 === USER LOGIN ATTEMPT DEBUG ===");
      console.log("🔐 Request body:", req.body);
      console.log("🔐 Request headers:", req.headers);
      console.log("🔐 Existing cookies:", req.cookies);

      console.log("Controller - Login request received:", req.body);
      const loginData = await this.userAuthService.login(req.body);
      console.log("Controller - Login service response:", loginData);

      if (!loginData) {
        throw new ApiError(HttpStatus.BAD_REQUEST, "Invalid email or password");
      }

      console.log("🔐 Login successful, setting cookies");
      console.log("🔐 Access token length:", loginData.accessToken.length);
      console.log("🔐 User found:", loginData.userFound._id);

      // ✅ CHANGED: Only set access token cookie (longer than JWT expiry)
      // res.cookie("accessToken", loginData.accessToken, this.options);
      res.cookie("accessToken", loginData.accessToken, {
        ...this.options,
        httpOnly: true, // Keep secure
      });

      // 2. Readable authentication indicator (no sensitive data)
      res.cookie("isAuthenticated", "true", {
        ...this.options,
        httpOnly: false, // Can be read by JavaScript
        maxAge: this.options.maxAge, // Same expiry as access token
      });

      // ✅ REMOVED: No refresh token cookie - it's stored in Redis only

      console.log("🔐 Cookies set with options:");
      console.log("🔐 - httpOnly: true");
      console.log("🔐 - secure:", process.env.NODE_ENV === "production");
      console.log("🔐 - sameSite: lax");
      console.log("🔐 - ONLY ACCESS TOKEN in cookie");

      console.log("Controller - Login successful");
      // res.status(HttpStatus.OK).json(
      //   new ApiResponse(
      //     HttpStatus.OK,
      //     {
      //       userFound: loginData.userFound,
      //       // ✅ REMOVED: Don't send tokens in response body
      //       userId: loginData.userFound._id, // Include user ID for frontend tracking
      //     },
      //     "Login successful"
      //   )
      // );
      res.status(HttpStatus.OK).json(
        new ApiResponse(
          HttpStatus.OK,
          {
            userFound: loginData.userFound,
            userId: loginData.userFound._id,
            isAuthenticated: true, // Include in response
          },
          "Login successful"
        )
      );
    } catch (error) {
      console.error("Error in login:", error);
      next(error);
    }
  };

  public googleAuthentication = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("🔐 === GOOGLE AUTH ATTEMPT DEBUG ===");
      console.log("auth step 1");
      const { firstName, lastName, email, profilePicture } = req.body;

      if (!email || !firstName || !lastName || !profilePicture) {
        throw new ApiError(
          HttpStatus.BAD_REQUEST,
          "Missing required fields: firstName, lastName, email, profilePicture"
        );
      }

      console.log("auth step 2", profilePicture);
      const userExists = await this.userAuthService.googleSignIn({ email });
      console.log("auth step 3", userExists);

      if (userExists) {
        console.log("UserAuthController googleAuthentication step 2", {
          userExists,
        });

        // ✅ CHANGED: Only set access token cookie
        // res.cookie("accessToken", userExists.accessToken, this.options);

        // res.status(HttpStatus.OK).json(
        //   new ApiResponse(
        //     HttpStatus.OK,
        //     {
        //       user: userExists.user,
        //       // ✅ REMOVED: Don't send tokens in response body
        //       userId: userExists.user._id,
        //     },
        //     "Google authentication successful"
        //   )
        // );
        // return;
        res.cookie("accessToken", userExists.accessToken, {
          ...this.options,
          httpOnly: true,
        });

        res.cookie("isAuthenticated", "true", {
          ...this.options,
          httpOnly: false,
        });

        res.status(HttpStatus.OK).json(
          new ApiResponse(
            HttpStatus.OK,
            {
              user: userExists.user,
              userId: userExists.user._id,
              isAuthenticated: true,
            },
            "Google authentication successful"
          )
        );
        return;
      }

      const response = await axios.get(profilePicture, {
        responseType: "arraybuffer",
      });
      console.log("auth step 5");
      const imageBuffer = Buffer.from(response.data, "binary");
      console.log("auth step 6", imageBuffer);

      const resizedImageBuffer = await sharp(imageBuffer)
        .resize({ width: 1024 })
        .jpeg({ quality: 80 })
        .toBuffer();
      console.log("auth step 7", resizedImageBuffer);

      const fromGoogleImage = await this.uploadService.uploadProfileImage({
        buffer: resizedImageBuffer,
        mimetype: "image/jpeg",
        originalname: `${firstName}_${lastName}_google_profile.jpg`,
      } as Express.Multer.File);
      console.log("auth step 8", fromGoogleImage);

      const userAfterAuth = await this.userAuthService.googleSignUp({
        firstName: firstName,
        lastName: lastName,
        email: email,
        profilePicture: fromGoogleImage.url,
      });
      console.log("auth step 9");
      console.log("========");
      console.log(userAfterAuth);
      console.log("========");

      if (!userAfterAuth) {
        throw new ApiError(
          HttpStatus.BAD_REQUEST,
          "Failed to create user with Google authentication"
        );
      }

      console.log("UserAuthController googleAuthentication step 4", {
        userAfterAuth,
      });

      // ✅ CHANGED: Only set access token cookie
      // res.cookie("accessToken", userAfterAuth.accessToken, this.options);

      // res.status(HttpStatus.OK).json(
      //   new ApiResponse(
      //     HttpStatus.OK,
      //     {
      //       user: userAfterAuth.user,
      //       // ✅ REMOVED: Don't send tokens in response body
      //       userId: userAfterAuth.user._id,
      //     },
      //     "Google authentication successful"
      //   )
      // );
      res.cookie("accessToken", userAfterAuth.accessToken, {
        ...this.options,
        httpOnly: true,
      });

      res.cookie("isAuthenticated", "true", {
        ...this.options,
        httpOnly: false,
      });

      res.status(HttpStatus.OK).json(
        new ApiResponse(
          HttpStatus.OK,
          {
            user: userAfterAuth.user,
            userId: userAfterAuth.user._id,
            isAuthenticated: true,
          },
          "Google authentication successful"
        )
      );
    } catch (error) {
      next(error);
    }
  };

  public forgotPasswordOTP = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("forgot password otp auth controller 1");
      if (!req.body) {
        throw new ApiError(HttpStatus.BAD_REQUEST, "Data is required");
      }
      const isUserExists = await this.userService.findUserWithEmail(req.body);

      console.log("forgot password otp auth controller 2", isUserExists);
      if (!isUserExists || isUserExists.isBlocked) {
        throw new ApiError(
          HttpStatus.BAD_REQUEST,
          isUserExists?.isBlocked
            ? "Account is blocked"
            : "Account does not exist"
        );
      }

      console.log("forgot password otp auth controller 4");
      const otpExists = await this.OTPServices.checkOTPExists(req.body);
      console.log("forgot password otp auth controller 5");
      if (otpExists) {
        throw new ApiError(
          HttpStatus.BAD_REQUEST,
          "Please wait 60 seconds before requesting another OTP"
        );
      }

      await this.OTPServices.sendOTP(req.body);
      console.log("forgot password otp auth controller 2");
      res
        .status(HttpStatus.OK)
        .json(new ApiResponse(HttpStatus.OK, null, "OTP sent successfully"));
    } catch (error) {
      console.error("Error in forgotPasswordOTP:", error);
      next(error);
    }
  };

  public verifyOTP = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("verify otp usercontroller step 1 ", req.body);

      const { otp, email } = req.body;
      if (!email || !otp) {
        throw new ApiError(
          HttpStatus.BAD_REQUEST,
          "Email and OTP are required"
        );
      }
      const otpData: Partial<EOTP> = {
        email: email,
        otp: otp,
        expirationTime: new Date(),
        createdDate: new Date(),
        attempts: 1,
      };

      const verifyEmailData = await this.OTPServices.verifyEmailOTP(
        otpData as EOTP,
        email
      );
      console.log("verify otp usercontroller step 2:", verifyEmailData);
      if (!verifyEmailData) {
        throw new ApiError(
          HttpStatus.BAD_REQUEST,
          "The OTP you entered is invalid or has expired"
        );
      }
      console.log("Controller - verifyEmail successful");
      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            verifyEmailData,
            "OTP verified successfully"
          )
        );
    } catch (error) {
      next(error);
    }
  };

  public resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("auth controller reset password 1");

      const { password, email } = req.body;
      if (!email || !password) {
        throw new ApiError(
          HttpStatus.BAD_REQUEST,
          "Email and password are required"
        );
      }

      console.log(
        "auth controller reset password 10 email and password",
        email,
        password
      );
      const passwordUpdated = await this.userAuthService.resetPassword(
        email,
        password
      );
      console.log(
        "auth controller reset password 11,passwordSeset",
        passwordUpdated
      );
      if (!passwordUpdated) {
        throw new ApiError(
          HttpStatus.INTERNAL_SERVER_ERROR,
          "Failed to reset password"
        );
      }

      console.log("auth controller reset password 12 not updates password ");
      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(HttpStatus.OK, null, "Password reset successful")
        );
    } catch (error) {
      console.log("auth controller reset password catch error  ");
      next(error);
    }
  };

  public logout = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("🚪 === USER LOGOUT ATTEMPT DEBUG ===");
      console.log("🚪 Request cookies:", req.cookies);

      console.log("user logout step 1 - req.user:", req.user);

      if (!req.user?.id) {
        throw new ApiError(HttpStatus.UNAUTHORIZED, "User not authenticated");
      }

      const { id } = req.user;
      console.log("user logout step 2 - id:", id);

      // ✅ CHANGED: Only need userId for logout (refresh token retrieved from Redis)
      const logoutData = await this.userAuthService.logout(id);
      console.log("user logout step 3 - logoutData:", logoutData);

      await this.userService.updateOnlineStatus(id, false, null);
      console.log("UserAuthController logout step 2", { logoutData });

      // // ✅ CHANGED: Only clear access token cookie
      // res.clearCookie("accessToken", {
      //   httpOnly: true,
      //   secure: process.env.NODE_ENV === "production",
      //   sameSite: "lax",
      //   path: "/",
      // });
      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });

      res.clearCookie("isAuthenticated", {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
      console.log("🚪 Logout successful, access token cookie cleared");
      // res
      //   .status(HttpStatus.OK)
      //   .json(new ApiResponse(HttpStatus.OK, null, "Logout successful"));
      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            { isAuthenticated: false },
            "Logout successful"
          )
        );
    } catch (error) {
      console.error("Error in logout:", error);
      next(error);
    }
  };

  // ✅ NEW: Add refresh token endpoint
  public refreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("🔄 === USER REFRESH TOKEN ATTEMPT DEBUG ===");
      console.log("🔄 Request cookies:", req.cookies);
      console.log("🔄 Request headers:", req.headers);

      const userId = req.user?.id;

      console.log("🔄 Refresh token endpoint called");
      console.log("🔄 User ID:", userId);

      if (!userId) {
        console.log("❌ Missing userId");
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json(
            new ApiResponse(HttpStatus.UNAUTHORIZED, null, "Missing user ID")
          );
        return;
      }

      // ✅ CHANGED: Only need userId (refresh token retrieved from Redis)
      const result = await this.userAuthService.refreshAccessToken(userId);

      //     if (result) {
      //       console.log("✅ User token refresh successful");

      //       // ✅ ONLY SET NEW ACCESS TOKEN COOKIE
      //       res.cookie("accessToken", result.newAccessToken, this.options);

      //       console.log(
      //         "🔄 Response Set-Cookie headers:",
      //         res.getHeaders()["set-cookie"]
      //       );

      //       res.status(HttpStatus.OK).json(
      //         new ApiResponse(
      //           HttpStatus.OK,
      //           {
      //             newAccessTokenSet: true,
      //             refreshTokenInRedis: true,
      //           },
      //           "Token refreshed successfully"
      //         )
      //       );
      //     } else {
      //       console.log("❌ User token refresh failed - invalid refresh token");
      //       res
      //         .status(HttpStatus.UNAUTHORIZED)
      //         .json(
      //           new ApiResponse(
      //             HttpStatus.UNAUTHORIZED,
      //             null,
      //             "Invalid refresh token"
      //           )
      //         );
      //     }
      //   } catch (error) {
      //     console.error("🚨 User refresh token error:", error);
      //     res
      //       .status(HttpStatus.INTERNAL_SERVER_ERROR)
      //       .json(
      //         new ApiResponse(
      //           HttpStatus.INTERNAL_SERVER_ERROR,
      //           null,
      //           "Token refresh failed"
      //         )
      //       );
      //   }
      // };
      if (result) {
        // ✅ UPDATE BOTH COOKIES
        res.cookie("accessToken", result.newAccessToken, {
          ...this.options,
          httpOnly: true,
        });

        res.cookie("isAuthenticated", "true", {
          ...this.options,
          httpOnly: false,
        });

        res.status(HttpStatus.OK).json(
          new ApiResponse(
            HttpStatus.OK,
            {
              newAccessTokenSet: true,
              refreshTokenInRedis: true,
              isAuthenticated: true,
            },
            "Token refreshed successfully"
          )
        );
      } else {
        // ✅ CLEAR BOTH COOKIES ON FAILURE
        res.clearCookie("accessToken");
        res.clearCookie("isAuthenticated");

        res
          .status(HttpStatus.UNAUTHORIZED)
          .json(
            new ApiResponse(
              HttpStatus.UNAUTHORIZED,
              { isAuthenticated: false },
              "Invalid refresh token"
            )
          );
      }
    } catch (error) {
      console.error("🚨 User refresh token error:", error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(
          new ApiResponse(
            HttpStatus.INTERNAL_SERVER_ERROR,
            { isAuthenticated: false },
            "Token refresh failed"
          )
        );
    }
  };
}

export default new UserAuthController();
