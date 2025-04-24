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
import { inMentorProfileService } from "../../services/interface/inMentorProfileService";
import imMentorProfileService from "../../services/implementations/imMentorProfileService";

import axios from "axios";
import sharp from "sharp";

class mentorController {
  private userAuthService: inUserAuthService;
  private OTPServices: inOTPService;
  private userService: inUserService;
  private uploadService: inUploadService;
  private MentorProfileService: inMentorProfileService;

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
    this.MentorProfileService = new imMentorProfileService();
  }

  public uploadWelcomeForm = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("uploadWelcomeForm step 1");

      console.log(req.body);

      const userId = req.body?.id; // Assuming `req.user` contains the authenticated user's details
      if (!userId) {
        throw new ApiError(400, "User ID is required");
      }
      const response = await this.MentorProfileService.welcomeData(
        req.body,
        userId
      );
      res.status(200).json(new ApiResponse(200, response));
      return;
    } catch (error) {
      console.log("auth controller reset password catch error  ");
      next(error);
    }
  };

  public getProfileData = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("getprofile controller ", req.params);
      const userId = req.params.id;
      const response = await this.MentorProfileService.profileDatas(userId);
      res
        .status(200)
        .json(new ApiResponse(200, { response }, "Mentor Profile"));
      return;
    } catch (error) {
      console.log("mentor controller getprofile error  ", error);
      next(error);
    }
  };

  public createService = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("createService controller step 1");
      const formData = req.body;
      console.log("Received createService data:", formData);
      console.log("createService controller step 2");

      const newService = await this.MentorProfileService.createService(
        formData
      );
      console.log("createService controller step 3");

      res.json(
        new ApiResponse(201, newService, "Service created successfully")
      );
    } catch (error) {
      console.log("createService controller step 4");
      next(error);
    }
  };

  public generatePresignedUrl = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("generatePresignedUrl controller step 1");

      const { fileName, fileType, folder } = req.query as {
        fileName: string;
        fileType: string;
        folder: string;
      };
      console.log("generatePresignedUrl controller step 2");
      if (!fileName || !fileType || !folder) {
        console.log("generatePresignedUrl controller step 3");
        throw new ApiError(
          400,
          "Missing fileName, fileType, or folder parameter"
        );
      }
      console.log("generatePresignedUrl controller step 4");
      const url = await this.uploadService.S3generatePresignedUrl(
        fileName,
        fileType,
        folder
      );
      console.log("generatePresignedUrl controller step 5");
      res.json(url);
    } catch (error) {
      console.log("generatePresignedUrl controller step 6");
      next(error);
    }
  };

  public getPresignedUrl = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("getPresignedUrl ocntroller step 1");

      const { key } = req.query as { key: string };
      console.log("getPresignedUrl ocntroller step 2");
      if (!key) {
        console.log("getPresignedUrl ocntroller step 3");
        throw new ApiError(400, "Missing key parameter");
      }
      console.log("getPresignedUrl ocntroller step 4");
      const url = await this.uploadService.S3generatePresignedUrlForGet(key);
      console.log("getPresignedUrl ocntroller step 5");
      res.json({ url });
    } catch (error) {
      console.log("getPresignedUrl ocntroller step 6");
      next(error);
    }
  };
  public getAllServices = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("getAllServices controller step 1");
      const userId = req?.user?.id;
      if (!userId) {
        console.log("getAllServices controller step 2: No user ID");
        throw new ApiError(401, "User ID is required");
      }
      console.log("getAllServices controller step 2: User ID", userId);

      const services = await this.MentorProfileService.getAllServices(userId);
      console.log(
        "getAllServices controller step 3: Services fetched",
        services
      );

      res.json(new ApiResponse(200, services, "Services fetched successfully"));
    } catch (error) {
      console.log("getAllServices controller step 4");
      next(error);
    }
  };
}
export default new mentorController();
