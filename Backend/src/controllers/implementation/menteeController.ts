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
import UploadService from "../../services/implementations/SecureUploadService";
import { IMenteeService } from "../../services/interface/IMenteeService";
import MenteeService from "../../services/implementations/MenteeService";
import { IMentorService } from "../../services/interface/IMentorService";
import MentorService from "../../services/implementations/MentorService";
import BookingService from "../../services/implementations/Bookingservice";
import { IBookingService } from "../../services/interface/IBookingService";
import { IPaymentService } from "../../services/interface/IPaymentService";
import PaymentService from "../../services/implementations/PaymentService";
import CalendarService from "../../services/implementations/CalenderService";
import { ICalendarService } from "../../services/interface/ICalenderService";
import sharp from "sharp";
import stripe from "../../config/stripe";
import { HttpStatus } from "../../constants/HttpStatus";
import VideoSessionService from "../../services/implementations/VideoSessionService";
import SecureUploadService from "../../services/implementations/SecureUploadService";
import videoAccessMiddleware from "../../middlewares/videoAccessMiddleware";
import EnhancedVideoSessionService from "../../services/implementations/VideoSessionService";
import HLSVideoProcessingService from "../../services/implementations/HLSVideoProcessingService";
import CDNService from "../../services/implementations/CDNService";
import SecureVideoProxyService from "../../services/implementations/SecureVideoProxyService";
import VideoSignedUrlService from "../../services/implementations/VideoSignedUrlService";
import SignedUrlService from "../../services/implementations/SignedUrlService";
import MigrationService from "../../services/implementations/MigrationService";

class menteeController {
  private userAuthService: IUserAuthService;
  private OTPServices: IOTPService;
  private userService: IUserService;
  private uploadService: IUploadService;
  private MenteeService: IMenteeService;
  private MentorService: IMentorService;
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
    this.MenteeService = new MenteeService();
    this.MentorService = new MentorService();
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
      const response = await this.MenteeService.welcomeData(req.body, userId);
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

      const deleted = await this.MenteeService.deleteAccount(id);
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

      const response = await this.MenteeService.userProfielData(id);
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

      const mentorsData = await this.MenteeService.getAllMentors(
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

      const mentor = await this.MenteeService.getMentorById(id);
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

  public createPaymentIntent = async (
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { paymentMethodId, amount, currency = 'inr', serviceId } = req.body;
      const menteeId = req.user?.id;

      if (!menteeId) {
        throw new ApiError(HttpStatus.UNAUTHORIZED, "User ID is required");
      }

      if (!amount || amount <= 0) {
        throw new ApiError(HttpStatus.BAD_REQUEST, "Valid amount is required");
      }

      console.log('CreatePaymentIntent:', {
        menteeId: menteeId.substring(0, 8) + "...",
        amount,
        currency,
        serviceId,
        hasPaymentMethod: !!paymentMethodId
      });

      // Validate service if provided
      if (serviceId) {
        const tutorial = await this.bookingService.getTutorialById(serviceId);
        if (!tutorial) {
          throw new ApiError(HttpStatus.NOT_FOUND, "Service not found");
        }
      }

      // Create Payment Intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to smallest currency unit (paise)
        currency: currency.toLowerCase(),
        payment_method: paymentMethodId,
        confirm: paymentMethodId ? true : false,
        confirmation_method: 'manual',
        metadata: {
          menteeId,
          serviceId: serviceId || '',
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      console.log('Payment Intent created:', {
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency
      });

      // Handle different payment intent statuses
      if (paymentIntent.status === 'succeeded') {
        // Payment succeeded immediately
        res.status(HttpStatus.OK).json(
          new ApiResponse(
            HttpStatus.OK,
            {
              success: true,
              paymentIntent: {
                id: paymentIntent.id,
                status: paymentIntent.status,
                amount: paymentIntent.amount,
                currency: paymentIntent.currency,
              },
            },
            "Payment completed successfully"
          )
        );
      } else if (paymentIntent.status === 'requires_action') {
        // Payment requires additional action (3D Secure, etc.)
        res.status(HttpStatus.OK).json(
          new ApiResponse(
            HttpStatus.OK,
            {
              requiresAction: true,
              clientSecret: paymentIntent.client_secret,
              paymentIntent: {
                id: paymentIntent.id,
                status: paymentIntent.status,
              },
            },
            "Payment requires additional authentication"
          )
        );
      } else if (paymentIntent.status === 'requires_payment_method') {
        // Payment method failed, client should provide new payment method
        res.status(HttpStatus.BAD_REQUEST).json(
          new ApiResponse(
            HttpStatus.BAD_REQUEST,
            {
              error: "Payment method failed",
              clientSecret: paymentIntent.client_secret,
            },
            "Payment method was declined"
          )
        );
      } else {
        // Other statuses (requires_confirmation, processing, etc.)
        res.status(HttpStatus.OK).json(
          new ApiResponse(
            HttpStatus.OK,
            {
              clientSecret: paymentIntent.client_secret,
              paymentIntent: {
                id: paymentIntent.id,
                status: paymentIntent.status,
              },
            },
            "Payment intent created"
          )
        );
      }
    } catch (error: any) {
      console.error("Error in createPaymentIntent:", error);
      
      // Handle Stripe-specific errors
      if (error.type === 'StripeCardError') {
        res.status(HttpStatus.BAD_REQUEST).json(
          new ApiResponse(
            HttpStatus.BAD_REQUEST,
            { error: error.message },
            "Card was declined"
          )
        );
      } else {
        next(error);
      }
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

      const schedule = await this.MentorService.getMentorSchedule(id);
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
      const blockedDates = await this.MentorService.getMentorBlockedDates(id);
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
      const priorityDM = await this.MenteeService.createPriorityDM({
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
      const priorityDMs = await this.MenteeService.getPriorityDMs(
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
      const dashboardData = await this.MenteeService.getDashboardData();
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

  public createEnhancedVideoSession = async (
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { serviceId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        throw new ApiError(HttpStatus.UNAUTHORIZED, "User ID is required");
      }

      if (!serviceId) {
        throw new ApiError(HttpStatus.BAD_REQUEST, "Service ID is required");
      }

      console.log("MenteeController createEnhancedVideoSession step 1", {
        userId,
        serviceId,
      });

      // Verify purchase status first
      const hasPurchased = await this.bookingService.checkBookingStatus(
        userId,
        serviceId
      );

      if (!hasPurchased) {
        throw new ApiError(
          HttpStatus.FORBIDDEN,
          "You must purchase this content to access it"
        );
      }

      // Create enhanced video session
      const session = EnhancedVideoSessionService.createSession(
        userId,
        serviceId
      );

      console.log("MenteeController createEnhancedVideoSession step 2", {
        sessionToken: session.sessionToken.substring(0, 8) + "...",
        expiresAt: session.expiresAt,
        heartbeatInterval: session.heartbeatInterval,
      });

      res.status(HttpStatus.OK).json(
        new ApiResponse(
          HttpStatus.OK,
          {
            sessionToken: session.sessionToken,
            expiresAt: session.expiresAt,
            heartbeatInterval: session.heartbeatInterval,
            message: "Enhanced video session created successfully",
          },
          "Enhanced video session created successfully"
        )
      );
    } catch (error: any) {
      console.error("Error in createEnhancedVideoSession:", error);
      next(error);
    }
  };

  public processVideoHeartbeat = async (
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const {
        sessionToken,
        serviceId,
        playerCurrentTime,
        playerDuration,
        playerPaused,
        playerEnded,
      } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        throw new ApiError(HttpStatus.UNAUTHORIZED, "User ID is required");
      }

      if (!sessionToken || !serviceId) {
        throw new ApiError(
          HttpStatus.BAD_REQUEST,
          "Session token and service ID are required"
        );
      }

      console.log("MenteeController processVideoHeartbeat step 1", {
        userId,
        serviceId,
        sessionToken: sessionToken.substring(0, 8) + "...",
        playerCurrentTime,
        playerPaused,
      });

      // Process heartbeat
      const heartbeatResponse = EnhancedVideoSessionService.processHeartbeat(
        sessionToken,
        userId,
        serviceId,
        playerCurrentTime,
        playerDuration
      );

      console.log("MenteeController processVideoHeartbeat step 2", {
        sessionValid: heartbeatResponse.sessionValid,
        requiresRefresh: heartbeatResponse.requiresRefresh,
        timeUntilExpiry:
          Math.round(heartbeatResponse.timeUntilExpiry / 1000 / 60) +
          " minutes",
      });

      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            heartbeatResponse,
            "Heartbeat processed successfully"
          )
        );
    } catch (error: any) {
      console.error("Error in processVideoHeartbeat:", error);
      next(error);
    }
  };

  /**
   * Mark video session as inactive
   */
  public markVideoSessionInactive = async (
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { sessionToken, serviceId } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        throw new ApiError(HttpStatus.UNAUTHORIZED, "User ID is required");
      }

      if (!sessionToken) {
        throw new ApiError(HttpStatus.BAD_REQUEST, "Session token is required");
      }

      console.log("MenteeController markVideoSessionInactive step 1", {
        userId,
        serviceId,
        sessionToken: sessionToken.substring(0, 8) + "...",
      });

      EnhancedVideoSessionService.markSessionInactive(sessionToken);

      console.log("MenteeController markVideoSessionInactive step 2");

      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            { sessionMarkedInactive: true },
            "Session marked as inactive"
          )
        );
    } catch (error: any) {
      console.error("Error in markVideoSessionInactive:", error);
      next(error);
    }
  };

  /**
   * Mark video session as active
   */
  public markVideoSessionActive = async (
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { sessionToken, serviceId } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        throw new ApiError(HttpStatus.UNAUTHORIZED, "User ID is required");
      }

      if (!sessionToken) {
        throw new ApiError(HttpStatus.BAD_REQUEST, "Session token is required");
      }

      console.log("MenteeController markVideoSessionActive step 1", {
        userId,
        serviceId,
        sessionToken: sessionToken.substring(0, 8) + "...",
      });

      EnhancedVideoSessionService.markSessionActive(sessionToken);

      console.log("MenteeController markVideoSessionActive step 2");

      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            { sessionMarkedActive: true },
            "Session marked as active"
          )
        );
    } catch (error: any) {
      console.error("Error in markVideoSessionActive:", error);
      next(error);
    }
  };

  /**
   * Get enhanced secure video URL (using Enhanced Video Session Service)
   */
  public getEnhancedSecureVideoUrl = async (
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      let { key } = req.params;
      const { sessionToken, serviceId } = req.query;
      const userId = req.user?.id;

      if (!userId) {
        throw new ApiError(HttpStatus.UNAUTHORIZED, "User ID is required");
      }

      if (!key) {
        throw new ApiError(HttpStatus.BAD_REQUEST, "Video key is required");
      }

      if (!sessionToken || !serviceId) {
        throw new ApiError(
          HttpStatus.BAD_REQUEST,
          "Session token and service ID are required"
        );
      }

      console.log("MenteeController getEnhancedSecureVideoUrl step 1", {
        userId,
        serviceId,
        sessionToken: (sessionToken as string).substring(0, 8) + "...",
        key: key.substring(0, 20) + "...",
      });

      // Validate session using Enhanced Service
      const isValidSession = EnhancedVideoSessionService.validateSession(
        sessionToken as string,
        userId,
        serviceId as string
      );

      if (!isValidSession) {
        throw new ApiError(
          HttpStatus.UNAUTHORIZED,
          "Invalid or expired video session. Please refresh the page."
        );
      }

      // Decode and validate key
      key = decodeURIComponent(key);
      const bucketUrl = "https://mentorone-app.s3.ap-south-1.amazonaws.com/";
      if (key.startsWith(bucketUrl)) {
        key = key.replace(bucketUrl, "");
      }

      if (key.includes("http://") || key.includes("https://")) {
        throw new ApiError(
          HttpStatus.BAD_REQUEST,
          "Invalid key: Provide S3 object key, not full URL"
        );
      }

      // Generate secure URL using SecureUploadService
      const secureUploadService = new SecureUploadService();
      const secureUrl = await secureUploadService.generateSecureVideoUrl(
        key,
        userId,
        serviceId as string,
        sessionToken as string
      );

      console.log("MenteeController getEnhancedSecureVideoUrl step 2", {
        urlGenerated: true,
        expiresAt: secureUrl.expiresAt,
      });

      res.status(HttpStatus.OK).json(
        new ApiResponse(
          HttpStatus.OK,
          {
            url: secureUrl.url,
            expiresAt: secureUrl.expiresAt,
            sessionToken: secureUrl.sessionToken,
          },
          "Enhanced secure video URL generated successfully"
        )
      );
    } catch (error: any) {
      console.error("Error in getEnhancedSecureVideoUrl:", error);
      next(error);
    }
  };

  /**
   * Refresh video session (Enhanced)
   */
  public refreshVideoSession = async (
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { sessionToken } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        throw new ApiError(HttpStatus.UNAUTHORIZED, "User ID is required");
      }

      if (!sessionToken) {
        throw new ApiError(HttpStatus.BAD_REQUEST, "Session token is required");
      }

      console.log("MenteeController refreshVideoSession step 1", {
        userId,
        sessionToken: sessionToken.substring(0, 8) + "...",
      });

      const refreshResult =
        EnhancedVideoSessionService.refreshSession(sessionToken);

      if (!refreshResult) {
        throw new ApiError(
          HttpStatus.BAD_REQUEST,
          "Cannot refresh session. Session may be invalid, expired, or refresh limit reached."
        );
      }

      console.log("MenteeController refreshVideoSession step 2", {
        newToken: refreshResult.sessionToken.substring(0, 8) + "...",
        expiresAt: refreshResult.expiresAt,
      });

      res.status(HttpStatus.OK).json(
        new ApiResponse(
          HttpStatus.OK,
          {
            sessionToken: refreshResult.sessionToken,
            expiresAt: refreshResult.expiresAt,
            sessionRefreshed: true,
          },
          "Video session refreshed successfully"
        )
      );
    } catch (error: any) {
      console.error("Error in refreshVideoSession:", error);
      next(error);
    }
  };

  /**
   * Get session status and statistics
   */
  public getVideoSessionStatus = async (
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { sessionToken } = req.query;
      const userId = req.user?.id;

      if (!userId) {
        throw new ApiError(HttpStatus.UNAUTHORIZED, "User ID is required");
      }

      if (!sessionToken) {
        throw new ApiError(HttpStatus.BAD_REQUEST, "Session token is required");
      }

      console.log("MenteeController getVideoSessionStatus step 1", {
        userId,
        sessionToken: (sessionToken as string).substring(0, 8) + "...",
      });

      const sessionInfo = EnhancedVideoSessionService.getSessionInfo(
        sessionToken as string
      );

      if (!sessionInfo) {
        throw new ApiError(HttpStatus.NOT_FOUND, "Session not found");
      }

      // Calculate time until expiry
      const timeUntilExpiry =
        new Date(sessionInfo.expiresAt!).getTime() - Date.now();
      const sessionStats = EnhancedVideoSessionService.getActiveSessionsCount();

      console.log("MenteeController getVideoSessionStatus step 2", {
        sessionExists: true,
        timeUntilExpiry: Math.round(timeUntilExpiry / 1000 / 60) + " minutes",
      });

      res.status(HttpStatus.OK).json(
        new ApiResponse(
          HttpStatus.OK,
          {
            sessionInfo: {
              ...sessionInfo,
              timeUntilExpiry,
            },
            systemStats: sessionStats,
          },
          "Session status retrieved successfully"
        )
      );
    } catch (error: any) {
      console.error("Error in getVideoSessionStatus:", error);
      next(error);
    }
  };
  /**
   * Get secure video URL with session validation
   */
  public getSecureVideoUrl = async (
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      let { key } = req.params;
      const { sessionToken, serviceId } = req.query;
      const userId = req.user?.id;

      if (!userId) {
        throw new ApiError(HttpStatus.UNAUTHORIZED, "User ID is required");
      }

      if (!key) {
        throw new ApiError(HttpStatus.BAD_REQUEST, "Video key is required");
      }

      if (!sessionToken || !serviceId) {
        throw new ApiError(
          HttpStatus.BAD_REQUEST,
          "Session token and service ID are required"
        );
      }

      console.log("MenteeController getSecureVideoUrl step 1", {
        userId,
        serviceId,
        sessionToken: (sessionToken as string).substring(0, 8) + "...",
        key: key.substring(0, 20) + "...",
      });

      // Validate session
      const isValidSession = VideoSessionService.validateSession(
        sessionToken as string,
        userId,
        serviceId as string
      );

      if (!isValidSession) {
        throw new ApiError(
          HttpStatus.UNAUTHORIZED,
          "Invalid or expired video session. Please refresh the page."
        );
      }

      // Decode and validate key
      key = decodeURIComponent(key);
      const bucketUrl = "https://mentorone-app.s3.ap-south-1.amazonaws.com/";
      if (key.startsWith(bucketUrl)) {
        key = key.replace(bucketUrl, "");
      }

      if (key.includes("http://") || key.includes("https://")) {
        throw new ApiError(
          HttpStatus.BAD_REQUEST,
          "Invalid key: Provide S3 object key, not full URL"
        );
      }

      // Generate secure URL using SecureUploadService
      const secureUploadService = new SecureUploadService();
      const secureUrl = await secureUploadService.generateSecureVideoUrl(
        key,
        userId,
        serviceId as string,
        sessionToken as string
      );

      console.log("MenteeController getSecureVideoUrl step 2", {
        urlGenerated: true,
        expiresAt: secureUrl.expiresAt,
      });

      res.status(HttpStatus.OK).json(
        new ApiResponse(
          HttpStatus.OK,
          {
            url: secureUrl.url,
            expiresAt: secureUrl.expiresAt,
            sessionToken: secureUrl.sessionToken,
          },
          "Secure video URL generated successfully"
        )
      );
    } catch (error: any) {
      console.error("Error in getSecureVideoUrl:", error);
      next(error);
    }
  };

  /**
   * Extend video session
   */
  public extendVideoSession = async (
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { sessionToken } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        throw new ApiError(HttpStatus.UNAUTHORIZED, "User ID is required");
      }

      if (!sessionToken) {
        throw new ApiError(HttpStatus.BAD_REQUEST, "Session token is required");
      }

      console.log("MenteeController extendVideoSession step 1", {
        userId,
        sessionToken: sessionToken.substring(0, 8) + "...",
      });

      const extended = VideoSessionService.extendSession(sessionToken);

      if (!extended) {
        throw new ApiError(
          HttpStatus.BAD_REQUEST,
          "Cannot extend session. Session may be invalid or expired."
        );
      }

      console.log("MenteeController extendVideoSession step 2", { extended });

      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            { sessionExtended: true },
            "Video session extended successfully"
          )
        );
    } catch (error: any) {
      console.error("Error in extendVideoSession:", error);
      next(error);
    }
  };

  /**
   * Revoke video session (logout from video)
   */
  public revokeVideoSession = async (
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { sessionToken } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        throw new ApiError(HttpStatus.UNAUTHORIZED, "User ID is required");
      }

      if (!sessionToken) {
        throw new ApiError(HttpStatus.BAD_REQUEST, "Session token is required");
      }

      console.log("MenteeController revokeVideoSession step 1", {
        userId,
        sessionToken: sessionToken.substring(0, 8) + "...",
      });

      const revoked = VideoSessionService.revokeSession(sessionToken);

      console.log("MenteeController revokeVideoSession step 2", { revoked });

      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            { sessionRevoked: revoked },
            "Video session revoked successfully"
          )
        );
    } catch (error: any) {
      console.error("Error in revokeVideoSession:", error);
      next(error);
    }
  };

  /**
   * Get secure HLS playlist for streaming
   */
  public getSecureHLSPlaylist = async (
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { serviceId, episodeId } = req.params;
      const { sessionToken } = req.query;
      const userId = req.user?.id;

      if (!userId) {
        throw new ApiError(HttpStatus.UNAUTHORIZED, "User ID is required");
      }

      if (!serviceId || !sessionToken) {
        throw new ApiError(
          HttpStatus.BAD_REQUEST,
          "Service ID and session token are required"
        );
      }

      console.log("MenteeController getSecureHLSPlaylist step 1", {
        userId,
        serviceId,
        episodeId,
        sessionToken: (sessionToken as string).substring(0, 8) + "...",
      });

      // Validate session using Enhanced Service
      const isValidSession = EnhancedVideoSessionService.validateSession(
        sessionToken as string,
        userId,
        serviceId
      );

      if (!isValidSession) {
        throw new ApiError(
          HttpStatus.UNAUTHORIZED,
          "Invalid or expired video session. Please refresh the page."
        );
      }

      // Check if HLS version exists
      const hlsStatus = await HLSVideoProcessingService.getProcessingStatus(
        serviceId,
        episodeId
      );

      if (!hlsStatus.isProcessed) {
        throw new ApiError(
          HttpStatus.NOT_FOUND,
          "HLS version not available. Video may still be processing."
        );
      }

      // Generate secure HLS playlist
      const securePlaylist =
        await HLSVideoProcessingService.generateSecureHLSPlaylist(
          hlsStatus.playlistKey!,
          sessionToken as string,
          serviceId,
          userId
        );

      console.log("MenteeController getSecureHLSPlaylist step 2", {
        playlistGenerated: true,
        segmentCount: hlsStatus.segmentCount,
      });

      res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");

      res.status(HttpStatus.OK).send(securePlaylist);
    } catch (error: any) {
      console.error("Error in getSecureHLSPlaylist:", error);
      next(error);
    }
  };

  /**
   * Serve secure HLS segments
   */
  public getSecureHLSSegment = async (
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      let { segmentKey } = req.params;
      const { sessionToken, serviceId, userId: requestUserId } = req.query;
      const userId = req.user?.id;

      if (!userId) {
        throw new ApiError(HttpStatus.UNAUTHORIZED, "User ID is required");
      }

      if (!segmentKey || !sessionToken || !serviceId) {
        throw new ApiError(
          HttpStatus.BAD_REQUEST,
          "Segment key, session token, and service ID are required"
        );
      }

      // Additional security: verify user ID matches
      if (requestUserId !== userId) {
        throw new ApiError(HttpStatus.FORBIDDEN, "User ID mismatch");
      }

      console.log("MenteeController getSecureHLSSegment step 1", {
        userId,
        serviceId,
        segmentKey: segmentKey.substring(0, 30) + "...",
        sessionToken: (sessionToken as string).substring(0, 8) + "...",
      });

      // Validate session for EACH segment request
      const isValidSession = EnhancedVideoSessionService.validateSession(
        sessionToken as string,
        userId,
        serviceId as string
      );

      if (!isValidSession) {
        throw new ApiError(
          HttpStatus.UNAUTHORIZED,
          "Invalid or expired video session"
        );
      }

      // Decode segment key
      segmentKey = decodeURIComponent(segmentKey);

      // Generate short-lived presigned URL for segment (5 minutes)
      const segmentUrl = await this.uploadService.S3generatePresignedUrlForGet(
        segmentKey,
        5 * 60 // 5 minutes expiry for segments
      );

      console.log("MenteeController getSecureHLSSegment step 2", {
        segmentUrlGenerated: true,
        segmentKey: segmentKey.substring(0, 30) + "...",
      });

      // Redirect to presigned URL
      res.redirect(segmentUrl);
    } catch (error: any) {
      console.error("Error in getSecureHLSSegment:", error);
      next(error);
    }
  };

  /**
   * Process video to HLS format (for admin/mentor upload)
   */
  public processVideoToHLS = async (
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { serviceId, episodeId, originalVideoKey } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        throw new ApiError(HttpStatus.UNAUTHORIZED, "User ID is required");
      }

      if (!serviceId || !originalVideoKey) {
        throw new ApiError(
          HttpStatus.BAD_REQUEST,
          "Service ID and original video key are required"
        );
      }

      console.log("MenteeController processVideoToHLS step 1", {
        userId,
        serviceId,
        episodeId,
        originalVideoKey,
      });

      // Start HLS processing (this is a long-running operation)
      // In production, you'd want to queue this job
      const processingResult =
        await HLSVideoProcessingService.processVideoToHLS(
          originalVideoKey,
          serviceId,
          episodeId
        );

      console.log("MenteeController processVideoToHLS step 2", {
        processingTime: processingResult.processingTime / 1000 + "s",
        segmentCount: processingResult.segmentCount,
        compressionRatio:
          (
            ((processingResult.originalSize - processingResult.hlsSize) /
              processingResult.originalSize) *
            100
          ).toFixed(1) + "%",
      });

      res.status(HttpStatus.OK).json(
        new ApiResponse(
          HttpStatus.OK,
          {
            hlsPlaylistKey: processingResult.hlsPlaylistKey,
            segmentCount: processingResult.segmentCount,
            processingTime: processingResult.processingTime,
            originalSize: processingResult.originalSize,
            hlsSize: processingResult.hlsSize,
            message: "Video processed to HLS successfully",
          },
          "Video processed to HLS successfully"
        )
      );
    } catch (error: any) {
      console.error("Error in processVideoToHLS:", error);
      next(error);
    }
  };

  /**
   * Check HLS processing status
   */
  public getHLSProcessingStatus = async (
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { serviceId, episodeId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        throw new ApiError(HttpStatus.UNAUTHORIZED, "User ID is required");
      }

      if (!serviceId) {
        throw new ApiError(HttpStatus.BAD_REQUEST, "Service ID is required");
      }

      console.log("MenteeController getHLSProcessingStatus step 1", {
        userId,
        serviceId,
        episodeId,
      });

      const status = await HLSVideoProcessingService.getProcessingStatus(
        serviceId,
        episodeId
      );

      console.log("MenteeController getHLSProcessingStatus step 2", status);

      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            status,
            "HLS processing status retrieved successfully"
          )
        );
    } catch (error: any) {
      console.error("Error in getHLSProcessingStatus:", error);
      next(error);
    }
  };

  /**
   * Get video info and determine best streaming method
   */
  public getVideoStreamingInfo = async (
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { serviceId, episodeId } = req.params;
      const { sessionToken } = req.query;
      const userId = req.user?.id;

      if (!userId) {
        throw new ApiError(HttpStatus.UNAUTHORIZED, "User ID is required");
      }

      if (!serviceId || !sessionToken) {
        throw new ApiError(
          HttpStatus.BAD_REQUEST,
          "Service ID and session token are required"
        );
      }

      console.log("MenteeController getVideoStreamingInfo step 1", {
        userId,
        serviceId,
        episodeId,
      });

      // Validate session
      const isValidSession = EnhancedVideoSessionService.validateSession(
        sessionToken as string,
        userId,
        serviceId
      );

      if (!isValidSession) {
        throw new ApiError(
          HttpStatus.UNAUTHORIZED,
          "Invalid or expired video session"
        );
      }

      // Check HLS availability
      const hlsStatus = await HLSVideoProcessingService.getProcessingStatus(
        serviceId,
        episodeId
      );

      let streamingInfo: any = {
        hasHLS: hlsStatus.isProcessed,
        recommendedMethod: hlsStatus.isProcessed ? "hls" : "progressive",
      };

      if (hlsStatus.isProcessed) {
        // HLS available - provide HLS info
        streamingInfo = {
          ...streamingInfo,
          hlsPlaylistUrl: `/seeker/hls-playlist/${serviceId}${
            episodeId ? `/${episodeId}` : ""
          }?sessionToken=${sessionToken}`,
          segmentCount: hlsStatus.segmentCount,
          security: "high",
          downloadPrevention: "excellent",
        };
      } else {
        // Fallback to legacy secure URL
        streamingInfo = {
          ...streamingInfo,
          legacyVideoUrl: `/seeker/enhanced-secure-video-url`,
          security: "medium",
          downloadPrevention: "limited",
          note: "HLS version not available. Using legacy streaming.",
        };
      }

      console.log("MenteeController getVideoStreamingInfo step 2", {
        hasHLS: streamingInfo.hasHLS,
        recommendedMethod: streamingInfo.recommendedMethod,
      });

      res
        .status(HttpStatus.OK)
        .json(
          new ApiResponse(
            HttpStatus.OK,
            streamingInfo,
            "Video streaming info retrieved successfully"
          )
        );
    } catch (error: any) {
      console.error("Error in getVideoStreamingInfo:", error);
      next(error);
    }
  };

  /**
   * 🔒 SECURE VIDEO PROXY - Stream video through backend with session validation
   * This prevents direct S3 access and provides true session-based security
   */
  public streamSecureVideo = async (
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { videoKey } = req.params;
      const { serviceId, sessionToken } = req.query;
      const userId = req.user?.id;
      const range = req.headers.range;

      console.log("🔒 MenteeController streamSecureVideo step 1", {
        userId: userId?.substring(0, 8) + "...",
        videoKey: videoKey?.substring(0, 30) + "...",
        serviceId,
        hasSessionToken: !!sessionToken,
        hasRange: !!range,
      });

      if (!userId) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          error: "User ID is required",
        });
      }

      if (!videoKey) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          error: "Video key is required",
        });
      }

      if (!sessionToken || !serviceId) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          error: "Session token and service ID are required",
        });
      }

      // Decode the video key
      const decodedVideoKey = decodeURIComponent(videoKey);

      console.log("🔒 MenteeController streamSecureVideo step 2", {
        decodedVideoKey: decodedVideoKey.substring(0, 30) + "...",
      });

      // NEW: First try to find the video S3 key from the migrated data
      let s3Key = null;
      let videoSecureId = null;
      
      try {
        // Import the service to look up the video
        const serviceRepo = (await import("../../repositories/implementations/ServiceRepository")).default;
        const service = await serviceRepo.getServiceById(serviceId as string);
        
        if (service && service.exclusiveContent) {
          // Search through seasons and episodes to find the video by URL
          for (const season of service.exclusiveContent) {
            for (const episode of season.episodes) {
              // Check if the decoded video key matches the original URL or S3 key
              if (episode.videoUrl === decodedVideoKey || episode.originalVideoUrl === decodedVideoKey) {
                s3Key = episode.videoS3Key;
                videoSecureId = episode.videoSecureId;
                console.log("🔒 Found migrated video", { s3Key, videoSecureId });
                break;
              }
            }
            if (s3Key) break;
          }
        }
      } catch (lookupError) {
        console.warn("🔒 Could not lookup migrated video data:", lookupError);
      }
      
      let result;
      
      if (s3Key) {
        // NEW: Use the new industry-standard streaming system
        console.log("🔒 Using new streaming system with S3 key:", s3Key);
        const EnhancedSecureVideoProxy = (await import("../../services/implementations/EnhancedSecureVideoProxy")).default;
        
        const videoRequest = {
          s3Key,
          videoSecureId,
          userId,
          userAgent: req.headers['user-agent'],
          ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
          accessToken: sessionToken as string
        };
        
        const streamingOptions = {
          quality: 'auto',
          enableAnalytics: true
        };
        
        await EnhancedSecureVideoProxy.streamVideoSecurely(
          videoRequest,
          res,
          streamingOptions
        );
        
        result = { success: true };
      } else {
        // FALLBACK: Use legacy system for non-migrated videos
        console.log("🔒 Using legacy streaming system");
        result = await SecureVideoProxyService.streamSecureVideo(
          decodedVideoKey,
          userId,
          serviceId as string,
          sessionToken as string,
          res,
          range
        );
      }

      if (!result.success) {
        console.log(
          "🔒 MenteeController streamSecureVideo step 3 - Failed",
          result.error
        );

        if (result.error === "Invalid session") {
          return res.status(HttpStatus.UNAUTHORIZED).json({
            error: "Invalid or expired video session",
          });
        }

        return res.status(HttpStatus.NOT_FOUND).json({
          error: result.error || "Video not found",
        });
      }

      console.log("🔒 MenteeController streamSecureVideo step 4 - Success");
      // Response is handled by the proxy service
    } catch (error: any) {
      console.error("🔒 Error in streamSecureVideo:", error);

      if (!res.headersSent) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          error: "Failed to stream video",
        });
      }
    }
  };

  /**
   * 🔒 NEW: SECURE VIDEO CHUNK LOADING - For blob-based video protection
   * This completely prevents URL exposure by returning video data as chunks
   */
  public getSecureVideoChunk = async (
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { videoKey, chunkIndex } = req.params;
      const { serviceId, sessionToken, chunkSize } = req.query;
      const userId = req.user?.id;

      console.log("🔒 MenteeController getSecureVideoChunk step 1", {
        userId: userId?.substring(0, 8) + "...",
        videoKey: videoKey?.substring(0, 30) + "...",
        serviceId,
        chunkIndex,
        hasSessionToken: !!sessionToken,
      });

      if (!userId || !videoKey || !sessionToken || !serviceId) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          error: "Missing required parameters",
        });
      }

      // Parse chunk index
      const parsedChunkIndex = parseInt(chunkIndex || "0", 10);
      const parsedChunkSize = parseInt(chunkSize as string || "1048576", 10); // 1MB default

      if (isNaN(parsedChunkIndex) || parsedChunkIndex < 0) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          error: "Invalid chunk index",
        });
      }

      // Decode the video key
      const decodedVideoKey = decodeURIComponent(videoKey);

      console.log("🔒 MenteeController getSecureVideoChunk step 2", {
        decodedVideoKey: decodedVideoKey.substring(0, 30) + "...",
        chunkIndex: parsedChunkIndex,
        chunkSize: parsedChunkSize
      });

      // Get secure video chunk
      const result = await SecureVideoProxyService.getSecureVideoChunk(
        decodedVideoKey,
        userId,
        serviceId as string,
        sessionToken as string,
        parsedChunkIndex,
        parsedChunkSize
      );

      if (!result.success) {
        console.log(
          "🔒 MenteeController getSecureVideoChunk step 3 - Failed",
          result.error
        );

        if (result.error === "Invalid session") {
          return res.status(HttpStatus.UNAUTHORIZED).json({
            error: "Invalid or expired video session",
          });
        }

        return res.status(HttpStatus.NOT_FOUND).json({
          error: result.error || "Video chunk not found",
        });
      }

      console.log("🔒 MenteeController getSecureVideoChunk step 4 - Success");

      // Return chunk data as binary with security headers
      res.set({
        'Content-Type': 'application/octet-stream',
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
        'X-Total-Chunks': result.totalChunks?.toString() || '0',
        'X-Chunk-Index': parsedChunkIndex.toString(),
        'X-Secure-Stream': 'true'
      });

      res.send(result.data);

    } catch (error: any) {
      console.error("🔒 Error in getSecureVideoChunk:", error);

      if (!res.headersSent) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          error: "Failed to get video chunk",
        });
      }
    }
  };

  /**
   * 🔒 GENERATE SIGNED URL FOR VIDEO PLAYBACK
   * Returns a secure, short-lived URL for video access
   */
  public generateVideoSignedUrl = async (
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { videoKey, serviceId, sessionToken } = req.query;
      const userId = req.user?.id;

      console.log("🔒 MenteeController generateVideoSignedUrl step 1", {
        userId: userId?.substring(0, 8) + "...",
        videoKey: typeof videoKey === 'string' ? videoKey.substring(0, 30) + "..." : videoKey,
        serviceId,
        hasSessionToken: !!sessionToken,
      });

      if (!userId || !videoKey || !serviceId || !sessionToken) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          error: "Missing required parameters: videoKey, serviceId, sessionToken",
        });
      }

      // Generate signed URL with enhanced security using new SignedUrlService
      const result = await SignedUrlService.generateSecureVideoUrl(
        videoKey as string,
        userId,
        serviceId as string,
        {
          expiresIn: 300, // 5 minutes in seconds
          responseContentType: 'video/mp4',
          responseContentDisposition: 'inline'
        }
      );

      if (!result.success) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          error: result.error || "Failed to generate signed URL"
        });
      }

      console.log("🔒 MenteeController generateVideoSignedUrl step 2 - Success");

      res.status(HttpStatus.OK).json({
        success: true,
        data: {
          signedUrl: result.signedUrl,
          expiresAt: result.expiresAt,
          expirationMinutes: 5
        },
        message: "Signed URL generated successfully"
      });

    } catch (error: any) {
      console.error("🔒 Error in generateVideoSignedUrl:", error);

      if (error.message?.includes("Invalid or expired session")) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          error: "Invalid or expired video session",
        });
      }

      if (error.message?.includes("Rate limit exceeded")) {
        return res.status(HttpStatus.TOO_MANY_REQUESTS).json({
          error: error.message,
        });
      }

      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: "Failed to generate signed URL",
      });
    }
  };

  /**
   * 🔒 GENERATE SIGNED URLS FOR ALL EPISODES IN TUTORIAL
   * Returns signed URLs for all videos in a tutorial
   */
  public generateTutorialSignedUrls = async (
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { tutorialId } = req.params;
      const { sessionToken } = req.query;
      const userId = req.user?.id;

      console.log("🔒 MenteeController generateTutorialSignedUrls step 1", {
        userId: userId?.substring(0, 8) + "...",
        tutorialId,
        hasSessionToken: !!sessionToken,
      });

      if (!userId || !tutorialId || !sessionToken) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          error: "Missing required parameters: tutorialId, sessionToken",
        });
      }

      // Get tutorial data
      const tutorial = await this.bookingService.getTutorialById(tutorialId);
      
      if (!tutorial) {
        return res.status(HttpStatus.NOT_FOUND).json({
          error: "Tutorial not found",
        });
      }

      // Extract all episodes from all seasons
      const allEpisodes: Array<{ videoKey?: string; videoUrl?: string; _id: string }> = [];
      
      if (tutorial.exclusiveContent) {
        for (const season of tutorial.exclusiveContent) {
          if (season.episodes) {
            allEpisodes.push(...season.episodes);
          }
        }
      }

      console.log("🔒 MenteeController generateTutorialSignedUrls step 2", {
        seasonsCount: tutorial.exclusiveContent?.length || 0,
        episodesCount: allEpisodes.length
      });

      // Extract video keys/URLs from episodes
      const videoKeys = allEpisodes
        .map(episode => episode.videoS3Key || episode.videoUrl)
        .filter(key => key);

      if (videoKeys.length === 0) {
        return res.status(HttpStatus.NOT_FOUND).json({
          error: "No videos found in tutorial"
        });
      }

      // Generate batch signed URLs for all episodes using new service
      const signedUrlResults = await SignedUrlService.generateBatchSignedUrls(
        videoKeys,
        {
          expiresIn: 900, // 15 minutes
          responseContentType: 'video/mp4',
          responseContentDisposition: 'inline'
        }
      );

      // Format results for response
      const signedUrls = allEpisodes.map((episode, index) => {
        const videoKey = episode.videoS3Key || episode.videoUrl;
        const result = videoKey ? signedUrlResults[videoKey] : null;
        
        return {
          episodeId: episode._id,
          signedUrl: result?.success ? result.signedUrl : null,
          expiresAt: result?.expiresAt || null,
          error: result?.success ? null : result?.error
        };
      }).filter(item => item.signedUrl); // Only return successful URLs

      console.log("🔒 MenteeController generateTutorialSignedUrls step 3 - Success", {
        generatedUrls: signedUrls.length
      });

      res.status(HttpStatus.OK).json({
        success: true,
        data: {
          signedUrls,
          totalEpisodes: allEpisodes.length,
          validUrls: signedUrls.length,
          expirationMinutes: 15
        },
        message: "Batch signed URLs generated successfully"
      });

    } catch (error: any) {
      console.error("🔒 Error in generateTutorialSignedUrls:", error);

      if (error.message?.includes("Invalid or expired session")) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          error: "Invalid or expired video session",
        });
      }

      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: "Failed to generate signed URLs",
      });
    }
  };

  /**
   * 🔒 REFRESH SIGNED URL IF EXPIRING SOON
   * Returns a fresh signed URL if the current one is about to expire
   */
  public refreshVideoSignedUrl = async (
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { videoKey, currentSignedUrl, expiresAt, serviceId, sessionToken } = req.body;
      const userId = req.user?.id;

      console.log("🔒 MenteeController refreshVideoSignedUrl step 1", {
        userId: userId?.substring(0, 8) + "...",
        videoKey: videoKey?.substring(0, 30) + "...",
        serviceId,
        expiresAt,
      });

      if (!userId || !videoKey || !currentSignedUrl || !expiresAt || !serviceId || !sessionToken) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          error: "Missing required parameters",
        });
      }

      // Check if refresh is needed and get fresh URL
      const result = await VideoSignedUrlService.refreshSignedUrlIfNeeded(
        currentSignedUrl,
        expiresAt,
        videoKey,
        {
          sessionToken,
          userId,
          serviceId,
          expirationMinutes: 5
        }
      );

      console.log("🔒 MenteeController refreshVideoSignedUrl step 2", {
        refreshed: result.refreshed
      });

      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
        message: result.refreshed ? "URL refreshed successfully" : "Current URL still valid"
      });

    } catch (error: any) {
      console.error("🔒 Error in refreshVideoSignedUrl:", error);

      if (error.message?.includes("Invalid or expired session")) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          error: "Invalid or expired video session",
        });
      }

      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: "Failed to refresh signed URL",
      });
    }
  };

  // 🔄 MIGRATION ENDPOINTS FOR S3 SIGNED URLS
  public migrateVideoUrls = async (
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("🔄 MenteeController migrateVideoUrls: Starting migration");

      const result = await MigrationService.migrateVideoUrlsToS3Keys();

      if (result.success) {
        res.status(HttpStatus.OK).json({
          success: true,
          data: result,
          message: "Video URLs migrated to S3 keys successfully"
        });
      } else {
        res.status(HttpStatus.PARTIAL_CONTENT).json({
          success: false,
          data: result,
          message: "Migration completed with errors"
        });
      }
    } catch (error: any) {
      console.error("🚫 Error in migrateVideoUrls:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: "Failed to migrate video URLs",
      });
    }
  };

  public checkMigrationStatus = async (
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("🔍 MenteeController checkMigrationStatus: Checking status");

      const status = await MigrationService.checkMigrationStatus();

      res.status(HttpStatus.OK).json({
        success: true,
        data: status,
        message: "Migration status retrieved successfully"
      });
    } catch (error: any) {
      console.error("🚫 Error in checkMigrationStatus:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: "Failed to check migration status",
      });
    }
  };
}

export default new menteeController();
