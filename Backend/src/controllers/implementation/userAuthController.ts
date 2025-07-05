// import { NextFunction, Request, Response } from "express";
// import { ApiError } from "../../middlewares/errorHandler";
// import ApiResponse from "../../utils/apiResponse";
// import UserAuthService from "../../services/implementations/UserAuthService";
// import { IUserAuthService } from "../../services/interface/IUserAuthService";
// import OTPServices from "../../services/implementations/OTPService";
// import { IOTPService } from "../../services/interface/IOTPService";
// import { IUserService } from "../../services/interface/IUserService";
// import UserService from "../../services/implementations/UserService";
// import { EOTP } from "../../entities/OTPEntity";
// import { IUploadService } from "../../services/interface/IUploadService";
// import UploadService from "../../services/implementations/UploadService";
// import { HttpStatus } from "../../constants/HttpStatus";
// import axios from "axios";
// import sharp from "sharp";
// import cookieConfig from "../../config/cookieConifg";

// class UserAuthController {
//   private userAuthService: IUserAuthService;
//   private OTPServices: IOTPService;
//   private userService: IUserService;
//   private uploadService: IUploadService;

//   public options = {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "strict" as const,
//     path: "/",
//     maxAge: 7 * 24 * 60 * 60 * 1000,
//   };

//   constructor() {
//     this.userAuthService = new UserAuthService();
//     this.OTPServices = new OTPServices();
//     this.userService = new UserService();
//     this.uploadService = new UploadService();
//   }

//   public sendOTP = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       console.log("sendOTP controller/......", req.body);

//       const user = req.body;
//       console.log("Controller - sendOTP request received:", user);
//       if (!user) {
//         throw new ApiError(HttpStatus.BAD_REQUEST, "User is required");
//       }

//       const otpExists = await this.OTPServices.checkOTPExists(user);
//       console.log("otp exists >>>", otpExists);

//       if (otpExists) {
//         throw new ApiError(
//           HttpStatus.BAD_REQUEST,
//           "Please wait 60 seconds before requesting another OTP"
//         );
//       }

//       const isUserExists = await this.userService.findUserWithEmail(user);
//       if (isUserExists) {
//         throw new ApiError(
//           HttpStatus.BAD_REQUEST,
//           "A user with this email already exists"
//         );
//       }

//       const createOTP = await this.OTPServices.sendOTP(user);
//       console.log("Controller - OTP sent successfully:", createOTP);

//       res
//         .status(HttpStatus.OK)
//         .json(
//           new ApiResponse(
//             HttpStatus.OK,
//             { email: user.email },
//             "OTP sent successfully"
//           )
//         );
//     } catch (error) {
//       console.error("Controller - sendOTP error:", error);
//       next(error);
//     }
//   };

//   //create user
//   public createUser = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       const { email, otp } = req.body;
//       console.log("OTP verification start at controller for email:", email);
//       if (!email || !otp) {
//         throw new ApiError(
//           HttpStatus.BAD_REQUEST,
//           "Email and OTP are required"
//         );
//       }
//       const otpData: Partial<EOTP> = {
//         email: email,
//         otp: otp,
//         expirationTime: new Date(),
//         createdDate: new Date(),
//         attempts: 1,
//       };

//       const OTPVerification = await this.OTPServices.verifyEmailOTP(
//         otpData as EOTP,
//         email
//       );

//       if (!OTPVerification) {
//         throw new ApiError(
//           HttpStatus.BAD_REQUEST,
//           "The OTP you entered is invalid or has expired"
//         );
//       }

//       console.log("Controller - signup request received:", req.body);
//       const signUpData = await this.userAuthService.createUser(email);
//       console.log("Controller - signup service response:", signUpData);

//       if (!signUpData) {
//         throw new ApiError(HttpStatus.BAD_REQUEST, "Failed to create user");
//       }

//       console.log("Controller - Signup successful");
//       res
//         .status(HttpStatus.CREATED)
//         .json(
//           new ApiResponse(
//             HttpStatus.CREATED,
//             signUpData,
//             "User created successfully"
//           )
//         );
//     } catch (error) {
//       console.error("Controller - Error during signup:", error);
//       next(error);
//     }
//   };

//   public login = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       console.log("Controller - Login request received:", req.body);
//       const loginData = await this.userAuthService.login(req.body);
//       console.log("Controller - Login service response:", loginData);
//       if (!loginData) {
//         throw new ApiError(HttpStatus.BAD_REQUEST, "Invalid email or password");
//       }
//       console.log("Controller - Login successful");

//       res
//         .status(HttpStatus.OK)
//         .cookie("refreshToken", loginData.refreshToken, cookieConfig)
//         .json(new ApiResponse(HttpStatus.OK, loginData, "Login successful"));
//     } catch (error) {
//       console.error("Error in login:", error);
//       next(error);
//     }
//   };

//   public googleAuthentication = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       console.log("auth step 1");
//       const { firstName, lastName, email, profilePicture } = req.body;

//       if (!email || !firstName || !lastName || !profilePicture) {
//         throw new ApiError(
//           HttpStatus.BAD_REQUEST,
//           "Missing required fields: firstName, lastName, email, profilePicture"
//         );
//       }

//       console.log("auth step 2", profilePicture);
//       const userExists = await this.userAuthService.googleSignIn({ email });
//       console.log("auth step 3", userExists);
//       if (userExists) {
//         console.log("UserAuthController googleAuthentication step 2", {
//           userExists,
//         });

//         res
//           .status(HttpStatus.OK)
//           .cookie("refreshToken", userExists.refreshToken, cookieConfig)
//           .json(
//             new ApiResponse(
//               HttpStatus.OK,
//               userExists,
//               "Google authentication successful"
//             )
//           );
//         return;
//       }
//       const response = await axios.get(profilePicture, {
//         responseType: "arraybuffer",
//       });
//       console.log("auth step 5");
//       const imageBuffer = Buffer.from(response.data, "binary");
//       console.log("auth step 6", imageBuffer);

//       const resizedImageBuffer = await sharp(imageBuffer)
//         .resize({ width: 1024 }) // Resize to max 1024px width
//         .jpeg({ quality: 80 }) // Optimize for smaller file size
//         .toBuffer();
//       console.log("auth step 7", resizedImageBuffer);

//       const fromGoogleImage = await this.uploadService.uploadProfileImage({
//         buffer: resizedImageBuffer,
//         mimetype: "image/jpeg",
//         originalname: `${firstName}_${lastName}_google_profile.jpg`,
//       } as Express.Multer.File);
//       console.log("auth step 8", fromGoogleImage);

//       const userAfterAuth = await this.userAuthService.googleSignUp({
//         firstName: firstName,
//         lastName: lastName,
//         email: email,
//         profilePicture: fromGoogleImage.url,
//       });
//       console.log("auth step 9");
//       console.log("========");
//       console.log(userAfterAuth);
//       console.log("========");

//       // Check if userAfterAuth is null
//       if (!userAfterAuth) {
//         throw new ApiError(
//           HttpStatus.BAD_REQUEST,
//           "Failed to create user with Google authentication"
//         );
//       }

//       console.log("UserAuthController googleAuthentication step 4", {
//         userAfterAuth,
//       });

//       res
//         .status(HttpStatus.OK)
//         .cookie("refreshToken", userAfterAuth.refreshToken, cookieConfig)
//         .json(
//           new ApiResponse(
//             HttpStatus.OK,
//             userAfterAuth,
//             "Google authentication successful"
//           )
//         );
//     } catch (error) {
//       next(error);
//     }
//   };

//   //forgot passworrd otp sedning
//   public forgotPasswordOTP = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     // Explicitly declare return type as Promise<void>
//     try {
//       console.log("forgot password otp auth controller 1");
//       if (!req.body) {
//         throw new ApiError(HttpStatus.BAD_REQUEST, "Data is required");
//       }
//       const isUserExists = await this.userService.findUserWithEmail(req.body);

//       console.log("forgot password otp auth controller 2", isUserExists);
//       if (!isUserExists || isUserExists.isBlocked) {
//         throw new ApiError(
//           HttpStatus.BAD_REQUEST,
//           isUserExists?.isBlocked
//             ? "Account is blocked"
//             : "Account does not exist"
//         );
//       }

//       console.log("forgot password otp auth controller 4");
//       const otpExists = await this.OTPServices.checkOTPExists(req.body);
//       console.log("forgot password otp auth controller 5");
//       if (otpExists) {
//         throw new ApiError(
//           HttpStatus.BAD_REQUEST,
//           "Please wait 60 seconds before requesting another OTP"
//         );
//       }

//       await this.OTPServices.sendOTP(req.body);
//       console.log("forgot password otp auth controller 2");
//       res
//         .status(HttpStatus.OK)
//         .json(new ApiResponse(HttpStatus.OK, null, "OTP sent successfully"));
//     } catch (error) {
//       console.error("Error in forgotPasswordOTP:", error);
//       next(error);
//     }
//   };

//   public verifyOTP = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       console.log("verify otp usercontroller step 1 ", req.body);

//       const { otp, email } = req.body;
//       if (!email || !otp) {
//         throw new ApiError(
//           HttpStatus.BAD_REQUEST,
//           "Email and OTP are required"
//         );
//       }
//       const otpData: Partial<EOTP> = {
//         email: email,
//         otp: otp,
//         expirationTime: new Date(),
//         createdDate: new Date(),
//         attempts: 1,
//       };

//       const verifyEmailData = await this.OTPServices.verifyEmailOTP(
//         otpData as EOTP,
//         email
//       );
//       console.log("verify otp usercontroller step 2:", verifyEmailData);
//       if (!verifyEmailData) {
//         throw new ApiError(
//           HttpStatus.BAD_REQUEST,
//           "The OTP you entered is invalid or has expired"
//         );
//       }
//       console.log("Controller - verifyEmail successful");
//       res
//         .status(HttpStatus.OK)
//         .json(
//           new ApiResponse(
//             HttpStatus.OK,
//             verifyEmailData,
//             "OTP verified successfully"
//           )
//         );
//     } catch (error) {
//       next(error);
//     }
//   };

//   public resetPassword = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       console.log("auth controller reset password 1");

//       const { password, email } = req.body;
//       if (!email || !password) {
//         throw new ApiError(
//           HttpStatus.BAD_REQUEST,
//           "Email and password are required"
//         );
//       }

//       console.log(
//         "auth controller reset password 10 email and password",
//         email,
//         password
//       );
//       const passwordUpdated = await this.userAuthService.resetPassword(
//         email,
//         password
//       );
//       console.log(
//         "auth controller reset password 11,passwordSeset",
//         passwordUpdated
//       );
//       if (!passwordUpdated) {
//         throw new ApiError(
//           HttpStatus.INTERNAL_SERVER_ERROR,
//           "Failed to reset password"
//         );
//       }

//       console.log("auth controller reset password 12 not updates password ");
//       res
//         .status(HttpStatus.OK)
//         .json(
//           new ApiResponse(HttpStatus.OK, null, "Password reset successful")
//         );
//     } catch (error) {
//       console.log("auth controller reset password catch error  ");
//       next(error);
//     }
//   };

//   public logout = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       console.log("user logout step 1 - req.user:", req.user);

//       if (!req.user?.id || !req.user?.rawToken) {
//         throw new ApiError(HttpStatus.UNAUTHORIZED, "User not authenticated");
//       }

//       const { rawToken, id } = req.user;
//       console.log("user logout step 2 - rawToken:", rawToken, "id:", id);

//       const logoutData = await this.userAuthService.logout(rawToken, id);
//       console.log("user logout step 3 - logoutData:", logoutData);
//       await this.userService.updateOnlineStatus(id, false, null);
//       console.log("UserAuthController logout step 2", { logoutData });

//       res
//         .status(HttpStatus.OK)
//         .clearCookie("refreshToken", cookieConfig)
//         .json(new ApiResponse(HttpStatus.OK, null, "Logout successful"));
//     } catch (error) {
//       console.error("Error in logout:", error);
//       next(error);
//     }
//   };
// }
// export default new UserAuthController();
