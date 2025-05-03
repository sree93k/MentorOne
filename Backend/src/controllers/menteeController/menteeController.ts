// import { NextFunction, Request, Response } from "express";
// import { ApiError } from "../../middlewares/errorHandler";
// import ApiResponse from "../../utils/apiResponse";
// import imUserAuthService from "../../services/implementations/imUserAuthService";
// import { inUserAuthService } from "../../services/interface/inUserAuthService";
// import imOTPServices from "../../services/implementations/imOTPService";
// import { inOTPService } from "../../services/interface/inOTPService";
// import { inUserService } from "../../services/interface/inUserService";
// import imUserService from "../../services/implementations/imUserService";
// import { inUploadService } from "../../services/interface/inUploadService";
// import imUploadService from "../../services/implementations/imUploadService";
// import { inMenteeProfileService } from "../../services/interface/inMenteeProfileService";
// import imMenteeProfileService from "../../services/implementations/imMenteeProfileService";
// import { inMentorProfileService } from "../../services/interface/inMentorProfileService";
// import imMentorProfileService from "../../services/implementations/imMentorProfileService";
// import BookingService from "../../services/implementations/imBookingservice";
// import { inBookingService } from "../../services/interface/inBookingService";
// import sharp from "sharp";

// class menteeController {
//   private userAuthService: inUserAuthService;
//   private OTPServices: inOTPService;
//   private userService: inUserService;
//   private uploadService: inUploadService;
//   private MenteeProfileService: inMenteeProfileService;
//   private MentorProfileService: inMentorProfileService;
//   private bookingService: inBookingService;
//   private options = {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "strict" as const,
//     maxAge: 1000 * 60 * 60 * 24 * 2, // 2 days
//   };

//   constructor() {
//     this.userAuthService = new imUserAuthService();
//     this.OTPServices = new imOTPServices();
//     this.userService = new imUserService();
//     this.uploadService = new imUploadService();
//     this.MenteeProfileService = new imMenteeProfileService();
//     this.MentorProfileService = new imMentorProfileService();
//     this.bookingService = new BookingService();
//   }

//   public getBookings = async (
//     req: Request & { user?: { id: string } },
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       const menteeId = req.user?.id;
//       if (!menteeId) {
//         throw new ApiError(401, "Unauthorized", "User ID is required");
//       }

//       const bookings = await this.bookingService.getBookingsByMentee(menteeId);
//       res.json(new ApiResponse(200, bookings, "Bookings fetched successfully"));
//     } catch (error) {
//       next(error);
//     }
//   };

//   public uploadWelcomeForm = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       const userId = req.body?.id;
//       if (!userId) {
//         throw new ApiError(400, "User ID is required");
//       }
//       const response = await this.MenteeProfileService.welcomeData(
//         req.body,
//         userId
//       );
//       res.status(200).json(new ApiResponse(200, response));
//     } catch (error) {
//       next(error);
//     }
//   };

//   public uploadProfileImage = async (
//     req: Request & { user?: { id: string } },
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       const id = req.user?.id;
//       if (!id) {
//         res.status(401).json(new ApiResponse(401, null, "Unauthorized"));
//         return;
//       }

//       const imageFile = req.file;
//       if (!imageFile) {
//         res.status(400).json(new ApiResponse(400, null, "No file uploaded"));
//         return;
//       }

//       const resizedImageBuffer = await sharp(imageFile.path)
//         .resize({ width: 1024 })
//         .toBuffer();

//       const result = await this.uploadService.updateProfileImage(
//         { ...imageFile, buffer: resizedImageBuffer },
//         id
//       );

//       if (!res.headersSent) {
//         res
//           .status(200)
//           .json(new ApiResponse(200, { profilePicture: result.url }));
//       }
//     } catch (error) {
//       if (!res.headersSent) {
//         next(error);
//       }
//     }
//   };

//   public deleteAccount = async (
//     req: Request & { user?: { id: string } },
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       const id = req.user?.id;
//       if (!id) {
//         res.status(401).json(new ApiResponse(401, null, "Unauthorized"));
//         return;
//       }

//       const deleted = await this.MenteeProfileService.deleteAccount(id);
//       if (!deleted) {
//         res.status(404).json(new ApiResponse(404, null, "User not found"));
//         return;
//       }

//       res
//         .status(200)
//         .json(new ApiResponse(200, null, "Account deleted successfully"));
//     } catch (error) {
//       next(error);
//     }
//   };

//   public profileData = async (
//     req: Request & { user?: { id: string } },
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       const id = req?.user?.id;
//       if (!id) {
//         res.status(400).json(new ApiResponse(400, null, "User ID is required"));
//         return;
//       }
//       const response = await this.MenteeProfileService.userProfielData(id);
//       if (!response) {
//         res.status(404).json(new ApiResponse(404, null, "User not found"));
//         return;
//       }
//       res
//         .status(200)
//         .json(new ApiResponse(200, response, "Profile updated successfully"));
//     } catch (error) {
//       next(error);
//     }
//   };

//   public getAllMentors = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       const { serviceType } = req.query;
//       const mentors = await this.MenteeProfileService.getAllMentors();
//       res.json(new ApiResponse(200, mentors, "Mentors fetched successfully"));
//     } catch (error: any) {
//       next(error);
//     }
//   };

//   public getMentorById = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       const { id } = req.params;
//       const mentor = await this.MenteeProfileService.getMentorById(id);
//       res.json(new ApiResponse(200, mentor, "Mentor fetched successfully"));
//     } catch (error: any) {
//       next(error);
//     }
//   };

//   public getAllTutorials = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       console.log("mnetee controller getAllTutorials step 1");
//       const tutorials = await this.bookingService.getAllVideoTutorials();
//       console.log("mnetee controller getAllTutorials step 2", tutorials);
//       res.json(
//         new ApiResponse(200, tutorials, "Video tutorials fetched successfully")
//       );
//     } catch (error: any) {
//       console.log("mnetee controller getAllTutorials step 3 error ", error);
//       next(error);
//     }
//   };

//   public getTutorialById = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       const { id } = req.params;
//       // if (!mongoose.Types.ObjectId.isValid(id)) {
//       //   throw new ApiError(400, "Invalid tutorial ID");
//       // }
//       const tutorial = await this.bookingService.getTutorialById(id);
//       if (!tutorial) {
//         throw new ApiError(404, "Tutorial not found");
//       }
//       res.json(new ApiResponse(200, tutorial, "Tutorial fetched successfully"));
//     } catch (error: any) {
//       next(error);
//     }
//   };

// }

// export default new menteeController();
import { NextFunction, Request, Response } from "express";
import { ApiError } from "../../middlewares/errorHandler";
import ApiResponse from "../../utils/apiResponse";
import imUserAuthService from "../../services/implementations/imUserAuthService";
import { inUserAuthService } from "../../services/interface/inUserAuthService";
import imOTPServices from "../../services/implementations/imOTPService";
import { inOTPService } from "../../services/interface/inOTPService";
import { inUserService } from "../../services/interface/inUserService";
import imUserService from "../../services/implementations/imUserService";
import { inUploadService } from "../../services/interface/inUploadService";
import imUploadService from "../../services/implementations/imUploadService";
import { inMenteeProfileService } from "../../services/interface/inMenteeProfileService";
import imMenteeProfileService from "../../services/implementations/imMenteeProfileService";
import { inMentorProfileService } from "../../services/interface/inMentorProfileService";
import imMentorProfileService from "../../services/implementations/imMentorProfileService";
import BookingService from "../../services/implementations/imBookingservice";
import { inBookingService } from "../../services/interface/inBookingService";
import sharp from "sharp";
import stripe from "../../config/stripe";

class menteeController {
  private userAuthService: inUserAuthService;
  private OTPServices: inOTPService;
  private userService: inUserService;
  private uploadService: inUploadService;
  private MenteeProfileService: inMenteeProfileService;
  private MentorProfileService: inMentorProfileService;
  private bookingService: inBookingService;
  private options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: 1000 * 60 * 60 * 24 * 2,
  };

  constructor() {
    this.userAuthService = new imUserAuthService();
    this.OTPServices = new imOTPServices();
    this.userService = new imUserService();
    this.uploadService = new imUploadService();
    this.MenteeProfileService = new imMenteeProfileService();
    this.MentorProfileService = new imMentorProfileService();
    this.bookingService = new BookingService();
  }

  public getBookings = async (
    req: Request & { user?: { id: string } },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const menteeId = req.user?.id;
      if (!menteeId) {
        throw new ApiError(401, "Unauthorized", "User ID is required");
      }

      const bookings = await this.bookingService.getBookingsByMentee(menteeId);
      res.json(new ApiResponse(200, bookings, "Bookings fetched successfully"));
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
        throw new ApiError(400, "User ID is required");
      }
      const response = await this.MenteeProfileService.welcomeData(
        req.body,
        userId
      );
      res.status(200).json(new ApiResponse(200, response));
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
        res.status(401).json(new ApiResponse(401, null, "Unauthorized"));
        return;
      }

      const imageFile = req.file;
      if (!imageFile) {
        res.status(400).json(new ApiResponse(400, null, "No file uploaded"));
        return;
      }

      const resizedImageBuffer = await sharp(imageFile.path)
        .resize({ width: 1024 })
        .toBuffer();

      const result = await this.uploadService.updateProfileImage(
        { ...imageFile, buffer: resizedImageBuffer },
        id
      );

      if (!res.headersSent) {
        res
          .status(200)
          .json(new ApiResponse(200, { profilePicture: result.url }));
      }
    } catch (error) {
      if (!res.headersSent) {
        next(error);
      }
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
      const id = req?.user?.id;
      if (!id) {
        res.status(400).json(new ApiResponse(400, null, "User ID is required"));
        return;
      }
      const response = await this.MenteeProfileService.userProfielData(id);
      if (!response) {
        res.status(404).json(new ApiResponse(404, null, "User not found"));
        return;
      }
      res
        .status(200)
        .json(new ApiResponse(200, response, "Profile updated successfully"));
    } catch (error) {
      next(error);
    }
  };

  public getAllMentors = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { serviceType } = req.query;
      const mentors = await this.MenteeProfileService.getAllMentors();
      res.json(new ApiResponse(200, mentors, "Mentors fetched successfully"));
    } catch (error: any) {
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
      const mentor = await this.MenteeProfileService.getMentorById(id);
      res.json(new ApiResponse(200, mentor, "Mentor fetched successfully"));
    } catch (error: any) {
      next(error);
    }
  };

  public getAllTutorials = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("mentee controller getAllTutorials step 1");
      const tutorials = await this.bookingService.getAllVideoTutorials();
      console.log("mentee controller getAllTutorials step 2", tutorials);
      res.json(
        new ApiResponse(200, tutorials, "Video tutorials fetched successfully")
      );
    } catch (error: any) {
      console.log("mentee controller getAllTutorials step 3 error ", error);
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
      const tutorial = await this.bookingService.getTutorialById(id);
      if (!tutorial) {
        throw new ApiError(404, "Tutorial not found");
      }
      res.json(new ApiResponse(200, tutorial, "Tutorial fetched successfully"));
    } catch (error: any) {
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
        throw new ApiError(401, "Unauthorized", "User ID is required");
      }
      if (!serviceId) {
        throw new ApiError(400, "Service ID is required");
      }
      const isBooked = await this.bookingService.checkBookingStatus(
        menteeId,
        serviceId
      );
      res.json(
        new ApiResponse(
          200,
          { isBooked },
          "Booking status checked successfully"
        )
      );
    } catch (error: any) {
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
        throw new ApiError(401, "Unauthorized", "User ID is required");
      }
      if (!serviceId || !amount) {
        throw new ApiError(400, "Service ID and amount are required");
      }
      const tutorial = await this.bookingService.getTutorialById(serviceId);
      if (!tutorial) {
        throw new ApiError(404, "Tutorial not found");
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
              unit_amount: amount * 100, // Convert to paise
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.CLIENT_URL}/digitalcontent/${serviceId}?payment=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_URL}/digitalcontent/${serviceId}?payment=cancel`,
        metadata: { menteeId, serviceId },
      });
      res.json(
        new ApiResponse(
          200,
          { sessionId: session.id, url: session.url },
          "Payment session created"
        )
      );
    } catch (error: any) {
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
        throw new ApiError(401, "Unauthorized", "User ID is required");
      }
      if (!serviceId || !mentorId || !sessionId) {
        throw new ApiError(
          400,
          "Service ID, mentor ID, and session ID are required"
        );
      }
      const booking = await this.bookingService.bookService({
        serviceId,
        mentorId,
        menteeId,
        sessionId,
      });
      res.json(new ApiResponse(200, booking, "Service booked successfully"));
    } catch (error: any) {
      next(error);
    }
  };

  // public getVideoUrl = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> => {
  //   try {
  //     const { key } = req.params;
  //     if (!key) {
  //       throw new ApiError(400, "Video key is required");
  //     }
  //     const url = await this.uploadService.S3generatePresignedUrlForGet(
  //       decodeURIComponent(key)
  //     );
  //     res.json(
  //       new ApiResponse(200, { url }, "Video URL generated successfully")
  //     );
  //   } catch (error: any) {
  //     next(error);
  //   }
  // };

  public getVideoUrl = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      let { key } = req.params;
      if (!key) {
        throw new ApiError(400, "Video key is required");
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
          400,
          "Invalid key: Provide S3 object key, not full URL"
        );
      }

      const url = await this.uploadService.S3generatePresignedUrlForGet(key);
      console.log("Generated presigned URL:", url);
      res.json(
        new ApiResponse(200, { url }, "Video URL generated successfully")
      );
    } catch (error: any) {
      console.error("Error in getVideoUrl:", error);
      next(error);
    }
  };
}

export default new menteeController();
