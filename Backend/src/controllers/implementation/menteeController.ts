import { NextFunction, Request, Response } from "express";
import { ApiError } from "../../middlewares/errorHandler";
import ApiResponse from "../../utils/apiResponse";
import UserAuthService from "../../services/implementations/UserAuthService";
import { IUserAuthService } from "../../services/interface/IUserAuthService";
import OTPServices from "../../services/implementations/OTPService";
import { IOTPService } from "../../services/interface/IOTPService";
import { IUserService } from "../../services/interface/IUserService";
import UserService from "../../services/implementations/UserService";
import { IUploadService } from "../../services/interface/IUploadService";
import UploadService from "../../services/implementations/UploadService";
import { IMenteeProfileService } from "../../services/interface/IMenteeService";
import MenteeProfileService from "../../services/implementations/MenteeService";
import { IMentorProfileService } from "../../services/interface/IMentorService";
import MentorProfileService from "../../services/implementations/MentorService";
import BookingService from "../../services/implementations/Bookingservice";
import { IBookingService } from "../../services/interface/IBookingService";
import { IPaymentService } from "../../services/interface/IPaymentService";
import PaymentService from "../../services/implementations/PaymentService";
import CalendarService from "../../services/implementations/CalenderService";
import { ICalendarService } from "../../services/interface/ICalenderService";
import sharp from "sharp";
import stripe from "../../config/stripe";
import { HttpStatus } from "../../constants/HttpStatus";

class menteeController {
  private userAuthService: IUserAuthService;
  private OTPServices: IOTPService;
  private userService: IUserService;
  private uploadService: IUploadService;
  private MenteeProfileService: IMenteeProfileService;
  private MentorProfileService: IMentorProfileService;
  private bookingService: IBookingService;
  private PaymentService: IPaymentService;
  private CalendarService: ICalendarService;
  private options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: 1000 * 60 * 60 * 24 * 2,
  };

  constructor() {
    this.userAuthService = new UserAuthService();
    this.OTPServices = new OTPServices();
    this.userService = new UserService();
    this.uploadService = new UploadService();
    this.MenteeProfileService = new MenteeProfileService();
    this.MentorProfileService = new MentorProfileService();
    this.bookingService = new BookingService();
    this.PaymentService = new PaymentService();
    this.CalendarService = new CalendarService();
  }

  public getBookings = async (
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const menteeId = req.user?.id;
      if (!menteeId) {
        throw new ApiError(HttpStatus.UNAUTHORIZED, "User ID is required");
      }

      const bookings = await this.bookingService.getBookingsByMentee(menteeId);
      console.log("MenteeController getBookings step 2", { bookings });
      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            bookings,
            "Bookings fetched successfully"
          )
        );
    } catch (error) {
      next(error);
    }
  };

  public uploadWelcomeForm = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.body?.id;
      if (!userId) {
        throw new ApiError(HttpStatus.BAD_REQUEST, "User ID is required");
      }
      const response = await this.MenteeProfileService.welcomeData(
        req.body,
        userId
      );
      console.log("MenteeController uploadWelcomeForm step 2", { response });
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
      next(error);
    }
  };

  public uploadProfileImage = async (
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = req.user?.id;
      if (!id) {
        throw new ApiError(HttpStatus.UNAUTHORIZED, "User ID is required");
      }

      const imageFile = req.file;
      if (!imageFile) {
        throw new ApiError(HttpStatus.BAD_REQUEST, "No file uploaded");
      }

      const resizedImageBuffer = await sharp(imageFile.path)
        .resize({ width: 1024 })
        .toBuffer();

      const result = await this.uploadService.updateProfileImage(
        { ...imageFile, buffer: resizedImageBuffer },
        id
      );

      console.log("MenteeController uploadProfileImage step 2", { result });

      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            { profilePicture: result.url },
            "Profile image uploaded successfully"
          )
        );
    } catch (error) {
      console.error("Error in uploadProfileImage:", error);
      next(error);
    }
  };

  public deleteAccount = async (
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = req.user?.id;
      if (!id) {
        throw new ApiError(HttpStatus.UNAUTHORIZED, "User ID is required");
      }

      const deleted = await this.MenteeProfileService.deleteAccount(id);
      if (!deleted) {
        throw new ApiError(HttpStatus.NOT_FOUND, "User not found");
      }

      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(HttpStatus.OK, null, "Account deleted successfully")
        );
    } catch (error) {
      console.error("Error in deleteAccount:", error);
      next(error);
    }
  };

  public profileData = async (
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = req?.user?.id;
      if (!id) {
        throw new ApiError(HttpStatus.BAD_REQUEST, "User ID is required");
      }
      console.log("MenteeController profileData step 1", { id });

      const response = await this.MenteeProfileService.userProfielData(id);
      if (!response) {
        throw new ApiError(HttpStatus.NOT_FOUND, "User not found");
      }
      console.log("MenteeController profileData step 2", { response });

      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            response,
            "Profile data fetched successfully"
          )
        );
    } catch (error) {
      console.error("Error in profileData:", error);
      next(error);
    }
  };

  public getAllMentors = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { role, page = "1", limit = "12", searchQuery } = req.query;
      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);
      console.log("MenteeController getAllMentors step 1", {
        role,
        pageNum,
        limitNum,
        searchQuery,
      });

      const mentorsData = await this.MenteeProfileService.getAllMentors(
        pageNum,
        limitNum,
        role as string,
        searchQuery as string
      );
      console.log("MenteeController getAllMentors step 2", { mentorsData });

      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            mentorsData,
            "Mentors fetched successfully"
          )
        );
    } catch (error: any) {
      console.error("Error in getAllMentors:", error);
      next(error);
    }
  };

  public getMentorById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        throw new ApiError(HttpStatus.BAD_REQUEST, "Mentor ID is required");
      }
      console.log("MenteeController getMentorById step 1", { id });

      const mentor = await this.MenteeProfileService.getMentorById(id);
      if (!mentor) {
        throw new ApiError(HttpStatus.NOT_FOUND, "Mentor not found");
      }
      console.log("MenteeController getMentorById step 2", { mentor });

      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(HttpStatus.OK, mentor, "Mentor fetched successfully")
        );
    } catch (error: any) {
      console.error("Error in getMentorById:", error);
      next(error);
    }
  };

  public getAllTutorials = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { type, searchQuery, page = "1", limit = "12" } = req.query;
      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);
      console.log("MenteeController getAllTutorials step 1", {
        type,
        searchQuery,
        pageNum,
        limitNum,
      });

      const { tutorials, total } =
        await this.bookingService.getAllVideoTutorials(
          type as string,
          searchQuery as string,
          pageNum,
          limitNum
        );
      console.log("MenteeController getAllTutorials step 2", {
        tutorials,
        total,
      });

      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            { tutorials, total },
            "Video tutorials fetched successfully"
          )
        );
    } catch (error: any) {
      console.log("Error in getAllTutorials error ", error);
      next(error);
    }
  };

  public getTutorialById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        throw new ApiError(HttpStatus.BAD_REQUEST, "Tutorial ID is required");
      }
      console.log("MenteeController getTutorialById step 1", { id });

      const tutorial = await this.bookingService.getTutorialById(id);
      if (!tutorial) {
        throw new ApiError(HttpStatus.NOT_FOUND, "Tutorial not found");
      }
      console.log("MenteeController getTutorialById step 2", { tutorial });

      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            tutorial,
            "Tutorial fetched successfully"
          )
        );
    } catch (error: any) {
      console.error("Error in getAllTutorials:", error);
      next(error);
    }
  };

  public checkBookingStatus = async (
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { serviceId } = req.params;
      const menteeId = req.user?.id;
      if (!menteeId) {
        throw new ApiError(HttpStatus.UNAUTHORIZED, "User ID is required");
      }
      if (!serviceId) {
        throw new ApiError(HttpStatus.BAD_REQUEST, "Service ID is required");
      }
      console.log("MenteeController checkBookingStatus step 1", {
        menteeId,
        serviceId,
      });

      const isBooked = await this.bookingService.checkBookingStatus(
        menteeId,
        serviceId
      );
      console.log("MenteeController checkBookingStatus step 2", { isBooked });

      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            { isBooked },
            "Booking status checked successfully"
          )
        );
    } catch (error: any) {
      console.error("Error in checkBookingStatus:", error);
      next(error);
    }
  };

  public initiatePayment = async (
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { serviceId, amount } = req.body;
      const menteeId = req.user?.id;
      if (!menteeId) {
        throw new ApiError(HttpStatus.UNAUTHORIZED, "User ID is required");
      }
      if (!serviceId || !amount) {
        throw new ApiError(
          HttpStatus.BAD_REQUEST,
          "Service ID and amount are required"
        );
      }
      const tutorial = await this.bookingService.getTutorialById(serviceId);
      if (!tutorial) {
        throw new ApiError(HttpStatus.NOT_FOUND, "Tutorial not found");
      }
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "inr",
              product_data: {
                name: tutorial.title,
              },
              unit_amount: amount * 100,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.CLIENT_URL}/digitalcontent/${serviceId}?payment=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_URL}/digitalcontent/${serviceId}?payment=cancel`,
        metadata: { menteeId, serviceId },
      });
      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            { sessionId: session.id, url: session.url },
            "Payment session created successfully"
          )
        );
    } catch (error: any) {
      console.error("Error in initiatePayment:", error);
      next(error);
    }
  };

  public bookService = async (
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { serviceId, mentorId, sessionId } = req.body;
      const menteeId = req.user?.id;
      if (!menteeId) {
        throw new ApiError(HttpStatus.UNAUTHORIZED, "User ID is required");
      }
      if (!serviceId || !mentorId || !sessionId) {
        throw new ApiError(
          HttpStatus.BAD_REQUEST,
          "Service ID, mentor ID, and session ID are required"
        );
      }
      const booking = await this.bookingService.bookService({
        serviceId,
        mentorId,
        menteeId,
        sessionId,
      });
      console.log("MenteeController bookService step 2", { booking });

      res
        .status(HttpStatus.CREATED)
        .json(
          new ApiResponse(
            HttpStatus.CREATED,
            booking,
            "Service booked successfully"
          )
        );
    } catch (error: any) {
      console.error("Error in bookService:", error);
      next(error);
    }
  };

  public getVideoUrl = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      let { key } = req.params;
      if (!key) {
        throw new ApiError(HttpStatus.BAD_REQUEST, "Video key is required");
      }

      // Decode and validate key
      key = decodeURIComponent(key);
      console.log("Received key:", key);
      const bucketUrl = "https://mentorone-app.s3.ap-south-1.amazonaws.com/";
      if (key.startsWith(bucketUrl)) {
        key = key.replace(bucketUrl, "");
        console.log("Stripped key:", key);
      }
      if (key.includes("http://") || key.includes("https://")) {
        throw new ApiError(
          HttpStatus.BAD_REQUEST,
          "Invalid key: Provide S3 object key, not full URL"
        );
      }

      const url = await this.uploadService.S3generatePresignedUrlForGet(key);
      console.log("MenteeController getVideoUrl step 2", { url });

      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            { url },
            "Video URL generated successfully"
          )
        );
    } catch (error: any) {
      console.error("Error in getVideoUrl:", error);
      next(error);
    }
  };

  public getAllMenteePayments = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log("paymentcontroller getAllMenteePayments step 1");
      const menteeId = req.user?.id;
      const { page = 1, limit = 12 } = req.query;
      console.log(
        "paymentcontroller getAllMenteePayments step 1.5",
        page,
        limit
      );
      if (!menteeId) {
        throw new ApiError(HttpStatus.UNAUTHORIZED, "User ID is required");
      }

      const paymentData = await this.PaymentService.getAllMenteePayments(
        menteeId.toString(),
        Number(page),
        Number(limit)
      );
      console.log("paymentcontroller getAllMenteePayments step 2", paymentData);

      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            paymentData,
            "Mentee payments fetched successfully"
          )
        );
    } catch (error) {
      console.error("Error in getAllMenteePayments controller:", error);
      next(error);
    }
  };
  public getDocumentUrl = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { serviceId } = req.params;
      if (!serviceId) {
        throw new ApiError(HttpStatus.BAD_REQUEST, "Service ID is required");
      }

      // Fetch the Service document via BookingService
      const service = await this.bookingService.getServiceById(serviceId);
      if (!service) {
        throw new ApiError(HttpStatus.NOT_FOUND, "Service not found");
      }
      if (
        service.type !== "DigitalProducts" ||
        service.digitalProductType !== "documents"
      ) {
        throw new ApiError(HttpStatus.BAD_REQUEST, "Service is not a document");
      }
      if (!service.fileUrl) {
        throw new ApiError(
          HttpStatus.NOT_FOUND,
          "PDF file URL not found for this service"
        );
      }

      // Use fileUrl as the S3 key
      const pdfKey = service.fileUrl.startsWith(
        "https://mentorone-app.s3.ap-south-1.amazonaws.com/"
      )
        ? service.fileUrl.replace(
            "https://mentorone-app.s3.ap-south-1.amazonaws.com/",
            ""
          )
        : service.fileUrl;

      // Generate presigned URL
      const presignedUrl =
        await this.uploadService.S3generatePresignedUrlForGet(pdfKey);
      console.log("MenteeController getDocumentUrl step 2", { presignedUrl });

      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            { url: presignedUrl },
            "Presigned URL generated successfully"
          )
        );
    } catch (error: any) {
      console.error("Error in getDocumentUrl:", error);
      next(error);
    }
  };

  // menteeController.ts
  public getMentorSchedule = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        throw new ApiError(HttpStatus.BAD_REQUEST, "Mentor ID is required");
      }
      console.log("Mnetee contoller getMentorSchedule step 1", id);

      const schedule = await this.MentorProfileService.getMentorSchedule(id);
      if (!schedule) {
        throw new ApiError(404, "Schedule not found for this mentor");
      }
      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            schedule,
            "Mentor schedule fetched successfully"
          )
        );
    } catch (error) {
      next(error);
    }
  };

  public getMentorBlockedDates = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        throw new ApiError(HttpStatus.BAD_REQUEST, "Mentor ID is required");
      }
      const blockedDates =
        await this.MentorProfileService.getMentorBlockedDates(id);
      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            blockedDates,
            "Mentor blocked dates fetched successfully"
          )
        );
    } catch (error) {
      next(error);
    }
  };

  // controllers/implementation/menteeController.ts
  public createPriorityDM = async (
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const menteeId = req.user?.id;
      if (!menteeId) {
        throw new ApiError(HttpStatus.UNAUTHORIZED, "User ID is required");
      }

      const { serviceId, bookingId, content, pdfFiles } = req.body;
      if (!serviceId || !content) {
        throw new ApiError(
          HttpStatus.BAD_REQUEST,
          "Service ID and content are required"
        );
      }
      console.log("MenteeController createPriorityDM step 1", {
        menteeId,
        serviceId,
        bookingId,
      });
      const priorityDM = await this.MenteeProfileService.createPriorityDM({
        serviceId,
        bookingId,
        menteeId,
        content,
        pdfFiles,
      });

      res
        .status(HttpStatus.CREATED)
        .json(
          new ApiResponse(
            HttpStatus.CREATED,
            priorityDM,
            "Priority DM created successfully"
          )
        );
    } catch (error) {
      next(error);
    }
  };

  public getPriorityDMs = async (
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const menteeId = req.user?.id;
      if (!menteeId) {
        throw new ApiError(HttpStatus.UNAUTHORIZED, "User ID is required");
      }
      const { bookingId } = req.params;
      if (!bookingId) {
        throw new ApiError(HttpStatus.BAD_REQUEST, "Booking ID is required");
      }
      console.log("Mentee controller getPriorityDMs step 2", bookingId);
      const priorityDMs = await this.MenteeProfileService.getPriorityDMs(
        bookingId,
        menteeId
      );
      console.log("Mentee controller getPriorityDMs step 3", priorityDMs);
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
      next(error);
    }
  };

  public getMentorPolicy = async (
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const mentorId = req.params.mentorId;
      if (!mentorId) {
        throw new ApiError(HttpStatus.BAD_REQUEST, "Mentor ID is required");
      }
      console.log("Mentee controller getMentorPolicy step 1", mentorId);
      const response = await this.CalendarService.getMentorPolicy(mentorId);
      if (!response) {
        throw new ApiError(HttpStatus.NOT_FOUND, "Mentor policy not found");
      }
      console.log("Mentee controller getMentorPolicy step 2", response);
      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            response,
            "Mentor policy fetched successfully"
          )
        );
    } catch (error) {
      next(error);
    }
  };

  public getDashboardData = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("MenteeController getDashboardData step 1");
      const dashboardData = await this.MenteeProfileService.getDashboardData();
      console.log("MenteeController getDashboardData step 2", {
        dashboardData,
      });

      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            dashboardData,
            "Dashboard data fetched successfully"
          )
        );
    } catch (error: any) {
      next(error);
    }
  };

  // New method to fetch all services
  public getAllServices = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const {
        type,
        searchQuery,
        page = "1",
        limit = "12",
        oneToOneType,
        digitalProductType,
      } = req.query;
      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);
      const servicesData = await this.bookingService.getAllServices(
        pageNum,
        limitNum,
        type as string,
        searchQuery as string,
        oneToOneType as string,
        digitalProductType as string
      );
      console.log("MenteeController getAllServices step 2", { servicesData });
      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            servicesData,
            "Services fetched successfully"
          )
        );
    } catch (error: any) {
      next(error);
    }
  };
}

export default new menteeController();
