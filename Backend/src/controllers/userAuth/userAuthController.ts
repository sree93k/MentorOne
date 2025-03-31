import { NextFunction, Request, Response } from "express";
import { ApiError } from "../../middlewares/errorHandler";
import ApiResponse from "../../utils/apiResponse";
import imUserAuthService from "../../services/implementations/imUserAuthService";
import { inUserAuthService } from "../../services/interface/inUserAuthService";
import imOTPServices from "../../services/implementations/imOTPService";
import { inOTPService } from "../../services/interface/inOTPService";
import { inUserService } from "../../services/interface/inUserService";
import imUserService from "../../services/implementations/imUserService";
import { EOTP } from "../../entities/OTPEntity";
import { inUploadService } from "../../services/interface/inUploadService";
import imUploadService from "../../services/implementations/imUploadService";
import axios from "axios";
import sharp from "sharp";

class UserAuthController {
  private userAuthService: inUserAuthService;
  private OTPServices: inOTPService;
  private userService: inUserService;
  private uploadService: inUploadService;

  private options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: 1000 * 60 * 60 * 24 * 2, // 2 days
  };

  constructor() {
    this.userAuthService = new imUserAuthService();
    this.OTPServices = new imOTPServices();
    this.userService = new imUserService();
    this.uploadService = new imUploadService();
  }

  public sendOTP = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("sendOTP controller/......", req.body);

      const user = req.body;
      console.log("Controller - sendOTP request received:", user);

      const otpExists = await this.OTPServices.checkOTPExists(user);
      console.log("otp exists >>>", otpExists);

      if (otpExists) {
        res
          .status(400)
          .json(
            new ApiError(
              400,
              "OTP already exists",
              "Please Wait 60 Seconds. Then try Again!"
            )
          );
        return;
      }

      const isUserExists = await this.userService.findUserWithEmail(user);
      if (isUserExists) {
        res
          .status(400)
          .json(
            new ApiError(
              400,
              "User Already Exists",
              "A user with this email already exists"
            )
          );
        return;
      }

      const createOTP = await this.OTPServices.sendOTP(user);
      console.log("Controller - OTP sent successfully:", createOTP);

      res
        .status(200)
        .json(
          new ApiResponse(200, { email: user.email }, "OTP sent successfully")
        );
    } catch (error) {
      console.error("Controller - sendOTP error:", error);
      next(error);
    }
  };

  //create user
  public createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email, otp } = req.body;
      console.log("OTP verification start at controller for email:", email);

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
        console.error("OTP Verification failed at controller");
        res
          .status(400)
          .json(
            new ApiError(
              400,
              "Invalid OTP",
              "The OTP you entered is invalid or has expired"
            )
          );
        return;
      }

      console.log("Controller - signup request received:", req.body);
      const signUpData = await this.userAuthService.createUser(email);
      console.log("Controller - signup service response:", signUpData);

      if (!signUpData) {
        console.log("Controller - signup failed: Invalid credentials");
        res
          .status(401)
          .json(new ApiError(401, "Authentication Failed", "Invalid Input"));
        return;
      }

      console.log("Controller - Signup successful");
      res.status(200).json(new ApiResponse(200, signUpData));
    } catch (error) {
      console.error("Controller - Error during signup:", error);
      if (error instanceof Error) {
        res.status(400).json(new ApiError(400, "Signup Failed", error.message));
      } else {
        next(error);
      }
    }
  };

  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log("Controller - Login request received:", req.body);
      const loginData = await this.userAuthService.login(req.body);
      console.log("Controller - Login service response:", loginData);

      if (!loginData) {
        console.log("Controller - Login failed: Invalid credentials");
        res
          .status(401)
          .json(
            new ApiError(
              401,
              "Authentication Failed",
              "Invalid email or password"
            )
          );
        return;
      }

      console.log("Controller - Login successful");
      res.status(200).json(new ApiResponse(200, loginData));
    } catch (error) {
      console.error("Controller - Login error:", error);
      if (error instanceof ApiError) {
        res.status(error.statusCode).json(error);
      } else {
        res
          .status(500)
          .json(
            new ApiError(
              500,
              "Internal Server Error",
              "An unexpected error occurred"
            )
          );
      }
    }
  };

  //   public verifyEmail = async (
  //     req: Request,
  //     res: Response,
  //     next: NextFunction
  //   ): Promise<void> => {
  //     try {
  //       console.log("Controller - verifyEmail request received: 1", req.body);
  //       const { otp, email } = req.body;
  //       console.log("contorlerr verifyemail otp an demaillus 2", otp, email);

  //       const verifyEmailData = await this.OTPServices.verifyEmailOTP(otp, email);
  //       console.log(
  //         "Controller - verifyEmail service response: 3",
  //         verifyEmailData
  //       );

  //       if (!verifyEmailData) {
  //         console.log("Controller - verifyEmail failed: Invalid credentials");
  //         res
  //           .status(401)
  //           .json(new ApiError(401, "Authentication Failed", "Invalid Input"));
  //         return;
  //       }

  //       console.log("Controller - verifyEmail successful");
  //       res.status(200).json(new ApiResponse(200, verifyEmailData));
  //     } catch (error) {
  //       console.error("Controller - verifyEmail error:", error);
  //       next(error);
  //     }
  //   };

  public googleAuthentication = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("auth step 1");
      const { firstName, lastName, email, profilePicture } = req.body;

      // Fetch the image from the profilePicture URL and get the buffer
      const response = await axios.get(profilePicture, {
        responseType: "arraybuffer",
      });
      console.log("auth step 2");
      const userExists = await this.userAuthService.googleSignIn({ email });
      console.log("auth step 3", userExists);
      if (userExists) {
        // const loginData = await this.userAuthService.googleLogin(email);
        // console.log("auth step 4", loginData);
        // if (loginData) {
        console.log("auth step 4 user exists");

        res
          .status(200)
          .cookie("refreshToken", userExists.refreshToken, this.options)
          .json(
            new ApiResponse(200, userExists, "Google authentication success")
          );
        return;
        //}
      }

      console.log("auth step 5");
      const imageBuffer = Buffer.from(response.data, "binary");
      console.log("auth step 6");
      const resizedImageBuffer = await sharp(imageBuffer)
        .resize({ width: 1024 }) // Resize to max 1024px width
        .toBuffer();
      console.log("auth step 7");
      // Upload the buffer directly to Cloudinary
      const fromGoogleImage = await this.uploadService.uploadSinglePhoto(
        resizedImageBuffer
      );

      console.log("auth step 8");

      const userAfterAuth = await this.userAuthService.googleSignUp({
        firstName: firstName,
        lastName: lastName,
        email: email,
        profilePicture: fromGoogleImage.url, // Assuming 'url' is the property from Cloudinary
      });
      console.log("auth step 9");
      console.log("========");
      console.log(userAfterAuth);
      console.log("========");

      // Check if userAfterAuth is null
      if (!userAfterAuth) {
        res
          .status(400)
          .json(
            new ApiError(400, "Authentication Failed", "User data is null")
          );
        return;
      }

      // Send success response with refresh token
      res
        .status(200)
        .cookie("refreshToken", userAfterAuth.refreshToken, this.options)
        .json(
          new ApiResponse(200, userAfterAuth, "Google authentication success")
        );
    } catch (error) {
      next(error);
    }
  };

  //forgot passworrd otp sedning
  public forgotPasswordOTP = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    // Explicitly declare return type as Promise<void>
    try {
      console.log("forgot password otp auth controller 1");

      const isUserExists = await this.userService.findUserWithEmail(req.body);
      console.log("forgot password otp auth controller 2", isUserExists);
      if (!isUserExists || isUserExists?.isBlocked) {
        res
          .status(400)
          .json(
            new ApiResponse(
              400,
              null,
              isUserExists?.isBlocked
                ? "Account is blocked"
                : "Check Your Email"
            )
          );
        console.log("forgot password otp auth controller 3");
        return; // Early return to stop execution, but no value returned
      }
      console.log("forgot password otp auth controller 4");
      const otpExists = await this.OTPServices.checkOTPExists(req.body);
      console.log("forgot password otp auth controller 5");
      if (otpExists) {
        res
          .status(500)
          .json(new ApiError(500, "Please Wait 1 Minute. Before Trying again"));
        return; // Early return, no value
      }

      await this.OTPServices.sendOTP(req.body);
      console.log("forgot password otp auth controller 2");
      res.status(200).json(new ApiResponse(200, null, "OTP sent successfully")); // Send response without returning it
    } catch (error) {
      // Pass error to error-handling middleware
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
        console.log("Controller - verifyEmail failed: Invalid credentials");
        res
          .status(401)
          .json(new ApiError(401, "Authentication Failed", "Invalid Input"));
        return;
      }

      console.log("Controller - verifyEmail successful");
      res.status(200).json(new ApiResponse(200, verifyEmailData));
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
      console.log("auth controller reset password 2 email is ", email);
      console.log("auth controller reset password 2 password is ", password);
      
      // const decode = await this.userAuthService.decodeAndVerifyToken(token);
      console.log("auth controller reset password 3");
      // req.body.user = decode;
      // console.log("auth controller reset password 4");
      // if (!decode) {
      //   console.log("auth controller reset password 6 no decode");
      //   res
      //     .status(405)
      //     .json(new ApiResponse(405, null, "Session Expired Try Again"));
      //   return;
      // }
      console.log("auth controller reset password 7");
      // const isUserExists = await this.userService.findUserWithEmail(req.body);
      // console.log("auth controller reset password 8", isUserExists);
      // if (!isUserExists || isUserExists?.isBlocked) {
      //   console.log("auth controller reset password 8.5 errro....");
        
      //   res
      //     .status(400)
      //     .json(
      //       new ApiResponse(
      //         400,
      //         null,
      //         isUserExists?.isBlocked ? "Account is blocked" : "Something Wrong"
      //       )
      //     );
      //   console.log("auth controller reset password 9 ");
      //   return;
      // }
      console.log("auth controller reset password 10 email and password",email,password);
      const passwordUpdated = await this.userAuthService.resetPassword(
        email,
        password
      );
      console.log("auth controller reset password 11,passwordSeset",passwordUpdated);
      if (passwordUpdated) {
        console.log("auth controller reset password 12 successs ");
        res.status(200).json(new ApiResponse(200, null, "reset success"));
        return;
      }
      console.log("auth controller reset password 12 not updates password ");
      res
        .status(500)
        .json(new ApiError(500, "something went wrong", "reset Failed"));
      return;
    } catch (error) {
      console.log("auth controller reset password catch error  ");
      next(error);
    }
  };
}

export default new UserAuthController();
