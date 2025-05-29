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
import { IMentorProfileService } from "../../services/interface/IMentorProfileService";
import MentorProfileService from "../../services/implementations/MentorProfileService";
import { ICalendarService } from "../../services/interface/ICalenderService";
import CalendarService from "../../services/implementations/CalenderService";

class mentorController {
  private userAuthService: IUserAuthService;
  private OTPServices: IOTPService;
  private userService: IUserService;
  private uploadService: IUploadService;
  private MentorProfileService: IMentorProfileService;
  private calendarService: ICalendarService;

  private options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: 1000 * 60 * 60 * 24 * 2, // 2 days
  };

  constructor() {
    this.userAuthService = new UserAuthService();
    this.OTPServices = new OTPServices();
    this.userService = new UserService();
    this.uploadService = new UploadService();
    this.MentorProfileService = new MentorProfileService();
    this.calendarService = new CalendarService();
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

  // New methods
  public getServiceById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("getServiceById controller step 1");
      const serviceId = req.params.id;
      if (!serviceId) {
        console.log("getServiceById controller step 2: No service ID");
        throw new ApiError(400, "Service ID is required");
      }
      console.log("getServiceById controller step 2: Service ID", serviceId);

      const service = await this.MentorProfileService.getServiceById(serviceId);
      console.log("getServiceById controller step 3: Service fetched", service);

      if (!service) {
        throw new ApiError(404, "Service not found");
      }

      res.json(new ApiResponse(200, service, "Service fetched successfully"));
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
      console.log("updateService controller step 1");
      const serviceId = req.params.id;
      // Merge req.body and req.files into formData
      const formData: { [key: string]: any } = { ...req.body };
      if (req.files && Array.isArray(req.files)) {
        req.files.forEach((file: Express.MulterS3.File) => {
          formData[file.fieldname] = file; // Store file object
          if (file.location) {
            formData[`${file.fieldname}_url`] = file.location; // Store S3 URL
          }
        });
      }

      // Log FormData contents
      const formDataEntries: { [key: string]: any } = {};
      for (const [key, value] of Object.entries(formData)) {
        formDataEntries[key] =
          value && value.location
            ? `File: ${value.originalname} (S3 URL: ${value.location})`
            : value;
      }
      console.log("Received updateService data:", serviceId, formDataEntries);
      console.log("updateService controller step 2");

      if (!serviceId) {
        throw new ApiError(400, "Service ID is required");
      }

      const updatedService = await this.MentorProfileService.updateService(
        serviceId,
        formData
      );
      console.log("updateService controller step 3");

      res.json(
        new ApiResponse(200, updatedService, "Service updated successfully")
      );
    } catch (error) {
      console.log("updateService controller step 4");
      next(error);
    }
  };

  async getMentorCalendar(req: Request, res: Response) {
    try {
      const mentorId = req.params.mentorId;
      const calendar = await this.calendarService.getMentorCalendar(mentorId);
      res.status(200).json(calendar);
    } catch (error) {
      res.status(500).json({ message: "Error fetching calendar", error });
    }
  }

  async updatePolicy(req: Request, res: Response) {
    try {
      console.log("mentorcontorller updatePolicy step 1");

      const mentorId = req.params.mentorId;
      const policyData = req.body;
      console.log("mentorcontorller updatePolicy step 2", mentorId, policyData);
      const updatedPolicy = await this.calendarService.updatePolicy(
        mentorId,
        policyData
      );
      console.log("mentorcontorller updatePolicy step 3", updatedPolicy);
      res.status(200).json(updatedPolicy);
    } catch (error) {
      console.log("mentorcontorller updatePolicy step 4 error", error);
      res.status(500).json({ message: "Error updating policy", error });
    }
  }

  async createSchedule(req: Request, res: Response) {
    try {
      console.log("mentorcontroller createSchedule step1");

      const mentorId = req.params.mentorId;
      const scheduleData = req.body;
      console.log(
        "mentorcontroller createSchedule step2",
        mentorId,
        scheduleData
      );
      const newSchedule = await this.calendarService.createSchedule(
        mentorId,
        scheduleData
      );
      console.log("mentorcontroller createSchedule step3", newSchedule);
      res.status(201).json(newSchedule);
    } catch (error) {
      console.log("mentorcontroller createSchedule step4", error);

      res.status(500).json({ message: "Error creating schedule", error });
    }
  }

  async updateSchedule(req: Request, res: Response) {
    try {
      const scheduleId = req.params.scheduleId;
      const scheduleData = req.body;
      const updatedSchedule = await this.calendarService.updateSchedule(
        scheduleId,
        scheduleData
      );
      res.status(200).json(updatedSchedule);
    } catch (error) {
      res.status(500).json({ message: "Error updating schedule", error });
    }
  }

  async deleteSchedule(req: Request, res: Response) {
    try {
      const scheduleId = req.params.scheduleId;
      await this.calendarService.deleteSchedule(scheduleId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting schedule", error });
    }
  }

  async addBlockedDates(req: Request, res: Response) {
    try {
      const mentorId = req.params.mentorId;
      const { dates } = req.body;
      console.log("mentor controller addBlockedDates step 1", mentorId, dates);

      const blockedDates = await this.calendarService.addBlockedDates(
        mentorId,
        dates
      );
      console.log("mentor controller addBlockedDates step 2", blockedDates);
      res.status(201).json(blockedDates);
    } catch (error) {
      res.status(500).json({ message: "Error adding blocked dates", error });
    }
  }

  async removeBlockedDate(req: Request, res: Response) {
    try {
      const blockedDateId = req.params.blockedDateId;
      await this.calendarService.removeBlockedDate(blockedDateId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error removing blocked date", error });
    }
  }
  async isApprovalChecking(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      console.log(
        "mentor controller isApprovalChecking step 1",
        req.params.mentorId
      );
      const mentorId = req.params.mentorId;

      if (!mentorId) {
        res.status(400).json({ message: "Mentor ID is required" });
        return;
      }
      console.log("mentor controller isApprovalChecking step 2", mentorId);
      const response = await this.MentorProfileService.isApprovalChecking(
        mentorId
      );
      console.log("mentor controller isApprovalChecking step 3", response);
      res
        .status(200)
        .json(new ApiResponse(200, response, "Approval status fetched"));
    } catch (error) {
      console.log("mentor controller isApprovalChecking step 4: Error");
      next(error);
    }
  }

  // mentorController.ts
  public assignScheduleToService = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("assignScheduleToService controller step 1");
      const serviceId = req.params.serviceId;
      const { scheduleId } = req.body;

      if (!serviceId || !scheduleId) {
        console.log(
          "assignScheduleToService controller step 2: Missing fields"
        );
        throw new ApiError(400, "Service ID and Schedule ID are required");
      }

      console.log("assignScheduleToService controller step 3", {
        serviceId,
        scheduleId,
      });
      const updatedService =
        await this.MentorProfileService.assignScheduleToService(
          serviceId,
          scheduleId
        );

      if (!updatedService) {
        console.log(
          "assignScheduleToService controller step 4: Service not found"
        );
        throw new ApiError(404, "Service not found");
      }

      console.log(
        "assignScheduleToService controller step 5: Service updated",
        updatedService
      );
      res.json(
        new ApiResponse(
          200,
          updatedService,
          "Schedule assigned to service successfully"
        )
      );
    } catch (error) {
      console.log("assignScheduleToService controller step 6: Error", error);
      next(error);
    }
  };
}
export default new mentorController();
