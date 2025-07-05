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
// import { IMentorProfileService } from "../../services/interface/IMentorService";
// import MentorProfileService from "../../services/implementations/MentorService";
// import { ICalendarService } from "../../services/interface/ICalenderService";
// import CalendarService from "../../services/implementations/CalenderService";
// import { HttpStatus } from "../../constants/HttpStatus";

// class mentorController {
//   private userAuthService: IUserAuthService;
//   private OTPServices: IOTPService;
//   private userService: IUserService;
//   private uploadService: IUploadService;
//   private MentorProfileService: IMentorProfileService;
//   private calendarService: ICalendarService;

//   private options = {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "strict" as const,
//     maxAge: 1000 * 60 * 60 * 24 * 2, // 2 days
//   };

//   constructor() {
//     this.userAuthService = new UserAuthService();
//     this.OTPServices = new OTPServices();
//     this.userService = new UserService();
//     this.uploadService = new UploadService();
//     this.MentorProfileService = new MentorProfileService();
//     this.calendarService = new CalendarService();
//   }

//   public uploadWelcomeForm = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       console.log("uploadWelcomeForm step 1");

//       console.log(req.body);

//       const userId = req.body?.id; // Assuming `req.user` contains the authenticated user's details
//       if (!userId) {
//         throw new ApiError(HttpStatus.BAD_REQUEST, "User ID is required");
//       }

//       const response = await this.MentorProfileService.welcomeData(
//         req.body,
//         userId
//       );

//       res
//         .status(HttpStatus.OK)
//         .json(
//           new ApiResponse(
//             HttpStatus.OK,
//             response,
//             "Welcome form uploaded successfully"
//           )
//         );
//     } catch (error) {
//       console.log("auth controller reset password catch error  ");
//       next(error);
//     }
//   };

//   public getProfileData = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       console.log("getprofile controller ", req.params);
//       const userId = req.params.id;
//       if (!userId) {
//         throw new ApiError(HttpStatus.BAD_REQUEST, "User ID is required");
//       }
//       const response = await this.MentorProfileService.profileDatas(userId);
//       if (!response) {
//         throw new ApiError(HttpStatus.NOT_FOUND, "Profile not found");
//       }
//       res
//         .status(HttpStatus.OK)
//         .json(
//           new ApiResponse(
//             HttpStatus.OK,
//             response,
//             "Mentor profile fetched successfully"
//           )
//         );
//     } catch (error) {
//       console.log("mentor controller getprofile error  ", error);
//       next(error);
//     }
//   };

//   public createService = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       console.log("MentorController createService step 1", { body: req.body });
//       const userId = req.user?.id;
//       if (!userId) {
//         throw new ApiError(HttpStatus.UNAUTHORIZED, "User ID is required");
//       }
//       const formData = { ...req.body, mentorId: userId };
//       const newService = await this.MentorProfileService.createService(
//         formData
//       );
//       console.log("MentorController createService step 2", { newService });

//       res
//         .status(HttpStatus.CREATED)
//         .json(
//           new ApiResponse(
//             HttpStatus.CREATED,
//             newService,
//             "Service created successfully"
//           )
//         );
//     } catch (error) {
//       console.log("createService controller step 4");
//       next(error);
//     }
//   };

//   public generatePresignedUrl = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       console.log("generatePresignedUrl controller step 1");

//       const { fileName, fileType, folder } = req.query as {
//         fileName: string;
//         fileType: string;
//         folder: string;
//       };
//       console.log("generatePresignedUrl controller step 2");
//       if (!fileName || !fileType || !folder) {
//         throw new ApiError(
//           HttpStatus.BAD_REQUEST,
//           "Missing fileName, fileType, or folder parameter"
//         );
//       }

//       console.log("generatePresignedUrl controller step 4");
//       const url = await this.uploadService.S3generatePresignedUrl(
//         fileName,
//         fileType,
//         folder
//       );
//       console.log("MentorController generatePresignedUrl step 2", { url });

//       res
//         .status(HttpStatus.OK)
//         .json(
//           new ApiResponse(
//             HttpStatus.OK,
//             { url },
//             "Presigned URL generated successfully"
//           )
//         );
//     } catch (error) {
//       console.log("generatePresignedUrl controller step 6");
//       next(error);
//     }
//   };

//   public getPresignedUrl = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       console.log("getPresignedUrl ocntroller step 1");

//       const { key } = req.query as { key: string };
//       console.log("getPresignedUrl ocntroller step 2");
//       if (!key) {
//         throw new ApiError(HttpStatus.BAD_REQUEST, "Missing key parameter");
//       }
//       const url = await this.uploadService.S3generatePresignedUrlForGet(key);
//       console.log("MentorController getPresignedUrl step 2", { url });

//       res
//         .status(HttpStatus.OK)
//         .json(
//           new ApiResponse(
//             HttpStatus.OK,
//             { url },
//             "Presigned URL fetched successfully"
//           )
//         );
//     } catch (error) {
//       console.log("getPresignedUrl ocntroller step 6");
//       next(error);
//     }
//   };

//   public getAllServices = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       console.log("MentorController getAllServices step 1", {
//         query: req.query,
//       });
//       const userId = req.user?.id;
//       if (!userId) {
//         throw new ApiError(HttpStatus.UNAUTHORIZED, "User ID is required");
//       }

//       const { page = "1", limit = "8", search = "", type } = req.query;
//       const servicesData = await this.MentorProfileService.getAllServices(
//         userId,
//         {
//           page: parseInt(page as string, 10),
//           limit: parseInt(limit as string, 10),
//           search: search as string,
//           type: type as string,
//         }
//       );
//       console.log("MentorController getAllServices step 2", { servicesData });

//       res
//         .status(HttpStatus.OK)
//         .json(
//           new ApiResponse(
//             HttpStatus.OK,
//             servicesData,
//             "Services fetched successfully"
//           )
//         );
//     } catch (error) {
//       console.log("getAllServices controller step 4");
//       next(error);
//     }
//   };
//   // New methods
//   public getServiceById = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       console.log("MentorController getServiceById step 1", {
//         params: req.params,
//       });
//       const serviceId = req.params.id;
//       if (!serviceId) {
//         throw new ApiError(HttpStatus.BAD_REQUEST, "Service ID is required");
//       }

//       const service = await this.MentorProfileService.getServiceById(serviceId);
//       if (!service) {
//         throw new ApiError(HttpStatus.NOT_FOUND, "Service not found");
//       }
//       console.log("MentorController getServiceById step 2", { service });

//       res
//         .status(HttpStatus.OK)
//         .json(
//           new ApiResponse(
//             HttpStatus.OK,
//             service,
//             "Service fetched successfully"
//           )
//         );
//     } catch (error) {
//       console.log("getServiceById controller step 4");
//       next(error);
//     }
//   };

//   public updateService = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       console.log("MentorController updateService step 1", {
//         params: req.params,
//         body: req.body,
//       });
//       const serviceId = req.params.id;
//       if (!serviceId) {
//         throw new ApiError(HttpStatus.BAD_REQUEST, "Service ID is required");
//       }

//       const formData: { [key: string]: any } = { ...req.body };
//       if (req.files && Array.isArray(req.files)) {
//         req.files.forEach((file: Express.MulterS3.File) => {
//           formData[file.fieldname] = file;
//           if (file.location) {
//             formData[`${file.fieldname}_url`] = file.location;
//           }
//         });
//       }

//       const updatedService = await this.MentorProfileService.updateService(
//         serviceId,
//         formData
//       );
//       console.log("MentorController updateService step 2", { updatedService });

//       res
//         .status(HttpStatus.OK)
//         .json(
//           new ApiResponse(
//             HttpStatus.OK,
//             updatedService,
//             "Service updated successfully"
//           )
//         );
//     } catch (error) {
//       console.log("updateService controller step 4");
//       next(error);
//     }
//   };
//   public getMentorCalendar = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       console.log("MentorController getMentorCalendar step 1", {
//         params: req.params,
//       });
//       const mentorId = req.params.mentorId;
//       if (!mentorId) {
//         throw new ApiError(HttpStatus.BAD_REQUEST, "Mentor ID is required");
//       }

//       const calendar = await this.calendarService.getMentorCalendar(mentorId);
//       if (!calendar) {
//         throw new ApiError(HttpStatus.NOT_FOUND, "Calendar not found");
//       }
//       console.log("MentorController getMentorCalendar step 2", { calendar });

//       res
//         .status(HttpStatus.OK)
//         .json(
//           new ApiResponse(
//             HttpStatus.OK,
//             calendar,
//             "Mentor calendar fetched successfully"
//           )
//         );
//     } catch (error) {
//       console.error("Error in getMentorCalendar:", error);
//       next(error);
//     }
//   };

//   public updatePolicy = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       console.log("MentorController updatePolicy step 1", {
//         params: req.params,
//         body: req.body,
//       });
//       const mentorId = req.params.mentorId;
//       if (!mentorId) {
//         throw new ApiError(HttpStatus.BAD_REQUEST, "Mentor ID is required");
//       }

//       const policyData = req.body;
//       const updatedPolicy = await this.calendarService.updatePolicy(
//         mentorId,
//         policyData
//       );
//       console.log("MentorController updatePolicy step 2", { updatedPolicy });

//       res
//         .status(HttpStatus.OK)
//         .json(
//           new ApiResponse(
//             HttpStatus.OK,
//             updatedPolicy,
//             "Policy updated successfully"
//           )
//         );
//     } catch (error) {
//       console.error("Error in updatePolicy:", error);
//       next(error);
//     }
//   };

//   public createSchedule = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       console.log("MentorController createSchedule step 1", {
//         params: req.params,
//         body: req.body,
//       });
//       const mentorId = req.params.mentorId;
//       if (!mentorId) {
//         throw new ApiError(HttpStatus.BAD_REQUEST, "Mentor ID is required");
//       }

//       const scheduleData = req.body;
//       const newSchedule = await this.calendarService.createSchedule(
//         mentorId,
//         scheduleData
//       );
//       console.log("MentorController createSchedule step 2", { newSchedule });

//       res
//         .status(HttpStatus.CREATED)
//         .json(
//           new ApiResponse(
//             HttpStatus.CREATED,
//             newSchedule,
//             "Schedule created successfully"
//           )
//         );
//     } catch (error) {
//       console.error("Error in createSchedule:", error);
//       next(error);
//     }
//   };

//   public updateSchedule = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       console.log("MentorController updateSchedule step 1", {
//         params: req.params,
//         body: req.body,
//       });
//       const scheduleId = req.params.scheduleId;
//       if (!scheduleId) {
//         throw new ApiError(HttpStatus.BAD_REQUEST, "Schedule ID is required");
//       }

//       const scheduleData = req.body;
//       const updatedSchedule = await this.calendarService.updateSchedule(
//         scheduleId,
//         scheduleData
//       );
//       console.log("MentorController updateSchedule step 2", {
//         updatedSchedule,
//       });

//       res
//         .status(HttpStatus.OK)
//         .json(
//           new ApiResponse(
//             HttpStatus.OK,
//             updatedSchedule,
//             "Schedule updated successfully"
//           )
//         );
//     } catch (error) {
//       console.error("Error in updateSchedule:", error);
//       next(error);
//     }
//   };

//   public deleteSchedule = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       console.log("MentorController deleteSchedule step 1", {
//         params: req.params,
//       });
//       const scheduleId = req.params.scheduleId;
//       if (!scheduleId) {
//         throw new ApiError(HttpStatus.BAD_REQUEST, "Schedule ID is required");
//       }

//       await this.calendarService.deleteSchedule(scheduleId);
//       console.log("MentorController deleteSchedule step 2");

//       res
//         .status(HttpStatus.OK)
//         .json(
//           new ApiResponse(HttpStatus.OK, null, "Schedule deleted successfully")
//         );
//     } catch (error) {
//       console.error("Error in deleteSchedule:", error);
//       next(error);
//     }
//   };

//   public addBlockedDates = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       console.log("MentorController addBlockedDates step 1", {
//         params: req.params,
//         body: req.body,
//       });
//       const mentorId = req.params.mentorId;
//       const { dates } = req.body;
//       if (!mentorId || !dates) {
//         throw new ApiError(
//           HttpStatus.BAD_REQUEST,
//           "Mentor ID and dates are required"
//         );
//       }

//       const blockedDates = await this.calendarService.addBlockedDates(
//         mentorId,
//         dates
//       );
//       console.log("MentorController addBlockedDates step 2", { blockedDates });

//       res
//         .status(HttpStatus.CREATED)
//         .json(
//           new ApiResponse(
//             HttpStatus.CREATED,
//             blockedDates,
//             "Blocked dates added successfully"
//           )
//         );
//     } catch (error) {
//       console.error("Error in addBlockedDates:", error);
//       next(error);
//     }
//   };

//   public removeBlockedDate = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       console.log("MentorController removeBlockedDate step 1", {
//         params: req.params,
//       });
//       const blockedDateId = req.params.blockedDateId;
//       if (!blockedDateId) {
//         throw new ApiError(
//           HttpStatus.BAD_REQUEST,
//           "Blocked date ID is required"
//         );
//       }

//       await this.calendarService.removeBlockedDate(blockedDateId);
//       console.log("MentorController removeBlockedDate step 2");

//       res
//         .status(HttpStatus.OK)
//         .json(
//           new ApiResponse(
//             HttpStatus.OK,
//             null,
//             "Blocked date removed successfully"
//           )
//         );
//     } catch (error) {
//       console.error("Error in removeBlockedDate:", error);
//       next(error);
//     }
//   };
//   public isApprovalChecking = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       console.log("MentorController isApprovalChecking step 1", {
//         params: req.params,
//       });
//       const mentorId = req.params.mentorId;
//       if (!mentorId) {
//         throw new ApiError(HttpStatus.BAD_REQUEST, "Mentor ID is required");
//       }

//       const response = await this.MentorProfileService.isApprovalChecking(
//         mentorId
//       );
//       console.log("MentorController isApprovalChecking step 2", { response });

//       res
//         .status(HttpStatus.OK)
//         .json(
//           new ApiResponse(
//             HttpStatus.OK,
//             response,
//             "Approval status fetched successfully"
//           )
//         );
//     } catch (error) {
//       console.error("Error in isApprovalChecking:", error);
//       next(error);
//     }
//   };

//   public assignScheduleToService = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       console.log("MentorController assignScheduleToService step 1", {
//         params: req.params,
//         body: req.body,
//       });
//       const serviceId = req.params.serviceId;
//       const { scheduleId } = req.body;
//       if (!serviceId || !scheduleId) {
//         throw new ApiError(
//           HttpStatus.BAD_REQUEST,
//           "Service ID and Schedule ID are required"
//         );
//       }

//       const updatedService =
//         await this.MentorProfileService.assignScheduleToService(
//           serviceId,
//           scheduleId
//         );
//       if (!updatedService) {
//         throw new ApiError(HttpStatus.NOT_FOUND, "Service not found");
//       }
//       console.log("MentorController assignScheduleToService step 2", {
//         updatedService,
//       });

//       res
//         .status(HttpStatus.OK)
//         .json(
//           new ApiResponse(
//             HttpStatus.OK,
//             updatedService,
//             "Schedule assigned to service successfully"
//           )
//         );
//     } catch (error) {
//       console.error("Error in assignScheduleToService:", error);
//       next(error);
//     }
//   };

//   public replyToPriorityDM = async (
//     req: Request & { user?: { id: string } },
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       console.log("MentorController replyToPriorityDM step 1", {
//         params: req.params,
//         body: req.body,
//       });
//       const mentorId = req.user?.id;
//       if (!mentorId) {
//         throw new ApiError(HttpStatus.UNAUTHORIZED, "User ID is required");
//       }

//       const { priorityDMId } = req.params;
//       const { content, pdfFiles } = req.body;
//       if (!priorityDMId || !content) {
//         throw new ApiError(
//           HttpStatus.BAD_REQUEST,
//           "Priority DM ID and content are required"
//         );
//       }

//       const updatedDM = await this.MentorProfileService.replyToPriorityDM(
//         priorityDMId,
//         mentorId,
//         { content, pdfFiles }
//       );
//       console.log("MentorController replyToPriorityDM step 2", { updatedDM });

//       res
//         .status(HttpStatus.OK)
//         .json(
//           new ApiResponse(HttpStatus.OK, updatedDM, "Reply sent successfully")
//         );
//     } catch (error) {
//       console.error("Error in replyToPriorityDM:", error);
//       next(error);
//     }
//   };

//   public getPriorityDMs = async (
//     req: Request & { user?: { id: string } },
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       console.log("MentorController getPriorityDMs step 1", {
//         params: req.params,
//       });
//       const mentorId = req.user?.id;
//       if (!mentorId) {
//         throw new ApiError(HttpStatus.UNAUTHORIZED, "User ID is required");
//       }

//       const { serviceId } = req.params;
//       if (!serviceId) {
//         throw new ApiError(HttpStatus.BAD_REQUEST, "Service ID is required");
//       }

//       const priorityDMs = await this.MentorProfileService.getPriorityDMs(
//         serviceId,
//         mentorId
//       );
//       console.log("MentorController getPriorityDMs step 2", { priorityDMs });

//       res
//         .status(HttpStatus.OK)
//         .json(
//           new ApiResponse(
//             HttpStatus.OK,
//             priorityDMs,
//             "Priority DMs fetched successfully"
//           )
//         );
//     } catch (error) {
//       console.error("Error in getPriorityDMs:", error);
//       next(error);
//     }
//   };

//   public getAllPriorityDMsByMentor = async (
//     req: Request & { user?: { id: string } },
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       const mentorId = req.user?.id;
//       if (!mentorId) {
//         throw new ApiError(HttpStatus.UNAUTHORIZED, "User ID is required");
//       }

//       // Extract query parameters
//       const page = parseInt(req.query.page as string) || 1;
//       const limit = parseInt(req.query.limit as string) || 8;
//       const searchQuery = (req.query.search as string) || "";
//       const status = (req.query.status as "pending" | "replied") || undefined;
//       const sort = (req.query.sort as "asc" | "desc") || undefined;

//       const { priorityDMs, total } =
//         await this.MentorProfileService.getAllPriorityDMsByMentor(
//           mentorId,
//           page,
//           limit,
//           searchQuery,
//           status,
//           sort
//         );

//       res
//         .status(HttpStatus.OK)
//         .json(
//           new ApiResponse(
//             HttpStatus.OK,
//             { priorityDMs, total, page, limit },
//             "All Priority DMs fetched successfully"
//           )
//         );
//     } catch (error) {
//       next(error);
//     }
//   };

//   public updateTopTestimonials = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) => {
//     const { testimonialIds } = req.body;
//     const mentorId = req?.user?.id;
//     console.log(
//       "Mentor controller updateTopTestimonials step 1 mentorId",
//       mentorId
//     );
//     console.log(
//       "Mentor controller updateTopTestimonials step 1.5 testimonialIds",
//       testimonialIds
//     );
//     try {
//       if (!mentorId) {
//         throw new ApiError(HttpStatus.BAD_REQUEST, "Mentor ID is required");
//       }
//       const updatedMentor =
//         await this.MentorProfileService.updateTopTestimonials(
//           mentorId,
//           testimonialIds
//         );
//       console.log(
//         "Mentor controller updateTopTestimonials step 2 updatedMentor",
//         updatedMentor
//       );
//       res
//         .status(HttpStatus.OK)
//         .json(
//           new ApiResponse(
//             HttpStatus.OK,
//             { topTestimonials: updatedMentor.topTestimonials },
//             "Top testimonials updated successfully"
//           )
//         );
//     } catch (error: any) {
//       console.error("Error updating top testimonials:", error);
//       next(error);
//     }
//   };
// }
// export default new mentorController();
