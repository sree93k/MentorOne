import { injectable, inject } from "inversify";
import { NextFunction, Request, Response } from "express";
import { ApiError } from "../../middlewares/errorHandler";
import ApiResponse from "../../utils/apiResponse";
import { IUserAuthService } from "../../services/interface/IUserAuthService";
import { IOTPService } from "../../services/interface/IOTPService";
import { IUserService } from "../../services/interface/IUserService";
import { EOTP } from "../../entities/OTPEntity";
import { IUploadService } from "../../services/interface/IUploadService";
import { IMentorService } from "../../services/interface/IMentorService";
import { ICalenderService } from "../../services/interface/ICalenderService";
import { HttpStatus } from "../../constants/HttpStatus";
import BackendUploadService from "../../services/implementations/BackendUploadService";
import IndustryStandardVideoService from "../../services/implementations/IndustryStandardVideoService";
import EnhancedSecureVideoProxy from "../../services/implementations/EnhancedSecureVideoProxy";
import VideoMigrationService from "../../services/implementations/VideoMigrationService";
import VideoAnalyticsService from "../../services/implementations/VideoAnalyticsService";
import { TYPES } from "../../inversify/types";
import { IMentorController } from "../interface/IMentorController";

/**
 * 🔹 DIP COMPLIANCE: Injectable Mentor Controller
 * Uses dependency injection instead of direct service instantiation
 */
@injectable()
class MentorController implements IMentorController {
  private userAuthService: IUserAuthService;
  private OTPServices: IOTPService;
  private userService: IUserService;
  private uploadService: IUploadService;
  private MentorService: IMentorService;
  private calendarService: ICalenderService;

  private options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: 1000 * 60 * 60 * 24 * 2, // 2 days
  };

  constructor(
    @inject(TYPES.IUserAuthService) userAuthService: IUserAuthService,
    @inject(TYPES.IOTPService) otpService: IOTPService,
    @inject(TYPES.IUploadService) uploadService: IUploadService,
    @inject(TYPES.IUserService) userService: IUserService,
    @inject(TYPES.IMentorService) mentorService: IMentorService,
    @inject(TYPES.ICalenderService) calendarService: ICalenderService
  ) {
    this.userAuthService = userAuthService;
    this.OTPServices = otpService;
    this.uploadService = uploadService;
    this.userService = userService;
    this.MentorService = mentorService;
    this.calendarService = calendarService;
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
        throw new ApiError(HttpStatus.BAD_REQUEST, "User ID is required");
      }

      const response = await this.MentorService.welcomeData(req.body, userId);

      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            response,
            "Welcome form uploaded successfully"
          )
        );
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
      if (!userId) {
        throw new ApiError(HttpStatus.BAD_REQUEST, "User ID is required");
      }
      const response = await this.MentorService.profileDatas(userId);
      if (!response) {
        throw new ApiError(HttpStatus.NOT_FOUND, "Profile not found");
      }
      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            response,
            "Mentor profile fetched successfully"
          )
        );
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
      console.log("MentorController createService step 1", { body: req.body });
      const userId = req.user?.id;
      if (!userId) {
        throw new ApiError(HttpStatus.UNAUTHORIZED, "User ID is required");
      }
      const formData = { ...req.body, mentorId: userId };
      const newService = await this.MentorService.createService(formData);
      console.log("MentorController createService step 2", { newService });

      res
        .status(HttpStatus.CREATED)
        .json(
          new ApiResponse(
            HttpStatus.CREATED,
            newService,
            "Service created successfully"
          )
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
        throw new ApiError(
          HttpStatus.BAD_REQUEST,
          "Missing fileName, fileType, or folder parameter"
        );
      }

      console.log("generatePresignedUrl controller step 4");
      const url = await this.uploadService.S3generatePresignedUrl(
        fileName,
        fileType,
        folder
      );
      console.log("MentorController generatePresignedUrl step 2", { url });

      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            { url },
            "Presigned URL generated successfully"
          )
        );
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
        throw new ApiError(HttpStatus.BAD_REQUEST, "Missing key parameter");
      }
      const url = await this.uploadService.S3generatePresignedUrlForGet(key);
      console.log("MentorController getPresignedUrl step 2", { url });

      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            { url },
            "Presigned URL fetched successfully"
          )
        );
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
      console.log("MentorController getAllServices step 1", {
        query: req.query,
      });
      const userId = req.user?.id;
      if (!userId) {
        throw new ApiError(HttpStatus.UNAUTHORIZED, "User ID is required");
      }

      const { page = "1", limit = "8", search = "", type } = req.query;
      const servicesData = await this.MentorService.getAllServices(userId, {
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10),
        search: search as string,
        type: type as string,
      });
      console.log("MentorController getAllServices step 2", { servicesData });

      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            servicesData,
            "Services fetched successfully"
          )
        );
    } catch (error) {
      console.log("getAllServices controller step 4");
      next(error);
    }
  };
  // New methods
  public getServiceById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("MentorController getServiceById step 1", {
        params: req.params,
      });
      const serviceId = req.params.id;
      if (!serviceId) {
        throw new ApiError(HttpStatus.BAD_REQUEST, "Service ID is required");
      }

      const service = await this.MentorService.getServiceById(serviceId);
      if (!service) {
        throw new ApiError(HttpStatus.NOT_FOUND, "Service not found");
      }
      console.log("MentorController getServiceById step 2", { service });

      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            service,
            "Service fetched successfully"
          )
        );
    } catch (error) {
      console.log("getServiceById controller step 4");
      next(error);
    }
  };

  public updateService = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("MentorController updateService step 1", {
        params: req.params,
        body: req.body,
      });
      const serviceId = req.params.id;
      if (!serviceId) {
        throw new ApiError(HttpStatus.BAD_REQUEST, "Service ID is required");
      }

      const formData: { [key: string]: any } = { ...req.body };
      if (req.files && Array.isArray(req.files)) {
        req.files.forEach((file: Express.MulterS3.File) => {
          formData[file.fieldname] = file;
          if (file.location) {
            formData[`${file.fieldname}_url`] = file.location;
          }
        });
      }

      const updatedService = await this.MentorService.updateService(
        serviceId,
        formData
      );
      console.log("MentorController updateService step 2", { updatedService });

      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            updatedService,
            "Service updated successfully"
          )
        );
    } catch (error) {
      console.log("updateService controller step 4");
      next(error);
    }
  };
  public getMentorCalendar = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("MentorController getMentorCalendar step 1", {
        params: req.params,
      });
      const mentorId = req.params.mentorId;
      if (!mentorId) {
        throw new ApiError(HttpStatus.BAD_REQUEST, "Mentor ID is required");
      }

      const calendar = await this.calendarService.getMentorCalendar(mentorId);
      if (!calendar) {
        throw new ApiError(HttpStatus.NOT_FOUND, "Calendar not found");
      }
      console.log("MentorController getMentorCalendar step 2", { calendar });

      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            calendar,
            "Mentor calendar fetched successfully"
          )
        );
    } catch (error) {
      console.error("Error in getMentorCalendar:", error);
      next(error);
    }
  };

  public updatePolicy = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("MentorController updatePolicy step 1", {
        params: req.params,
        body: req.body,
      });
      const mentorId = req.params.mentorId;
      if (!mentorId) {
        throw new ApiError(HttpStatus.BAD_REQUEST, "Mentor ID is required");
      }

      const policyData = req.body;
      const updatedPolicy = await this.calendarService.updatePolicy(
        mentorId,
        policyData
      );
      console.log("MentorController updatePolicy step 2", { updatedPolicy });

      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            updatedPolicy,
            "Policy updated successfully"
          )
        );
    } catch (error) {
      console.error("Error in updatePolicy:", error);
      next(error);
    }
  };

  public createSchedule = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("MentorController createSchedule step 1", {
        params: req.params,
        body: req.body,
      });
      const mentorId = req.params.mentorId;
      if (!mentorId) {
        throw new ApiError(HttpStatus.BAD_REQUEST, "Mentor ID is required");
      }

      const scheduleData = req.body;
      const newSchedule = await this.calendarService.createSchedule(
        mentorId,
        scheduleData
      );
      console.log("MentorController createSchedule step 2", { newSchedule });

      res
        .status(HttpStatus.CREATED)
        .json(
          new ApiResponse(
            HttpStatus.CREATED,
            newSchedule,
            "Schedule created successfully"
          )
        );
    } catch (error) {
      console.error("Error in createSchedule:", error);
      next(error);
    }
  };

  public updateSchedule = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("MentorController updateSchedule step 1", {
        params: req.params,
        body: req.body,
      });
      const scheduleId = req.params.scheduleId;
      if (!scheduleId) {
        throw new ApiError(HttpStatus.BAD_REQUEST, "Schedule ID is required");
      }

      const scheduleData = req.body;
      const updatedSchedule = await this.calendarService.updateSchedule(
        scheduleId,
        scheduleData
      );
      console.log("MentorController updateSchedule step 2", {
        updatedSchedule,
      });

      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            updatedSchedule,
            "Schedule updated successfully"
          )
        );
    } catch (error) {
      console.error("Error in updateSchedule:", error);
      next(error);
    }
  };

  public deleteSchedule = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("MentorController deleteSchedule step 1", {
        params: req.params,
      });
      const scheduleId = req.params.scheduleId;
      if (!scheduleId) {
        throw new ApiError(HttpStatus.BAD_REQUEST, "Schedule ID is required");
      }

      await this.calendarService.deleteSchedule(scheduleId);
      console.log("MentorController deleteSchedule step 2");

      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(HttpStatus.OK, null, "Schedule deleted successfully")
        );
    } catch (error) {
      console.error("Error in deleteSchedule:", error);
      next(error);
    }
  };

  public addBlockedDates = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("MentorController addBlockedDates step 1", {
        params: req.params,
        body: req.body,
      });
      const mentorId = req.params.mentorId;
      const { dates } = req.body;
      if (!mentorId || !dates) {
        throw new ApiError(
          HttpStatus.BAD_REQUEST,
          "Mentor ID and dates are required"
        );
      }

      const blockedDates = await this.calendarService.addBlockedDates(
        mentorId,
        dates
      );
      console.log("MentorController addBlockedDates step 2", { blockedDates });

      res
        .status(HttpStatus.CREATED)
        .json(
          new ApiResponse(
            HttpStatus.CREATED,
            blockedDates,
            "Blocked dates added successfully"
          )
        );
    } catch (error) {
      console.error("Error in addBlockedDates:", error);
      next(error);
    }
  };

  public removeBlockedDate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("MentorController removeBlockedDate step 1", {
        params: req.params,
      });
      const blockedDateId = req.params.blockedDateId;
      if (!blockedDateId) {
        throw new ApiError(
          HttpStatus.BAD_REQUEST,
          "Blocked date ID is required"
        );
      }

      await this.calendarService.removeBlockedDate(blockedDateId);
      console.log("MentorController removeBlockedDate step 2");

      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            null,
            "Blocked date removed successfully"
          )
        );
    } catch (error) {
      console.error("Error in removeBlockedDate:", error);
      next(error);
    }
  };
  public isApprovalChecking = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("MentorController isApprovalChecking step 1", {
        params: req.params,
      });
      const mentorId = req.params.mentorId;
      if (!mentorId) {
        throw new ApiError(HttpStatus.BAD_REQUEST, "Mentor ID is required");
      }

      const response = await this.MentorService.isApprovalChecking(mentorId);
      console.log("MentorController isApprovalChecking step 2", { response });

      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            response,
            "Approval status fetched successfully"
          )
        );
    } catch (error) {
      console.error("Error in isApprovalChecking:", error);
      next(error);
    }
  };

  public assignScheduleToService = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("MentorController assignScheduleToService step 1", {
        params: req.params,
        body: req.body,
      });
      const serviceId = req.params.serviceId;
      const { scheduleId } = req.body;
      if (!serviceId || !scheduleId) {
        throw new ApiError(
          HttpStatus.BAD_REQUEST,
          "Service ID and Schedule ID are required"
        );
      }

      const updatedService = await this.MentorService.assignScheduleToService(
        serviceId,
        scheduleId
      );
      if (!updatedService) {
        throw new ApiError(HttpStatus.NOT_FOUND, "Service not found");
      }
      console.log("MentorController assignScheduleToService step 2", {
        updatedService,
      });

      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            updatedService,
            "Schedule assigned to service successfully"
          )
        );
    } catch (error) {
      console.error("Error in assignScheduleToService:", error);
      next(error);
    }
  };

  public replyToPriorityDM = async (
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("MentorController replyToPriorityDM step 1", {
        params: req.params,
        body: req.body,
      });
      const mentorId = req.user?.id;
      if (!mentorId) {
        throw new ApiError(HttpStatus.UNAUTHORIZED, "User ID is required");
      }

      const { priorityDMId } = req.params;
      const { content, pdfFiles } = req.body;
      if (!priorityDMId || !content) {
        throw new ApiError(
          HttpStatus.BAD_REQUEST,
          "Priority DM ID and content are required"
        );
      }

      const updatedDM = await this.MentorService.replyToPriorityDM(
        priorityDMId,
        mentorId,
        { content, pdfFiles }
      );
      console.log("MentorController replyToPriorityDM step 2", { updatedDM });

      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(HttpStatus.OK, updatedDM, "Reply sent successfully")
        );
    } catch (error) {
      console.error("Error in replyToPriorityDM:", error);
      next(error);
    }
  };

  public getPriorityDMs = async (
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("MentorController getPriorityDMs step 1", {
        params: req.params,
      });
      const mentorId = req.user?.id;
      if (!mentorId) {
        throw new ApiError(HttpStatus.UNAUTHORIZED, "User ID is required");
      }

      const { serviceId } = req.params;
      if (!serviceId) {
        throw new ApiError(HttpStatus.BAD_REQUEST, "Service ID is required");
      }

      const priorityDMs = await this.MentorService.getPriorityDMs(
        serviceId,
        mentorId
      );
      console.log("MentorController getPriorityDMs step 2", { priorityDMs });

      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            priorityDMs,
            "Priority DMs fetched successfully"
          )
        );
    } catch (error) {
      console.error("Error in getPriorityDMs:", error);
      next(error);
    }
  };

  public getAllPriorityDMsByMentor = async (
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const mentorId = req.user?.id;
      if (!mentorId) {
        throw new ApiError(HttpStatus.UNAUTHORIZED, "User ID is required");
      }

      // Extract query parameters
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 8;
      const searchQuery = (req.query.search as string) || "";
      const status = (req.query.status as "pending" | "replied") || undefined;
      const sort = (req.query.sort as "asc" | "desc") || undefined;

      const { priorityDMs, total } =
        await this.MentorService.getAllPriorityDMsByMentor(
          mentorId,
          page,
          limit,
          searchQuery,
          status,
          sort
        );

      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            { priorityDMs, total, page, limit },
            "All Priority DMs fetched successfully"
          )
        );
    } catch (error) {
      next(error);
    }
  };

  public updateTopTestimonials = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { testimonialIds } = req.body;
    const mentorId = req?.user?.id;
    console.log(
      "Mentor controller updateTopTestimonials step 1 mentorId",
      mentorId
    );
    console.log(
      "Mentor controller updateTopTestimonials step 1.5 testimonialIds",
      testimonialIds
    );
    try {
      if (!mentorId) {
        throw new ApiError(HttpStatus.BAD_REQUEST, "Mentor ID is required");
      }
      const updatedMentor = await this.MentorService.updateTopTestimonials(
        mentorId,
        testimonialIds
      );
      console.log(
        "Mentor controller updateTopTestimonials step 2 updatedMentor",
        updatedMentor
      );
      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            { topTestimonials: updatedMentor.topTestimonials },
            "Top testimonials updated successfully"
          )
        );
    } catch (error: any) {
      console.error("Error updating top testimonials:", error);
      next(error);
    }
  };

  // 🔧 BACKEND VIDEO UPLOAD - Alternative to presigned URLs for CORS issues
  public uploadVideoBackend = async (
    req: Request & { file?: Express.Multer.File; user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("🔧 MentorController uploadVideoBackend: Starting", {
        hasFile: !!req.file,
        userId: req.user?.id?.substring(0, 8) + "..."
      });

      if (!req.file) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          error: "No video file provided"
        });
        return;
      }

      if (!req.user?.id) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          error: "User not authenticated"
        });
        return;
      }

      // Upload video to S3 via backend
      const uploadResult = await BackendUploadService.uploadVideoFile(req.file, 'videos');

      if (!uploadResult.success) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          error: uploadResult.error || "Failed to upload video"
        });
        return;
      }

      console.log("✅ MentorController uploadVideoBackend: Success", {
        s3Key: uploadResult.s3Key
      });

      res.status(HttpStatus.OK).json({
        success: true,
        data: {
          s3Key: uploadResult.s3Key,
          videoUrl: uploadResult.videoUrl
        },
        message: "Video uploaded successfully"
      });

    } catch (error: any) {
      console.error("🚫 MentorController uploadVideoBackend: Error", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: "Failed to upload video"
      });
    }
  };

  // 🎬 INDUSTRY STANDARD VIDEO UPLOAD
  public uploadVideoIndustryStandard = async (
    req: Request & { file?: Express.Multer.File; user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("🎬 Industry standard video upload starting", {
        hasFile: !!req.file,
        userId: req.user?.id?.substring(0, 8) + "...",
        contentType: req.body.contentType,
        serviceId: req.body.serviceId
      });

      if (!req.file) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          error: "No video file provided"
        });
        return;
      }

      if (!req.user?.id) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          error: "User not authenticated"
        });
        return;
      }

      // Extract upload configuration from request
      const config = {
        userId: req.user.id,
        serviceId: req.body.serviceId || 'temp-service',
        contentType: req.body.contentType || 'video-tutorials',
        environment: (process.env.NODE_ENV === 'production' ? 'production' : 'development') as 'development' | 'production',
        securityLevel: 'private' as 'private'
      };

      // Content protection options
      const protectionOptions = {
        enableWatermark: req.body.enableWatermark !== 'false',
        watermarkText: req.body.watermarkText || `© ${req.user.id}`,
        enableDRM: req.body.enableDRM === 'true',
        allowDownload: req.body.allowDownload === 'true',
        maxViewsPerUser: parseInt(req.body.maxViewsPerUser) || 1000,
        expiryDate: req.body.expiryDate ? new Date(req.body.expiryDate) : undefined
      };

      // Upload with industry standards
      const uploadResult = await IndustryStandardVideoService.uploadVideoFile(
        req.file,
        config,
        protectionOptions
      );

      if (!uploadResult.success) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          error: uploadResult.error || "Failed to upload video"
        });
        return;
      }

      console.log("✅ Industry standard video upload successful", {
        videoS3Key: uploadResult.videoS3Key,
        secureId: uploadResult.videoSecureId
      });

      res.status(HttpStatus.OK).json({
        success: true,
        data: {
          videoS3Key: uploadResult.videoS3Key,
          videoSecureId: uploadResult.videoSecureId,
          accessToken: uploadResult.accessToken,
          metadata: uploadResult.metadata
        },
        message: "Video uploaded with industry standards"
      });

    } catch (error: any) {
      console.error("🚫 Industry standard video upload failed:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: "Failed to upload video"
      });
    }
  };

  // 🔗 GENERATE SECURE VIDEO URL
  public generateSecureVideoUrl = async (
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { s3Key, videoSecureId, expiresIn, quality } = req.query as {
        s3Key?: string;
        videoSecureId?: string;
        expiresIn?: string;
        quality?: string;
      };

      if (!req.user?.id) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          error: "User not authenticated"
        });
        return;
      }

      if (!s3Key && !videoSecureId) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          error: "Either s3Key or videoSecureId is required"
        });
        return;
      }

      const request = {
        s3Key,
        videoSecureId,
        userId: req.user.id,
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip || req.connection.remoteAddress
      };

      const options = {
        expiresIn: expiresIn ? parseInt(expiresIn) : 3600,
        quality,
        analytics: true
      };

      const result = await EnhancedSecureVideoProxy.generateSecureStreamingUrl(request, options);

      if (!result.success) {
        res.status(HttpStatus.FORBIDDEN).json({
          success: false,
          error: result.error || "Access denied"
        });
        return;
      }

      res.status(HttpStatus.OK).json({
        success: true,
        data: {
          url: result.url,
          expiresIn: options.expiresIn
        },
        message: "Secure video URL generated"
      });

    } catch (error: any) {
      console.error("🚫 Failed to generate secure video URL:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: "Failed to generate secure URL"
      });
    }
  };

  // 📊 GET VIDEO ANALYTICS
  public getVideoAnalytics = async (
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { videoS3Key, serviceId, startDate, endDate } = req.query as {
        videoS3Key?: string;
        serviceId?: string;
        startDate?: string;
        endDate?: string;
      };

      if (!req.user?.id) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          error: "User not authenticated"
        });
        return;
      }

      const query = {
        mentorId: req.user.id,
        videoS3Key,
        serviceId,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined
      };

      const analytics = await VideoAnalyticsService.getVideoAnalytics(query);

      if (!analytics) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          error: "Analytics not found"
        });
        return;
      }

      res.status(HttpStatus.OK).json({
        success: true,
        data: analytics,
        message: "Video analytics retrieved"
      });

    } catch (error: any) {
      console.error("🚫 Failed to get video analytics:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: "Failed to get analytics"
      });
    }
  };

  // 🔄 MIGRATE VIDEOS
  public migrateVideos = async (
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user?.id) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          error: "User not authenticated"
        });
        return;
      }

      const options = {
        dryRun: req.body.dryRun === true,
        batchSize: req.body.batchSize || 5,
        onlyFailedMigrations: req.body.onlyFailedMigrations === true,
        backupOriginals: req.body.backupOriginals !== false,
        updateAnalytics: req.body.updateAnalytics !== false
      };

      console.log("🔄 Starting video migration", {
        userId: req.user.id.substring(0, 8) + "...",
        options
      });

      const migrationResult = await VideoMigrationService.migrateAllVideos(options);

      res.status(HttpStatus.OK).json({
        success: migrationResult.success,
        data: migrationResult,
        message: migrationResult.success 
          ? "Video migration completed successfully"
          : "Video migration completed with errors"
      });

    } catch (error: any) {
      console.error("🚫 Video migration failed:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: "Migration failed"
      });
    }
  };

  // 📈 GET MIGRATION PROGRESS
  public getMigrationProgress = async (
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user?.id) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          error: "User not authenticated"
        });
        return;
      }

      const progress = await VideoMigrationService.getMigrationProgress();

      res.status(HttpStatus.OK).json({
        success: true,
        data: progress,
        message: "Migration progress retrieved"
      });

    } catch (error: any) {
      console.error("🚫 Failed to get migration progress:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: "Failed to get migration progress"
      });
    }
  };
}
export default MentorController;
