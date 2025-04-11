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
}
export default new mentorController();
