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
import { inMenteeProfileService } from "../../services/interface/inMenteeProfileService";
import imMenteeProfileService from "../../services/implementations/imMenteeProfileService";
// import {inMenteeService} from '../../services/interface's
import axios from "axios";
import sharp from "sharp";

class menteeController {
  private userAuthService: inUserAuthService;
  private OTPServices: inOTPService;
  private userService: inUserService;
  private uploadService: inUploadService;
  private MenteeProfileService: inMenteeProfileService;

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
    this.MenteeProfileService = new imMenteeProfileService();
  }

  public uploadWelcomeForm = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("mnetee controller uploadWelcomeForm step 1");

      console.log(req.body);
      console.log("mnetee controller uploadWelcomeForm step 2");
      const userId = req.body?.id; // Assuming `req.user` contains the authenticated user's details
      console.log("mnetee controller uploadWelcomeForm step 3");
      if (!userId) {
        console.log("mnetee controller uploadWelcomeForm step 4 errro");
        throw new ApiError(400, "User ID is required");
      }
      console.log("mnetee controller uploadWelcomeForm step 5");
      const response = await this.MenteeProfileService.welcomeData(
        req.body,
        userId
      );
      console.log("mnetee controller uploadWelcomeForm step 6", response);
      res.status(200).json(new ApiResponse(200, response));
      console.log("mnetee controller uploadWelcomeForm step 7");
      return;
    } catch (error) {
      console.log("mnetee controller uploadWelcomeForm step 8 errro ctach");
      next(error);
    }
  };

  //   public uploadWelcomeForm = async (
  //     req: Request,
  //     res: Response,
  //     next: NextFunction
  //   ): Promise<void> => {
  //     try {
  //       console.log("mnetee controller uploadWelcomeForm step 1");
  //       console.log(req.body);
  //       console.log("mnetee controller uploadWelcomeForm step 2");
  //       const userId = req.body?.id;
  //       console.log("mnetee controller uploadWelcomeForm step 3");
  //       if (!userId) {
  //         console.log("mnetee controller uploadWelcomeForm step 4 errro");
  //         throw new ApiError(400, "User ID is required");
  //       }
  //       console.log("mnetee controller uploadWelcomeForm step 5");
  //       const response = await this.MenteeProfileService.welcomeData(
  //         req.body,
  //         userId
  //       );
  //       console.log("mnetee controller uploadWelcomeForm step 6", response);

  //       if (res.headersSent) {
  //         console.log("Headers already sent before sending response");
  //         return;
  //       }
  //       res.status(200).json(new ApiResponse(200, response));
  //       console.log("mnetee controller uploadWelcomeForm step 7");
  //       return;
  //     } catch (error) {
  //       console.log("mnetee controller uploadWelcomeForm step 8 errro ctach");
  //       next(error);
  //     }
  //   };
  public uploadProfileImage = async (
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("menteeCOntrollere uploadProfileImage step 1");

      const id = req.user?.id;
      if (!id) {
        console.log("menteeCOntrollere uploadProfileImage step 2");
        res.status(401).json(new ApiResponse(401, null, "Unauthorized"));
        return;
      }
      console.log("menteeCOntrollere uploadProfileImage step 3");

      const imageFile = req.file;
      console.log("menteeCOntrollere uploadProfileImage step 4");

      if (!imageFile) {
        console.log("menteeCOntrollere uploadProfileImage step 5");
        res.status(400).json(new ApiResponse(400, null, "No file uploaded"));
        return;
      }
      console.log("menteeCOntrollere uploadProfileImage step 6");

      const resizedImageBuffer = await sharp(imageFile.path)
        .resize({ width: 1024 })
        .toBuffer();
      console.log("menteeCOntrollere uploadProfileImage step 7");

      const result = await this.uploadService.updateProfileImage(
        { ...imageFile, buffer: resizedImageBuffer },
        id
      );
      console.log("menteeCOntrollere uploadProfileImage step 8", result);

      // Check if headers have already been sent before responding
      if (!res.headersSent) {
        res
          .status(200)
          .json(new ApiResponse(200, { profilePicture: result.url }));
      }
      return;
    } catch (error) {
      console.log("menteeCOntrollere uploadProfileImage step 9", error);
      // Only call next if headers haven’t been sent
      if (!res.headersSent) {
        next(error);
      }
    }
  };

  //editUserProfile
  // public editUserProfile = async (
  //   req: Request & { user?: { id: string } },
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> => {
  //   try {
  //     console.log("mentee copntroller editUserProfile step 1", req.user);

  //     const id = req.user?.id;
  //     if (!id) {
  //       console.log("mentee copntroller editUserProfile step 2");
  //       res.status(401).json(new ApiResponse(401, null, "Unauthorized"));
  //       return;
  //     }
  //     console.log("mentee copntroller editUserProfile step 3");
  //     const payload = req.body;
  //     console.log("mentee copntroller editUserProfile step 4", payload);
  //     const updatedUser = await this.MenteeProfileService.editUserProfile(
  //       id,
  //       payload
  //     );
  //     console.log("mentee copntroller editUserProfile step 5", updatedUser);
  //     if (!updatedUser) {
  //       console.log("mentee copntroller editUserProfile step 6");
  //       res.status(404).json(new ApiResponse(404, null, "User not found"));
  //       return;
  //     }
  //     console.log("mentee copntroller editUserProfile step 7");
  //     res
  //       .status(200)
  //       .json(
  //         new ApiResponse(200, updatedUser, "Profile updated successfully")
  //       );
  //   } catch (error) {
  //     console.log("mentee copntroller editUserProfile step 8 errror", error);
  //     next(error);
  //   }
  // };

  public deleteAccount = async (
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = req.user?.id;
      if (!id) {
        res.status(401).json(new ApiResponse(401, null, "Unauthorized"));
        return;
      }

      const deleted = await this.MenteeProfileService.deleteAccount(id);
      if (!deleted) {
        res.status(404).json(new ApiResponse(404, null, "User not found"));
        return;
      }

      res
        .status(200)
        .json(new ApiResponse(200, null, "Account deleted successfully"));
    } catch (error) {
      next(error);
    }
  };

  public profileData = async (
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("profileData mentee controller step1");
      const id = req?.user?.id;
      const response = await this.MenteeProfileService.userProfielData(id);
      if (!response) {
        console.log("mentee copntroller editUserProfile step 6");
        res.status(404).json(new ApiResponse(404, null, "User not found"));
        return;
      }
      console.log("mentee copntroller editUserProfile step 7");
      res
        .status(200)
        .json(new ApiResponse(200, response, "Profile updated successfully"));
    } catch (error) {
      next(error);
    }
  };
}

export default new menteeController();
