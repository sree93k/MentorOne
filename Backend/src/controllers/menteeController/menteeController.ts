// import { NextFunction, Request, Response } from "express";
// import { ApiError } from "../../middlewares/errorHandler";
// import ApiResponse from "../../utils/apiResponse";
// import imUserAuthService from "../../services/implementations/imUserAuthService";
// import { inUserAuthService } from "../../services/interface/inUserAuthService";
// import imOTPServices from "../../services/implementations/imOTPService";
// import { inOTPService } from "../../services/interface/inOTPService";
// import { inUserService } from "../../services/interface/inUserService";
// import imUserService from "../../services/implementations/imUserService";
// import { EOTP } from "../../entities/OTPEntity";
// import { inUploadService } from "../../services/interface/inUploadService";
// import imUploadService from "../../services/implementations/imUploadService";
// import { inMenteeProfileService } from "../../services/interface/inMenteeProfileService";
// import imMenteeProfileService from "../../services/implementations/imMenteeProfileService";
// import { inMentorProfileService } from "../../services/interface/inMentorProfileService";
// import imMentorProfileService from "../../services/implementations/imMentorProfileService";
// // import {inMenteeService} from '../../services/interface's
// import axios from "axios";
// import sharp from "sharp";
// class menteeController {
//   private userAuthService: inUserAuthService;
//   private OTPServices: inOTPService;
//   private userService: inUserService;
//   private uploadService: inUploadService;
//   private MenteeProfileService: inMenteeProfileService;
//   private MentorProfileService: inMentorProfileService;
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
//   }

//   public uploadWelcomeForm = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       console.log("mnetee controller uploadWelcomeForm step 1");

//       console.log(req.body);
//       console.log("mnetee controller uploadWelcomeForm step 2");
//       const userId = req.body?.id; // Assuming `req.user` contains the authenticated user's details
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
//       res.status(200).json(new ApiResponse(200, response));
//       console.log("mnetee controller uploadWelcomeForm step 7");
//       return;
//     } catch (error) {
//       console.log("mnetee controller uploadWelcomeForm step 8 errro ctach");
//       next(error);
//     }
//   };

//   public uploadProfileImage = async (
//     req: Request & { user?: { id: string } },
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       console.log("menteeCOntrollere uploadProfileImage step 1");

//       const id = req.user?.id;
//       if (!id) {
//         console.log("menteeCOntrollere uploadProfileImage step 2");
//         res.status(401).json(new ApiResponse(401, null, "Unauthorized"));
//         return;
//       }
//       console.log("menteeCOntrollere uploadProfileImage step 3");

//       const imageFile = req.file;
//       console.log("menteeCOntrollere uploadProfileImage step 4");

//       if (!imageFile) {
//         console.log("menteeCOntrollere uploadProfileImage step 5");
//         res.status(400).json(new ApiResponse(400, null, "No file uploaded"));
//         return;
//       }
//       console.log("menteeCOntrollere uploadProfileImage step 6");

//       const resizedImageBuffer = await sharp(imageFile.path)
//         .resize({ width: 1024 })
//         .toBuffer();
//       console.log("menteeCOntrollere uploadProfileImage step 7");

//       const result = await this.uploadService.updateProfileImage(
//         { ...imageFile, buffer: resizedImageBuffer },
//         id
//       );
//       console.log("menteeCOntrollere uploadProfileImage step 8", result);

//       // Check if headers have already been sent before responding
//       if (!res.headersSent) {
//         res
//           .status(200)
//           .json(new ApiResponse(200, { profilePicture: result.url }));
//       }
//       return;
//     } catch (error) {
//       console.log("menteeCOntrollere uploadProfileImage step 9", error);
//       // Only call next if headers haven’t been sent
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
//       console.log("profileData mentee controller step1");
//       const id = req?.user?.id;
//       console.log("id is ", id);

//       if (!id) {
//         res.status(400).json(new ApiResponse(400, null, "User ID is required"));
//         return;
//       }
//       const response = await this.MenteeProfileService.userProfielData(id);
//       if (!response) {
//         console.log("mentee copntroller editUserProfile step 6", response);
//         res.status(404).json(new ApiResponse(404, null, "User not found"));
//         return;
//       }
//       console.log("mentee copntroller editUserProfile step 7", response);
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
//       console.log("getAllMentors controller step 1");
//       const { serviceType } = req.query;
//       console.log("the service query is ", serviceType);

//       const mentors = await this.MenteeProfileService.getAllMentors();
//       console.log("getAllMentors controller step 2: Mentors", mentors);
//       res.json(new ApiResponse(200, mentors, "Mentors fetched successfully"));
//     } catch (error: any) {
//       console.log("getAllMentors controller step 3: Error", {
//         message: error.message,
//         stack: error.stack,
//       });
//       next(error);
//     }
//   };

//   public getMentorById = async (
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
//     try {
//       console.log("getMentorById controller step 1");
//       const { id } = req.params;
//       const mentor = await this.MenteeProfileService.getMentorById(id);
//       console.log("getMentorById controller step 2: Mentor", mentor);
//       res.json(new ApiResponse(200, mentor, "Mentor fetched successfully"));
//     } catch (error: any) {
//       console.log("getMentorById controller step 3: Error", {
//         message: error.message,
//         stack: error.stack,
//       });
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
    maxAge: 1000 * 60 * 60 * 24 * 2, // 2 days
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
}

export default new menteeController();
